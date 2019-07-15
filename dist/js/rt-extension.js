(function($){

    window.ms_responsiveExpandExtension = function(){
        function set_style() {
            var style = '.ms-responsive .ms-left{width: 100% !important;}.ms-responsive .ms-right{display: none;}';
            make_style('ms-responsive-stylesheet', style)
        }
        function make_style(style_id, style) {
            $('#' + style_id).length || $('<style id="' + style_id + '">' + style + '</style>').appendTo('head');
        }
        function check_menu() {
            return '#menu' === msData.options.menu
        }
        function check_body_have(){
             return $('body').hasClass('ms-responsive');
        }
        function check_panel() {
            return $('.ms-section.active').data('panel') === 'ms-right' ? 'ms-left' : 'ms-right'
        }
        function check_index() {
            var activeDataIndex = $('.ms-section.active').data('index');
            if (check_menu()) {
                var msSectionLengthHalf = $('.ms-left').find('.ms-section').length / 2,
                    index = msSectionLengthHalf - activeDataIndex - 1
            };
            return index;
        }
        function setActivePositionTop($item) {
            if($item.find('.ms-section.active').length){
                // console.log($item.find('.ms-section.active').position());
                var topPosition = $item.find('.ms-section.active').position().top,
                position = Math.round(topPosition);
                msData.options.css3 && msData.options.autoScrolling && msData.options['fp-fixed'] ? msData.internals.transformContainer($, 'translate3d(0px, -' + position + 'px, 0px)', !1) : msData.options.autoScrolling && check_menu() ? $.css('top', -position) : $('html, body').scrollTop(position)
            }
        }
        
        function createResponsiveLayout(){
            var width = msData.options.responsiveWidth,
                height = msData.options.responsiveHeight,
                bWidth = width && $(window).outerWidth() < width,
                bHeight = height && $(window).height() < height,
                length = bWidth || bHeight;
                // console.log(width, bWidth, length, $(window).outerWidth());

            if(length){
                $('body, html').css({
                    overflow: 'visible',
                    height: 'initial'
                });
                $('body').addClass('ms-responsive');
                $('#multiscroll-nav, #msmenu').hide();
                if($.isFunction(msData.options.afterResponsive)){
                    msData.options.afterResponsive($('.multiscroll-wrapper'), length);
                }
                sorting(length);
                $(!1, 'internal');
                
            }else{
                $('body, html').css({
                    overflow: 'hidden',
                    height: '100%'
                });
                $('body').removeClass('ms-responsive');
                $('#multiscroll-nav, #msmenu').show();
                if($.isFunction(msData.options.afterResponsive)){
                    msData.options.afterResponsive($('.multiscroll-wrapper'), length);
                }
                sorting();
                $(!0, 'internal');
            }
        }
        function sorting(length) {
            if(length){
                $('.ms-right').find('.ms-section.active').removeClass('active');
                $('.ms-right').find('.ms-section').appendTo('.ms-left');
                var sections = $('.ms-left').find('.ms-section').sort(function(first, second) {
                    return $(first).data('position') - $(second).data('position')
                });
                $('.ms-left').empty().append(sections);
                $('.ms-left').find('.ms-section').each(function(){
                    $(this).css('height', 'auto').find('.ms-tableCell').css('height', 'auto');
                });
                
                var leftSections = $('.ms-left').find('.ms-section[data-panel="ms-left"]');
                var rightSections = $('.ms-left').find('.ms-section[data-panel="ms-right"]');
                var arrayCombined = $.map(leftSections, function(item, i) {
                    // console.log(item,i, leftSections.length);
                    return [item, rightSections[rightSections.length - (i+1)]];
                  });
                $('.ms-left').empty().append(arrayCombined);
            }else{
                $('.ms-left, .ms-right').find('.ms-section').each(function(){
                    $(this).css('height', '100%').find('.ms-tableCell').css('height', '100%');
                });
                $('[data-panel="' + check_panel() + '"][data-index="' + check_index() + '"]').addClass('active');
                var sections = $('div[data-panel="ms-right"]').sort(function(first, second) {
                    return $(first).data('index') - $(second).data('index')
                });
                $('.ms-right').append(sections);
                // setActivePositionTop($('.ms-left'));
                // setActivePositionTop($('.ms-right'));
            }
            

        }
        var _this = this,
        msData = $.fn.multiscroll.getMultiscrollData();
        

            _this.init = function() {
                set_style();
                $(window).on('resize', function(){
                    createResponsiveLayout();
                });
            }
            _this.c = msData.internals.c;
            _this.setIndex = function(ms_position) {
                $('.' + ms_position).find('.ms-section').each(function(i) {
                    $(this).attr('data-index', i), $(this).attr('data-panel', ms_position);
                })
            }
            _this.isResponsive = check_body_have, 
            _this.performMovement = function(item) {
                $('html,body').animate({
                    scrollTop: item.position().top
                }, msData.options.scrollingSpeed, msData.options.easing).promise().done(function() {})
            }

        return 'complete' === document['readyState'], $(window).on('load', function() {
            createResponsiveLayout();
        }), _this;
    }

    // if($.fn.fullpage !== undefined){
    //     let msData = $.fn.fullpage.getFullpageData();
    //     console.log(msData);
        
    // }

})(jQuery)

