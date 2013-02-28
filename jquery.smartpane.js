/**
 * jQuery SmartPane
 * $Id: jquery.smartpane.js,v 1.0.0 2013/02/28 14:54:09 irokawa Exp $
 *
 * Licensed under the MIT license.
 * Copyright 2013 Takayuki Irokawa
 *
 * @requires jquery.js
 * @event scroll, resize
 */

(function($){
    var panes = [], panes_length = 0;

    if ($.support.fixedPosition === false)
        return;

    var SmartPane = function(element, type) {
        this.$self = $(element);
        this.$parent = this.$self.parent();
        this.type = type;
        this.init();
        this.$parent.css('position','relative');
    };
    SmartPane.each = function(callback, args) {
        for (var i = 0; i < panes_length; i++)
            callback.call(panes[i], args);
    };
    SmartPane.prototype = {
        'init': function() {
            this.$self.css({
                'position': 'relative',
                'top': '0px',
                'left': '0px'
            });
            this.position = 'top';
            var offset = this.$self.offset();
            this.origTop  = offset.top;
            this.origLeft = offset.left;
            this.parentTop = this.$parent.offset().top;
        },
        'refresh': function(view) {
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

    $.smartpane = {
        'init': function() {
            SmartPane.each(SmartPane.prototype.init);
            $.smartpane.scroll.apply(this);
        },
        'scroll': function() {
            var $window = $(window);
            var view = {
                'top':    $window.scrollTop(),
                'height': $window.height()
            };
            view.bottom = view.top + view.height;
            SmartPane.each(SmartPane.prototype.refresh, view);
        }
    };

    $(function(){
        $('[data-smartpane]').each(function(){
            panes.push(new SmartPane(this, $(this).data('smartpane')));
            panes_length++;
        });
        if (panes_length !== 0) {
            $(window).resize($.smartpane.init);
            $(window).scroll($.smartpane.scroll);
            $.smartpane.init.apply(window);
        }
    });
})(jQuery);
