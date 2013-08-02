/* 
    Document   : metro-base
    Created on : 06-Apr-2013, 01:08:42
    Author     : Bent
*/

$(function(){
    
   "use strict"; // jshint ;_;
    
    
    // general setting
    // layout mode
    $('[name="layout-mode"]').on('change', function(){
        $('.section-content, .footer').toggleClass('container')
        if(!$(this).is(':checked')){
            $('.backgrounds').show()
        }
        else{
            $('.backgrounds').hide()
        }
    })
    $('.backgrounds .background-choice > a').on('click', function(e){
        e.preventDefault();
        var bg = ($(this).attr('data-bg') == 'noimage') ? '#323232' : 'url(img/backgrounds/' + $(this).attr('data-bg') + ')';
        $('body').css({ 
            'background' : bg,
            'background-repeat' : 'no-repeat',
            'background-attachment' : 'fixed',
            'background-size' : '100% 100%'
        })
    })
    $('[name="header-mode"]').on('change', function(){
        $('#navbar-top').toggleClass('navbar-fixed-top')
        $('body').toggleClass('fixed')
        
        if($('[name="sidebar-mode"]').is(':checked')){
            var y = $(window).scrollTop();
            if(y > 40) $('#navside').removeClass('fixed-top').addClass('fixed-top')
        }
    })
    $('[name="sidebar-mode"]').on('change', function(){
        $('.side-left').toggleClass('side-left-fixed')
        if($(this).is(':checked')){
            $('.side-left').css({
                'min-height' : '100%'
            })
        }
        else{
            layout_helper()
        }
    })
    // if header mode is default & sidebar fixed
    // scrolling event
    $(window).scroll(function() {
        if($(window).scrollTop() > 40){
            if(!$('[name="header-mode"]').is(':checked')){
                $('#navside').addClass('fixed-top')
            }
        }
        else{
            $('#navside').removeClass('fixed-top')
        }
    })
    // themes
    $('[name="theme-mode"]').on('change', function(){
        var mode = $('[name="theme-mode"]:checked').val()
        
        if(mode == 'dark'){
            $('#navbar-top').attr('class', 'navbar navbar-inverse')
            $('#navside').attr('class', 'side-left side-black')
            if($('.footer').hasClass('container')){
                $('.footer').attr('class', 'footer container bg-black')
            }
            else{
                $('.footer').attr('class', 'footer bg-black')
            }
            
            // effect to demo page
            $('.side-left > .search-module, .nav-collapse > .search-module').find('.btn').attr('class', 'btn bg-black') // search module
        }
        else if(mode == 'light'){
            $('#navbar-top').attr('class', 'navbar navbar-cyan')
            $('#navside').attr('class', 'side-left')
            if($('.footer').hasClass('container')){
                $('.footer').attr('class', 'footer container bg-silver')
            }
            else{
                $('.footer').attr('class', 'footer bg-silver')
            }
            
            // effect to demo page
            $('.side-left > .search-module, .nav-collapse > .search-module').find('.btn').attr('class', 'btn bg-cyan') // search module
        }
        
        // layout mode
        if($('[name="header-mode"]').is(':checked'))
            $('#navbar-top').addClass('navbar-fixed-top')
        
        if($('[name="sidebar-mode"]').is(':checked'))
            $('#navside').toggleClass('side-left-fixed')
    })
    // syncronize mode
    $('[name="syncronize-theme"]').on('change', function(){
        if(!$(this).is(':checked')){
            $('.syncronize').hide()
            $('.unsyncronize').show()
        }
        else{
            $('.syncronize').show()
            $('.unsyncronize').hide()
        }
    })
    $('.syncronize .themes-choice > a').on('click', function(e){
        e.preventDefault();
        var theme = $(this).attr('data-theme'),
        mode = $('[name="theme-mode"]:checked').val();
        
        if($('[name="syncronize-theme"]').is(':checked') && mode == 'dark'){
            $('#navbar-top').attr('class', 'navbar navbar-inverse')
            $('#navside').attr('class', 'side-left side-'+theme)

            if($('.footer').hasClass('container')){
                $('.footer').attr('class', 'footer container bg-'+theme)
            }
            else{
                $('.footer').attr('class', 'footer bg-'+theme)
            }
        }
        else if($('[name="syncronize-theme"]').is(':checked') && mode == 'light'){
            $('#navbar-top').attr('class', 'navbar navbar-'+theme)
            $('#navside').attr('class', 'side-left')
        }
        
        // layout mode
        if($('[name="header-mode"]').is(':checked'))
            $('#navbar-top').addClass('navbar-fixed-top')
        
        if($('[name="sidebar-mode"]').is(':checked'))
            $('#navside').toggleClass('side-left-fixed')
        
        // effect to demo page
        $('.side-left > .search-module, .nav-collapse > .search-module').find('.btn').attr('class', 'btn bg-'+theme) // search module
    })
    $('.unsyncronize .themes-navbar > a').on('click', function(e){
        e.preventDefault();
        var theme = $(this).attr('data-theme');
        $('#navbar-top').attr('class', 'navbar navbar-'+theme)
        
        // layout mode
        if($('[name="header-mode"]').is(':checked'))
            $('#navbar-top').addClass('navbar-fixed-top')
        
        // effect to demo page
        $('.side-left > .search-module, .nav-collapse > .search-module').find('.btn').attr('class', 'btn bg-'+theme) // search module
    })
    $('.unsyncronize .themes-sidebar > a').on('click', function(e){
        e.preventDefault();
        var theme = $(this).attr('data-theme');
        $('#navside').attr('class', 'side-left side-'+theme)
        if($('.footer').hasClass('container')){
            $('.footer').attr('class', 'footer container bg-'+theme)
        }
        else{
            $('.footer').attr('class', 'footer bg-'+theme)
        }

        // layout mode
        if($('[name="sidebar-mode"]').is(':checked'))
            $('#navside').toggleClass('side-left-fixed')
    })
    // end general settings
    
    
    
    // custom scroll with mCustomScrollbar
    $('[data-scrollbar="mscroll"]').each(function(i, v){
        var $this = $(this),
        theme = ($this.attr('data-theme') == undefined) ? 'light' : $this.attr('data-theme'),
        hide = ($this.attr('data-autohide') == undefined) ? true : $this.attr('data-autohide'),
        button = ($this.attr('data-button') == undefined) ? false : $this.attr('data-button'),
        autohide = $.parseJSON(hide),
        bolButton = $.parseJSON(button);
        
        $this.mCustomScrollbar({
            autoHideScrollbar:autohide, // boolean
            scrollButtons:{
                enable: bolButton,      // boolean
                scrollSpeed: 100
            },
            theme: theme                // "light", "dark", "light-2", "dark-2", "light-thick", "dark-thick", "light-thin", "dark-thin"
            // more options here...
        });

    })
    
    // side-left setting
    var toggle_list = $('[data-toggle=dropdown-list]')
    
    toggle_list.click(function(e){
        console.log('hola');
        e.preventDefault()
        
        var dropdown = $(this).offsetParent('.dropdown-list'),
        toggle_menu = dropdown.find('.dropdown-menu');
        
        toggle_menu.slideUp() // other dropdown-list
        
        var open = dropdown.hasClass('open');
        
        if(open == false){
            dropdown.addClass('open')
            
            toggle_menu.slideDown()
        }
        else{
            dropdown.removeClass('open')
            
            toggle_menu.slideUp()
        }
    })
    // endside-left setting
    
    
    // navbar collapse
    var navbar_collapse = $('.btn-navbar').attr('data-target'),
    collapse_content = $('[data-collapse="navbar"]').html();
    $(navbar_collapse).html(collapse_content)
    $(navbar_collapse).find('.nav').addClass('nav-list')
        .find('li.dropdown-list').removeClass('dropdown-list').addClass('dropdown')
        .find('a[data-toggle=dropdown-list]').attr('data-toggle', 'dropdown')
        .find('i').remove()
        
    // clean for icon & caret
       $('.nav-collapse').find('a[data-toggle=dropdown]').find('i, .caret').remove()
    // end navbar collapse
    
    
    // widget
    $('[data-toggle=collapse-all-widgets]').click(function(e){
        e.preventDefault()
        var target = $('.widget').find('.widget-content'),
        icon = $('.widget-header [data-toggle=collapse] > i');
        
        $(icon).attr('class', 'icomo-plus')
        $(target).slideUp(300, 'easeOutQuad')
    })
    $('[data-toggle=expand-all-widgets]').click(function(e){
        e.preventDefault()
        var target = $('.widget').find('.widget-content'),
        icon = $('.widget-header [data-toggle=collapse] > i');
        
        $(icon).attr('class', 'icomo-minus')
        $(target).slideDown(300, 'easeOutQuad')
    })
    $('[data-toggle=toggle-all-widgets]').click(function(e){
        e.preventDefault()
        var target = $('.widget').find('.widget-content');
        
        $(target).slideToggle(300, 'easeOutQuad')
    })
    $('.widget > .widget-header').dblclick(function(e){
        e.preventDefault()
        var target = $(this).parent().find('.widget-content'),
        icon = $(this).parent().find('.widget-header [data-toggle=collapse] > i'),
        toggle_icon = $(icon).attr('data-toggle-icon');
        
        $(icon).toggleClass(toggle_icon)
        $(target).slideToggle(300, 'easeOutQuad', function(){
            layout_helper();
        })
    })
    // collapse on load
    $('.widget[data-collapse=true] .widget-content').slideUp()
    $('.widget[data-collapse=true] .widget-header [data-toggle=collapse] > i').attr('class', 'aweso-plus')
    
    // widget action
    $('.widget [data-toggle=close]').click(function(e){
        e.preventDefault()
        var target = $(this).attr('data-close');
        
        $(target).hide(300, 'easeOutQuad')
    })
    $('.widget [data-toggle=collapse]').click(function(e){
        e.preventDefault()
        var target = $(this).attr('data-collapse'),
        icon = $(this).find('i'),
        toggle_icon = $(icon).attr('data-toggle-icon');
        
        $(icon).toggleClass(toggle_icon)
        
        $(target + ' .widget-content').slideToggle(300, 'easeOutQuad', function(){
            layout_helper();
        })


    })
    $('.widget [data-toggle=fullscreen]').click(function(e){
        e.preventDefault()
        var target = $(this).attr('data-fullscreen'),
        with_tile = $(target).hasClass('with-tile'),
        icon = $(this).find('i'),
        toggle_icon = $(icon).attr('data-toggle-icon');
        
        $(icon).toggleClass(toggle_icon)
        
        $(target).toggleClass('fullscreen')
        if(with_tile == true){
            $(target).toggleClass('with-tile')
            $(target).hide()
        }
    })
    // end widget
    
    
    // appbar
    $('[data-toggle="appbar"]').click(function(e){
        e.preventDefault()
        
        var target = $(this).attr('data-target');
        
        if($(target).hasClass('open') == false){
            $('.appbar').removeClass('open');
            $(target).addClass('open')
        }
        else{
            if(!$(e.target).is('input') && !$(e.target).is('textarea') && !$(e.target).is('select') && !$(e.target).is('form')){
                $(target).removeClass('open')
            }
        }
    }).focus(function(e){
        e.preventDefault()
        
        var target = $(this).attr('data-target');
        
        if($(target).hasClass('open') == false){
            $('.appbar').removeClass('open');
            $(target).addClass('open')
        }
        else{
            if(!$(e.target).is('input') && !$(e.target).is('textarea') && !$(e.target).is('select') && !$(e.target).is('form')){
                $(target).removeClass('open')
            }
        }
    })
    $(document.body).click(function(e){
        var target = e.target;

        if (!$(target).is('.appbar') && !$(target).parents().is('.appbar') && !$(target).is('[data-toggle="appbar"]')) {
            $('.appbar').removeClass('open')
        }
    })
    // end appbar
    
    
    // splash, modify this template if you want (just make it simple)
    var splash_template = '<div class="splash">'
        +'    <div class="splash-inner">'
        +'        <i class="icomo-atom"></i>' // you can use image for logo like <img class="logo" src="your/logo/path" alt="" />
        +'        <p class="brand">Stilearn Metro</p>'
        +'        <p class="splash-text">Destination progress text</p>'
        +'        <div class="splash-loader">'
        +'            <img class="preload-large" src="img/preload-6-white.gif" alt="" />'
        +'        </div>'
        +'    </div>'
        +'</div>',
    
    splash_template_inline = '<div class="splash splash-inline">'
        +'    <div class="splash-inner">'
        +'        <div class="splash-loader">'
        +'          <img src="img/preload-5-black.gif" alt="" />'
        +'        </div>'
        +'    </div>'
        +'</div>',
    splash_call = $('body').attr('data-splash'),
    splash_type = $('body').attr('data-splash-type');
    
    if(splash_call == true || splash_call == 'true'){
        if(splash_type == 'inline'){
            $('body').append(splash_template_inline)
            $('body > *').css({
                'visibility' : 'visible'
            })
            $('.splash.splash-inline').fadeIn()
        }
        else{
            $('body').append(splash_template)
            $('.splash').fadeIn(function(){
                $(this).css({
                    'visibility' : 'visible'
                })
            });
        }
    }
    $(window).bind('load', function(){
        if(splash_type == 'inline'){
            $('.splash.splash-inline').fadeOut()
        }
        else{
            $('.splash').fadeOut(2000, function(){
                $('body > *').not('.splash').css({
                    'visibility' : 'visible'
                });
            });
        }
    });
    // end splash
    
    
    
    // ui elements
    // slider
    $('[data-ui="slider"]').each(function(){
        var $this = $(this),
        animate = ($this.attr('data-slider-animate') == undefined) ? false : $this.attr('data-slider-animate'),
        disabled = ($this.attr('data-slider-disabled') == undefined) ? false : Boolean($this.attr('data-slider-disabled')),
        max = ($this.attr('data-slider-max') == undefined) ? 100 : parseInt($this.attr('data-slider-max')),
        min = ($this.attr('data-slider-min') == undefined) ? 0 : parseInt($this.attr('data-slider-min')),
        orientation = ($this.attr('data-slider-orientation') == undefined) ? 'horizontal' : $this.attr('data-slider-orientation'),
        ranges = ($this.attr('data-slider-range') == undefined) ? false : ($this.attr('data-slider-range')),
        step = ($this.attr('data-slider-step') == undefined) ? 1 : parseInt($this.attr('data-slider-step')),
        value = ($this.attr('data-slider-value') == undefined) ? 0 : parseInt($this.attr('data-slider-value')),
        values = ($this.attr('data-slider-values') == undefined) ? null : $this.attr('data-slider-values').split(','),
        
        range = (ranges == 'true') ? Boolean(ranges) : ranges,
        
        slider_opt = {
            animate: animate,
            disabled: disabled,
            max: max,
            min: min,
            orientation: orientation,
            range: range,
            step : step,
            value: value,
            values: values
        }
        
        $this.slider(slider_opt)
    })
    // end ui elements
    
    
    
    
    // tooltip helper
    $('[data-toggle=tooltip]').tooltip()	
    $('[data-toggle=tooltip-bottom]').tooltip({
        placement : 'bottom'
    })	
    $('[data-toggle=tooltip-right]').tooltip({
        placement : 'right'
    })
    $('[data-toggle=tooltip-left]').tooltip({
        placement : 'left'
    })	
    // end tooltip helper
    
    // popover helper
    $('[data-toggle=popover]').click(function(e){
        e.preventDefault();
    })
    $('[data-toggle=popover]').popover()	
    $('[data-toggle=popover-bottom]').popover({
        placement : 'bottom'
    })	
    $('[data-toggle=popover-right]').popover({
        placement : 'right'
    })
    $('[data-toggle=popover-left]').popover({
        placement : 'left'
    })
    // end popover helper
    
    
    // animate scroll, define class scroll will be activate this
    $("a[data-scroll=true]").click(function(e){
        e.preventDefault()
        $(document.body).animate({scrollTop: $(this.hash).offset().top}, 'slow')
    })
    // end animate scroll
    
    // required plugin
    // chart sparklines
    $('[data-chart=sparklines]').each(function(){
        var sparkline = $(this),
        data = $(sparkline).html(),
        dataArray = data.split(","),
        h = sparkline.attr('data-height'),
        c = sparkline.attr('data-color');

        var draw = function(){
            sparkline.sparkline(dataArray, {
                type : 'bar',
                height: h, 
                width: '100%',
                barColor: c, 
                barWidth: 5
            })
        }
        // help for responsive
        var redraw;
        $(window).resize(function(e) {
            clearTimeout(redraw);
            redraw = setTimeout(draw, 500);
        });

        draw();
    });

    // helper
    // keep dropdown open on click with stopPropagation
    $('[data-dropdown="no-propagation"] *').click(function(e){
        e.stopPropagation();
    })
    
    // theme switcher demo on component
    $('.theme-switcher li a').click(function(e){
        e.preventDefault();
        var $this = $(this),
        target = $this.parent().parent().attr('data-target'),
        target_class = $this.parent().parent().attr('data-target-class'),
        theme = $this.attr('data-theme');

        $(target).attr('class', target_class).addClass(theme);;
    })
    $('.pie-donat-text').each(function(){
        var $this = $(this),
        center = ($this.parent().height()/2) - ($this.height()/2);
        $this.css({
            top : center
        })
    })
    $('.message-checked').bind('click', function(){
        $(this).parent().toggleClass('selected')
    })

    // layout helper
    var layout_helper = function(){
        // update helper layout
        var lay_section = $('.section-content').height(),
            lay_content = $('.section-content > .content').height();
        if( ! $('.side-left').hasClass('side-left-fixed')){ // only for default sidebar left (not fixed)
            if(lay_section == lay_content){
                $('.side-left').css({
                    'min-height' : lay_section + 'px'
                })
            }
            else if(lay_section > lay_content){
                $('.side-left').css({
                    'min-height' : lay_content + 'px'
                })
            }
        }
    }

    $(window).bind('load', function(){
        var lay_section = $('.section-content').height();
        $('.side-left').css({
            'min-height' : lay_section + 'px'
        })
    })

    $(window).resize(function(){
        // update helper layout
        if($(window).width() > 979){
            layout_helper()
        }
    });

    
    // end helper
})