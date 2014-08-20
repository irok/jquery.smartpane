/**
 * jQuery SmartPane v0.3.1
 * https://github.com/irok/jquery.smartpane
 *
 * Copyright 2013 irok
 * Released under the MIT license
 * https://github.com/irok/jquery.smartpane/blob/master/LICENSE
 *
 * Date: 2014-08-20T09:13:26Z
 */
(function($){
    var panes = [], view = {}, options = {}, initialized = false, prevScrollTop;

    if ($.support.fixedPosition !== undefined && $.support.fixedPosition === false)
        return;

    $.smartpane = function(element, type) {
        this.$self = $(element);
        this.$parent = this.$self.parent();
        while (this.$parent.innerHeight() === 0) {
          this.$parent = this.$parent.parent();
        }
        this.type = type;

        var parentPosition = this.$parent.css('position');
        if (parentPosition !== 'relative' && parentPosition !== 'absolute') {
            this.$parent.css('position','relative');
        }

        this.init();
    };

    $.smartpane.prototype = {
        'init': function() {
            this.$self.css({
                'position': 'relative',
                'top': '0px',
                'left': '0px',
                'width': this.$self.innerWidth()
            });
            this.position = 'top';
            var offset = this.$self.offset();
            this.containerTop  = offset.top  - parseInt(this.$self.css('margin-top'));
            this.containerLeft = offset.left - parseInt(this.$self.css('margin-left'));
            this.offsetTop = 0;
        },
        'update': function() {
            this.height          = this.$self.outerHeight();
            this.containerBottom = this.containerTop + this.$parent.innerHeight();
            var pos;

            var type = this.type;
            if (this.height < view.height || type === 'both' && $.smartpane.event.type === 'resize') {
                type = 'top';
            }

            switch (type) {
            case 'top':
                if (view.top <= this.containerTop)
                    pos = 'top';
                else if (this.containerBottom <= view.top + this.height)
                    pos = 'bottom';
                else {
                    pos = 'fixed';
                    this.offsetTop = view.top - this.containerTop;
                }
                break;
            case 'bottom':
                if (view.bottom <= this.containerTop + this.height)
                    pos = 'top';
                else if (this.containerBottom <= view.bottom)
                    pos = 'bottom';
                else {
                    pos = 'fixed';
                    this.offsetTop = view.bottom - this.height - this.containerTop;
                }
                break;
            case 'both':
                if (view.top <= this.containerTop)
                    pos = 'top';
                else if (this.containerBottom <= view.bottom)
                    pos = 'bottom';
                else if (view.scroll === 'up' && view.top < this.containerTop + this.offsetTop) {
                    pos = 'fixed';
                    this.offsetTop = view.top - this.containerTop;
                }
                else if (view.scroll === 'down' && this.containerTop + this.offsetTop + this.height < view.bottom) {
                    pos = 'fixed';
                    this.offsetTop = view.bottom - this.height - this.containerTop;
                }
                else
                    pos = 'relative';
            }

            if (pos !== this.position || pos === 'fixed') {
                switch (pos) {
                case 'fixed':
                    this.$self.css({
                        'position': 'fixed',
                        'top':  (this.containerTop + this.offsetTop - view.scrollTop) + 'px',
                        'left': (this.containerLeft - view.left) + 'px'
                    });
                    break;
                case 'bottom':
                    this.$self.css({
                        'position': 'relative',
                        'top': (this.offsetTop = this.containerBottom - this.containerTop - this.height) + 'px',
                        'left': '0px'
                    });
                    break;
                case 'top':
                    this.$self.css({
                        'position': 'relative',
                        'top': (this.offsetTop = 0) + 'px',
                        'left': '0px'
                    });
                    break;
                case 'relative':
                    this.$self.css({
                        'position': 'relative',
                        'top':  this.offsetTop + 'px',
                        'left': '0px'
                    });
                }
                this.position = pos;
            }
        }
    };

    $.extend($.smartpane, {
        'init': function(){
            initialized = true;
            $.smartpane.onresize.call(this, $.Event('init'));
        },
        'onresize': function() {
            applyOptions();
            $.each(panes, $.smartpane.prototype.init);
            $.smartpane.onscroll.apply(this, arguments);
        },
        'onscroll': function(event) {
            $.smartpane.event = event;
            var $window = $(window);
            view.scrollTop = $window.scrollTop();
            view.top    = view.scrollTop + view.marginTop;
            view.left   = $window.scrollLeft();
            view.height = $window.height() - view.marginTop - view.marginBottom;
            view.bottom = view.top + view.height;
            view.scrollDist = view.scrollTop - prevScrollTop;
            view.scroll = prevScrollTop < view.scrollTop ? 'down'
                        : prevScrollTop > view.scrollTop ? 'up'
                        :                                  'none';
            prevScrollTop = view.scrollTop;

            $.each(panes, $.smartpane.prototype.update);
        },
        'options': function(args) {
            $.extend(options, args);
            applyOptions();
        }
    });

    $.fn.smartpane = function(type) {
        return this.each(function() {
            var $this = $(this);
            if ($this.data('smartpane') === undefined) {
                $this.data('smartpane', type);
                panes.push(new $.smartpane(this, type));
            }
        });
    };

    function applyOptions() {
        if (initialized) {
            view.marginTop    = options.fixedHeader ? $(options.fixedHeader).outerHeight() : 0;
            view.marginBottom = options.fixedFooter ? $(options.fixedFooter).outerHeight() : 0;
        }
    }

    $(function(){
        var $window = $(window);
        prevScrollTop = $window.scrollTop();
        $window.resize($.smartpane.onresize);
        $window.scroll($.smartpane.onscroll);

        $('[data-smartpane]').each(function(){
            panes.push(new $.smartpane(this, $(this).data('smartpane')));
        });
        $.smartpane.init.apply(window);
    });
})(jQuery);
