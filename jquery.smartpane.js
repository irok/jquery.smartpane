/**
 * jQuery SmartPane
 * $Id: jquery.smartpane.js,v 1.2.0 2013/03/09 14:19:30 irokawa Exp $
 *
 * Licensed under the MIT license.
 * Copyright 2013 Takayuki Irokawa
 *
 * @requires jquery.js
 */

(function($){
    var panes = [], prevScrollTop;

    if ($.support.fixedPosition === false)
        return;

    $.smartpane = function(element, type) {
        this.$self = $(element);
        this.$parent = this.$self.parent();
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
                'left': '0px'
            });
            this.position = 'top';
            var offset = this.$self.offset();
            this.containerTop  = offset.top  - parseInt(this.$self.css('margin-top'));
            this.containerLeft = offset.left - parseInt(this.$self.css('margin-left'));
            this.offsetTop = 0;
        },
        'update': function(view) {
            this.height          = this.$self.outerHeight(true);
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
                        'top':  (this.containerTop + this.offsetTop - view.top) + 'px',
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
            $.smartpane.onresize.apply(this);
        },
        'onresize': function() {
            $.each(panes, $.smartpane.prototype.init);
            $.smartpane.onscroll.apply(this);
        },
        'onscroll': function() {
            $.smartpane.event = this.event;
            var $window = $(window);
            var view = {
                'top':    $window.scrollTop(),
                'left':   $window.scrollLeft(),
                'height': $window.height()
            };
            view.bottom = view.top + view.height;
            view.scrollDist = view.top - prevScrollTop;
            view.scroll = prevScrollTop < view.top ? 'down'
                        : prevScrollTop > view.top ? 'up'
                        :                            'none';
            prevScrollTop = view.top;

            $.each(panes, $.smartpane.prototype.update, [view]);
        }
    });

    $.fn.smartpane = function(type) {
        return this.each(function() {
            var $this = $(this);
            if ($this.data('smartpane') == undefined) {
                $this.data('smartpane', type);
                panes.push(new $.smartpane(this, type));
            }
        });
    };

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
