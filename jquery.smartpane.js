/**
 * jQuery SmartPane
 * $Id: jquery.smartpane.js,v 1.1.0 2013/03/01 10:57:15 irokawa Exp $
 *
 * Licensed under the MIT license.
 * Copyright 2013 Takayuki Irokawa
 *
 * @requires jquery.js
 * @event scroll, resize
 */

(function($){
    var panes = [];

    if ($.support.fixedPosition === false)
        return;

    $.smartpane = function(element, type) {
        this.$self = $(element);
        this.$parent = this.$self.parent();
        this.type = type;
        this.init();
        this.$parent.css('position','relative');
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
            this.origTop  = offset.top  - parseInt(this.$self.css('margin-top'));
            this.origLeft = offset.left - parseInt(this.$self.css('margin-left'));
            this.parentTop = this.$parent.offset().top;
        },
        'update': function(view) {
            this.height       = this.$self.outerHeight(true);
            this.parentHeight = this.$parent.outerHeight(true);
            this.parentBottom = this.parentTop + this.parentHeight;
            var pos;

            if (this.type === 'top') {
                if (this.origTop < view.top) {
                    if (view.top + this.height < this.parentBottom) {
                        pos = 'fixed';
                        this.fixedTop = 0;
                    }
                    else pos = 'bottom';
                }
                else pos = 'top';
            }
            else if (this.type === 'bottom') {
                if (this.origTop + this.height < view.bottom) {
                    if (view.bottom < this.parentBottom) {
                        pos = 'fixed';
                        this.fixedTop = view.height - this.height;
                    }
                    else pos = 'bottom';
                }
                else pos = this.height < view.height ? 'bottom' : 'top';
            }

            if (pos !== this.position) {
                switch (pos) {
                case 'fixed':
                    this.$self.css({
                        'position': 'fixed',
                        'top':  this.fixedTop + 'px',
                        'left': this.origLeft + 'px'
                    });
                    break;
                case 'bottom':
                    this.$self.css({
                        'position': 'relative',
                        'top': (this.parentHeight - this.height) + 'px',
                        'left': '0px'
                    });
                    break;
                case 'top':
                    this.$self.css({
                        'position': 'relative',
                        'top': '0px',
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
            var $window = $(window);
            var view = {
                'top':    $window.scrollTop(),
                'height': $window.height()
            };
            view.bottom = view.top + view.height;
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
        $('[data-smartpane]').each(function(){
            panes.push(new $.smartpane(this, $(this).data('smartpane')));
        });
        $(window).resize($.smartpane.onresize);
        $(window).scroll($.smartpane.onscroll);
        $.smartpane.init.apply(window);
    });
})(jQuery);
