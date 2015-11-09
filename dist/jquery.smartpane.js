/**
 * jQuery SmartPane v0.3.3
 * https://github.com/irok/jquery.smartpane
 *
 * Copyright 2013 irok
 * Released under the MIT license
 * https://github.com/irok/jquery.smartpane/blob/master/LICENSE
 *
 * Date: 2015-11-09T11:03:45Z
 */
(function($){
    var $window   = $(window),
        $document = $(document),
        panes = [], view = {}, options = {}, initialized = false, documentHeight = 0, prevScrollTop;

    if ($.support.fixedPosition !== undefined && $.support.fixedPosition === false)
        return;

    $.smartpane = function(element, type) {
        var _this = this, parentPosition;
        _this.$self = $(element);
        _this.$parent = _this.$self.parent();
        while (_this.$parent.innerHeight() === 0) {
          _this.$parent = _this.$parent.parent();
        }
        _this.type = type;

        parentPosition = _this.$parent.css('position');
        if (parentPosition !== 'relative' && parentPosition !== 'absolute') {
            _this.$parent.css('position','relative');
        }

        if (initialized) {
            _this.init();
        }
    };

    $.smartpane.prototype = {
        'init': function() {
            var _this = this, $self = _this.$self, offset;
            $self.css({
                'position': 'relative',
                'top': '0px',
                'left': '0px',
                'width': $self.css('box-sizing') === 'border-box' ? $self.outerWidth() : $self.innerWidth()
            });
            _this.position = 'top';
            offset = $self.offset();
            _this.containerTop  = offset.top  - parseInt($self.css('margin-top'));
            _this.containerLeft = offset.left - parseInt($self.css('margin-left'));
            _this.offsetTop = 0;
        },
        'update': function() {
            var _this = this, type = _this.type, pos;
            _this.height          = _this.$self.outerHeight();
            _this.containerBottom = _this.containerTop + _this.$parent.innerHeight();

            if (_this.height < view.height || type === 'both' && $.smartpane.event.type === 'resize') {
                type = 'top';
            }

            switch (type) {
            case 'top':
                if (view.top <= _this.containerTop)
                    pos = 'top';
                else if (_this.containerBottom <= view.top + _this.height)
                    pos = 'bottom';
                else {
                    pos = 'fixed';
                    _this.offsetTop = view.top - _this.containerTop;
                }
                break;
            case 'bottom':
                if (view.bottom <= _this.containerTop + _this.height)
                    pos = 'top';
                else if (_this.containerBottom <= view.bottom)
                    pos = 'bottom';
                else {
                    pos = 'fixed';
                    _this.offsetTop = view.bottom - _this.height - _this.containerTop;
                }
                break;
            case 'both':
                if (view.top <= _this.containerTop)
                    pos = 'top';
                else if (_this.containerBottom <= view.bottom)
                    pos = 'bottom';
                else if (view.scroll === 'up' && view.top < _this.containerTop + _this.offsetTop) {
                    pos = 'fixed';
                    _this.offsetTop = view.top - _this.containerTop;
                }
                else if (view.scroll === 'down' && _this.containerTop + _this.offsetTop + _this.height < view.bottom) {
                    pos = 'fixed';
                    _this.offsetTop = view.bottom - _this.height - _this.containerTop;
                }
                else
                    pos = 'relative';
            }

            if (pos !== _this.position || pos === 'fixed') {
                switch (pos) {
                case 'fixed':
                    _this.$self.css({
                        'position': 'fixed',
                        'top':  (_this.containerTop + _this.offsetTop - view.scrollTop) + 'px',
                        'left': (_this.containerLeft - view.left) + 'px'
                    });
                    break;
                case 'bottom':
                    _this.$self.css({
                        'position': 'relative',
                        'top': (_this.offsetTop = _this.containerBottom - _this.containerTop - _this.height) + 'px',
                        'left': '0px'
                    });
                    break;
                case 'top':
                    _this.$self.css({
                        'position': 'relative',
                        'top': (_this.offsetTop = 0) + 'px',
                        'left': '0px'
                    });
                    break;
                case 'relative':
                    _this.$self.css({
                        'position': 'relative',
                        'top':  _this.offsetTop + 'px',
                        'left': '0px'
                    });
                }
                _this.position = pos;
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

            var _documentHeight = $document.innerHeight();
            if (documentHeight !== _documentHeight) {
                documentHeight = _documentHeight;
                $.each(panes, $.smartpane.prototype.init);
            }
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
            documentHeight = $document.innerHeight();
            view.marginTop    = options.fixedHeader ? $(options.fixedHeader).outerHeight() : 0;
            view.marginBottom = options.fixedFooter ? $(options.fixedFooter).outerHeight() : 0;
        }
    }

    $(function(){
        prevScrollTop = $window.scrollTop();
        $window.resize($.smartpane.onresize);
        $window.scroll($.smartpane.onscroll);

        $('[data-smartpane]').each(function(){
            panes.push(new $.smartpane(this, $(this).data('smartpane')));
        });
        $.smartpane.init.apply(window);
    });
})(jQuery);
