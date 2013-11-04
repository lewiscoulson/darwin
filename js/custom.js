var breakpoints = [
    { name: 'mobile', minSize: 0, maxSize: 480 },
    { name: 'tablet', minSize: 481, maxSize: 974 },
    { name: 'desktop', minSize: 975, maxSize: 100000 }];
var currentBreakpoint;
var initialised = false;
var isAnimating = false;
var navigationMenu;

var focussedEl = $("body")[0];

// Show global nav dropdown
var globalTimeoutID = 0;	
var globalExitID = 0;
var globalNavID = 0;	

// Show mega nav dropdown
var timeoutID = 0;	
var exitID = 0;
var navID = 0;	

var enterEl;
var enterTime;
var exitEl;
var exitTime;

var navQ = 0;
var linkName = $('.convert');

var ua = navigator.userAgent,
        touchEvent = (ua.match(/iPad/i)) ? "touchstart" : "click";


function handleBreakpoints(force) {
	for (var i = 0; i < breakpoints.length; i++) {
        var breakpoint = breakpoints[i];
        if ($(window).width() >= breakpoint.minSize && $(window).width() <= breakpoint.maxSize) {
            if (currentBreakpoint == breakpoint.name && !force)
                return;
            currentBreakpoint = breakpoint.name;
            $(window).trigger('breakpoint', breakpoint);
            return;
        }
    }
}

// 	Equal height column fix: css-tricks.com/equal-height-blocks-in-rows/
function setConformingHeight(el, newHeight) {
	// set the height to something new, but remember the original height in case things change
	el.data("originalHeight", (el.data("originalHeight") == undefined) ? (el.height()) : (el.data("originalHeight")));
	el.height(newHeight);
}  

function getOriginalHeight(el) {
	// if the height has changed, send the originalHeight
	return (el.data("originalHeight") == undefined) ? (el.height()) : (el.data("originalHeight"));
}

function columnConform(mmItem) {
	// find the tallest DIV in the row, and set the heights of all of the DIVs to match it.	
	var currentTallest = 0,
		currentRowStart = 0,
		rowDivs = new Array();	
		
	mmItem.children("div").each(function() {
		// "caching"
		var $el = $(this);
		var topPosition = $el.position().top;

		if (currentRowStart != topPosition) {
			// we just came to a new row.  Set all the heights on the completed row
			for(currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) setConformingHeight(rowDivs[currentDiv], currentTallest);
			// set the variables for the new row
			rowDivs.length = 0; // empty the array
			currentRowStart = topPosition;
			currentTallest = getOriginalHeight($el);
			rowDivs.push($el);
		} else {
			// another div on the current row.  Add it to the list and check if it's taller
			rowDivs.push($el);
			currentTallest = (currentTallest < getOriginalHeight($el)) ? (getOriginalHeight($el)) : (currentTallest);
		}
		// do the last row
		for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) setConformingHeight(rowDivs[currentDiv], currentTallest);
	});

}

function showMegaNav(elId){
	navQ--;
	
	if (navQ > 0) return;
	if (elId != enterEl)
		return;
    $("#" + elId).stop(true,true).addClass("hover").css("z-index","600").find(".dropdown").show();
	if ($("#" + elId).find(".dropdown").length != 0) {
		if ($("#" + elId).find(".dropdown").css('right') == '0px')
			return;
		if ($("#" + elId).find(".dropdown").position().left != $("#" + elId).position().left) {
			$("#" + elId).find(".dropdown").css("left",$("#" + elId).position().left + 'px');
		}
	}
	return;
}

function hideMegaNav(elId, ignoreTimeout){
	if (elId != exitEl && !ignoreTimeout)
		return;
    $('#' + elId).removeClass("hover").css("z-index","1 ").find(".dropdown").hide();
}

function initMegaNav($el) {
    $el.on("mouseenter touchstart",function(e){
		navQ++;
		if (exitEl == this.id)
			exitEl = "";
		enterEl = this.id;
		enterTime = new Date().getTime();
		var $this = $(this);
		
		if (e.type == "touchstart"){
			if (!$this.hasClass("hover")){
				e.preventDefault();
				e.stopPropagation();
			}
		}
		
		window.setTimeout("showMegaNav('" + this.id + "')", 10);

 		$("li:has(.dropdown:visible)",$('.global-nav')[0]).not($this).trigger("mouseleave",true);	
		$("li:has(.dropdown:visible)",$('#primary-nav')[0]).not($this).trigger("mouseleave",true);	

	}).on("mouseleave",function(e,ignoreTimeout){
		if (ignoreTimeout) {
			hideMegaNav(this.id,true);
			return;
		}
		if (enterEl == this.id)
			enterEl = "";
		exitEl = this.id;
		exitTime = new Date().getTime();
		window.setTimeout("hideMegaNav('" + this.id + "', false)", 10);
    }).append("<span></span>");
	
}		

function convertButton(){
	
	linkName.each(function() {
		$this = $(this);
		moduleClass = $this.data('value');
		if ( $this.data('value') != null ) {
			linkName = $this.data('value');
		} else {
			linkName = "Submit";
		}
		$('<a href="#" class="button medium radius converted">' + linkName + '</a>').insertBefore($this);
		$this.hide();
	});

}


$.fn.outerHtml = function(s) {
    return s
        ? this.before(s).remove()
        : $("<p>").append(this.eq(0).clone()).html();
};

/* css-tricks.com/snippets/jquery/smooth-scrolling/
----------------------------------------------------------------------------------------------------*/
 function filterPath(string) {
  return string
	.replace(/^\//,'')
	.replace(/(index|default).[a-zA-Z]{3,4}$/,'')
	.replace(/\/$/,'');
  }
  var locationPath = filterPath(location.pathname);
  var scrollElem = scrollableElement('html', 'body');
 
  $('a[href^=#]').each(function() {
	var thisPath = filterPath(this.pathname) || locationPath;
	if (  locationPath == thisPath
	&& (location.hostname == this.hostname || !this.hostname)
	&& this.hash.replace(/#/,'') ) {
	  var $target = $(this.hash), target = this.hash;
	  if ($target.size() > 0) {
		var targetOffset = $target.offset().top;
		$(this).click(function(event) {
		  event.preventDefault();
		  $(scrollElem).animate({scrollTop: targetOffset}, 1200, function() {
			location.hash = target;
			// Focus element
			$(target).attr("tabindex",-1).focus();
		  });
		});
	  }
	}
  });
 
  // use the first element that is "scrollable"
  function scrollableElement(els) {
	for (var i = 0, argLength = arguments.length; i <argLength; i++) {
	  var el = arguments[i],
		  $scrollElement = $(el);
	  if ($scrollElement.scrollTop()> 0) {
		return el;
	  } else {
		$scrollElement.scrollTop(1);
		var isScrollable = $scrollElement.scrollTop()> 0;
		$scrollElement.scrollTop(0);
		if (isScrollable) {
		  return el;
		}
	  }
	}
	return [];
  }

// Self Invoking Anonymous function
(function() {
	
	var mmActive,
    	touchInitiated = false,
		isTouchMenu = false,
		isInitialised = false,
		modOpen = false,
		menuLoaded = false,
		siteSearch = $('.site-search'),
		businessModule = $('.business-module'),
		utlities = $('.utility-link'),
	 	mods = $('#modules .utility-link .inner .row'),
	 	menuArr = [siteSearch, businessModule],
    	tabs = $('.section-container section'),
    	menuMode,
    	moduleMode;

// Remove secondary navigation
	$("#footer .dropdown, #footer > h2, #footer > h3, #modules" ).remove();


	function getMenu() {

		var url = $(".primary-nav ul").data("url") || "";
			if (url == "")
				return;
				
			$.get(url, function(data) {
				menuLoaded = true;
				mmActive = $(".primary-nav ul li.active").index();
				$(".primary-nav ul").html(data);
				navigationMenu = $('#dl-menu').html();
				handleBreakpoints(true);
			});
	}

	// Touch device menu function
	function initTouchMenu() {
		if(menuMode == 'T' || !menuLoaded)
			return;
		menuMode = 'T';

		// Modify input mark-up ready for touch menu initialization.
		var $ulElements = $('.primary-nav h3 + ul');
		// console.log($ulElements);
		$('.primary-nav .dropdown').find($ulElements).addClass('dl-submenu');
		$('.primary-nav .dropdown').wrapInner('<ul class="dl-submenu"/>').contents().unwrap();
		$('.primary-nav .column, .primary-nav .feature').each(function() {

			var replaceString = "";
			// Foreach h3 get next list and bundle into a new column
			$(this).find('h3').each(function () {
				replaceString += '<li><h3>' + $(this).html() + '</h3><ul class="dl-submenu">' + $(this).next('ul').html() + '</ul></li>';
			});

			$(this).replaceWith(replaceString);
		});
		$('#dl-menu li:has(ul) > h3:not(:has(a))').wrapInner('<span class="a"></span>');
		$('#dl-menu li:has(ul) > a, #dl-menu li:has(ul) > h3 > a, #dl-menu li:has(ul) > h3 > .a').append('<span aria-hidden="true" class="icon-right_arrow"></span>');


		//$('#dl-menu li').removeAttr('style');
		$('#dl-menu').addClass('dl-menuwrapper').prepend('<button class="dl-trigger">Open Menu</button>');
		$('#dl-menu > ul').addClass('dl-menu');

		// Call mobile menu
		$('#dl-menu').dlmenu().on('navchange',function(){
			
			var $this = $(this).children('ul'), ht = $this.is(':visible') ? $this.height() : 0;
			ht = (ht > 0) ? ht + 15 : 0;
			$('.columns:has(.logo)').css('margin-bottom', ht + 'px');
		});
		//$('#dl-menu .dl-back a').append('<span aria-hidden="true" class="icon-left_arrow"></span>');

		//
		 $('#dl-menu li.dl-back').append('<span aria-hidden="true" class="icon-right_arrow"></span>');
	}

	// Input menu function
	function initInputMenu() {
		
		if(menuMode == 'D' || (!menuLoaded && $('.primary-nav ul[data-url]').size() > 0))
			return;
		menuMode = 'D';
		$('#dl-menu').html(navigationMenu); // Reset mark-up to original
		$('#dl-menu').removeClass('dl-menuwrapper');
		$('#dl-menu > ul').removeClass('dl-menu');
		$('button.dl-trigger').remove();

		/*window.setTimeout(function(){
		
		var url = $(".primary-nav ul").data("url") || "";
		if (url == "")
			return;*/
			
			if (mmActive >= 0)
				$(".primary-nav nav > ul > li").eq(mmActive).addClass("active");
			
			$(".primary-nav .dropdown").each(function(){	
				var $this = $(this);
				var noColumns = $this.children("div").size();
				var cssClass = ("auto" + noColumns);
					if (noColumns < 4) { 
						$this.parent().addClass(cssClass);
					}
				columnConform($this);
				var mmPosLeft = $this.parent().position().left;
				var mmMaxWidth = $this.parent().parent().width();
				var ddWidth = $this.width();
				var ddPosLeft = ddWidth - mmMaxWidth;
		
				if ((mmPosLeft + ddWidth) > mmMaxWidth) {
					$this.css({"right":"0px" ,"left":"auto"});
				} 
				else {
					$this.css({"left":mmPosLeft + "px"});

				}
				initMegaNav($this.parent());
				$this.hide();	
			});	
			$(".primary-nav ul li .dropdown a[href='" + location.pathname + "']").addClass("active");
			$(".primary-nav ul li:not(:has(.dropdown)) a span").remove();
			
			initMegaNav($(".global-nav li:has(.dropdown)"));
			
			$("li:has(.dropdown)>a").on("focus",function(e){ 
				e.stopPropagation();
				$(this).parent("li:has(.dropdown:not(:visible))").trigger("mouseenter"); 
			});
			
			$("a").on("focus",function(e){ 
				e.stopPropagation();
				if ($(this).closest("li:has(.dropdown)").size() == 0) { 
					$("li:has(.dropdown:visible)",$('.global-nav')[0]).trigger("mouseleave",true);	
					$("li:has(.dropdown:visible)",$('#primary-nav')[0]).trigger("mouseleave",true);	
				} 
			});

			//navigationMenu = $('#dl-menu').html();	
			
		/*}, 100);		*/
	}

	// Rewrite modules from the footer into the header for desktop
	function headerInputModules() {
		if (moduleMode == 'D')
			return;
		moduleMode = 'D';

		var headerUtilityNav = "",
			headerUtilityItems = "";

		// Build header utility navigation for desktop		
		mods.each(function() {
			moduleClass = $(this).parent().parent().data('class');
			$this = $(this).children().eq(0);
			if ($this.data('name') != null ) {
				headerUtilityItems += '<li class="' + moduleClass + '"><a href="' + $this.children('a').attr('href') + '">' + $this.data('name') +'</a></li>';
			}
		});
			
		headerUtilityNav = '<nav id="header-utility-nav"><ul>' + headerUtilityItems + '</ul></nav>';
		$(headerUtilityNav).prependTo('#header > div');

		siteSearch.removeClass('large-6').addClass('large-4').find('h3').addClass('visuallyhidden');
		businessModule.removeClass('large-6').addClass('large-4')
		

		// Append site search to header
		$('#header > div').append( siteSearch, businessModule );
		
		// Global navigation	
		if ( $('.global-nav').length = 1 ) {
			$('.global-nav').insertBefore( businessModule );		
		}
		
		// Must be left as the last function
		$('.utility-link').remove();
	}


	function hideInputModules () {

		// Build header utility navigation for mobile and tablet devices
		$('.desktop #header-utility-nav, .desktop .site-search, .desktop .business-module').remove();
	}


	// Rewrite modules from the footer into the header for mobile and tablet devices
	function headerTouchModules() { 
		if (moduleMode == 'T')
				return;
		moduleMode = 'T';
		siteSearch.find('h3').removeClass('visuallyhidden');

		if($('#touchmodules').length == 0) {

			// Declare variables
			var	container = $('<div id="touchmodules" class="columns large-12" />'),
				header = $('#header'),
				headerList = $('<ul id="modules" />'),
				headerListItems;

				$('div#modules').remove();

			// Add header list to containing div and append all to site header
			container.append(headerList).appendTo(header);

			// Loop over our modules and build list items
			for(var i = 0; i < menuArr.length; i++) {

				var item = $(menuArr[i]);
				
				var toggleMe = "";
				if ( typeof item.data('toggle') != 'undefined' ){
					toggleMe = 'to' + item.data('toggle');
				}

				headerList.append('<li class="' + item.data('class') + ' ' + toggleMe + '"><span class="visuallyhidden">' + item.find('h3').text() + ' </span><div class="module">' + item.html() + '</div></li>');
			}

			// Store reference to header list items
			headerListItems = header.find('li');
				
			// Bind event handler to list items to show and hide inner menu
			headerListItems.on('click', function (e) {
				var that = $(this);
				
				e.preventDefault();
				e.stopPropagation();

				if(!that.hasClass('open')) {
					headerListItems.removeClass('open');
					that.addClass('open');
					modOpen = true;	
					$('#header ul#modules').addClass('mod-open');

				} else {
					headerListItems.removeClass('open');
					modOpen = false;	
					$('#header ul#modules').removeClass('mod-open');
					$('header').css('margin-bottom', '0px');
					return;
				}

				//console.log(that.children('.module').css('top'));
				var topAdj = (that.children('.module').css('top') == '0px') ? that.outerHeight() : 0;
				//console.log(that.outerHeight());
				$('header').css('margin-bottom', (that.children('.module').outerHeight() - topAdj) + 'px');
											
			});
			
			$('.toopen').removeClass('toopen').trigger('click');

			// Stop events bubbling up to header list from inner divs to prevent close on interaction
			headerListItems.find('div').on(touchEvent, function (e) {
				e.stopPropagation();
			});

			// @NOTE - May need to remove this, put in for testing on local
			headerListItems.find('div').on('click', function (e) {
				e.stopPropagation();
			});

			// Bind event to clicks on document to hide menu
			$(document).on(touchEvent, function (e) {
				if(headerListItems.hasClass('open')) {
					headerListItems.removeClass('open');
					modOpen = false;
					$('#header ul#modules').removeClass('mod-open');
				}
				$('header').css('margin-bottom', '0px');
			});

			$("#touchmodules, #header, #main, #footer").on(touchEvent, function (e) {
				e.stopPropagation();
			});

			// @NOTE - May need to remove this, put in for testing on local
			/*$(document).on('click', function (e) {
				if(headerListItems.hasClass('open')) {
					headerListItems.removeClass('open');
					modOpen = true;	
					$('#header ul#modules').removeClass('mod-open');
				}
				$('header').css('margin-bottom', '0px');
			});*/
		
		}
	}

	function hideTouchModule() {

		$('.tablet #touchmodules').remove();
	}

	function initDesktop(){
		//if (isInitialised && !isTouchMenu)
		//	return;
		//isInitialised = true;
		//isTouchMenu = false;
		//touchInitiated = false;
		initInputMenu();
    	hideTouchModule();
		headerInputModules();

		$('#header').addClass('desktop').removeClass('tablet');
	}

	function initTouch(){
		//if (isInitialised && isTouchMenu)
		//	return;
		//isInitialised = true;
		//isTouchMenu = true;
		businessModule.find('h3').show();
		initTouchMenu();
   		hideInputModules();
		headerTouchModules();

    	$('#header').addClass('tablet').removeClass('desktop');
		
			// Orientation Change
			/*window.addEventListener("orientationchange", function() {
				
				var what = $('#modules li.open');
				
				//console.log(that.children('.module').css('top'));
				var topAdj = (what.children('.module').css('top') == '0px') ? what.outerHeight() : 0;
				//console.log(that.outerHeight());
				$('header').css('margin-bottom', (what.children('.module').outerHeight() - topAdj) + 'px');
				alert(window.orientation, what);
						
			}, false);	*/
			
			function orientationChange() {
				var what = $('#modules li.open');
				
				//console.log(that.children('.module').css('top'));
				var topAdj = (what.children('.module').css('top') == '0px') ? what.outerHeight() : 0;
				//console.log(that.outerHeight());
				$('header').css('margin-bottom', (what.children('.module').outerHeight() - topAdj) + 'px');
				//alert(window.orientation, what);	
			}
			orientationChange();
		
	}





	window.setTimeout(getMenu,100);
	//getMenu();

	for (var i = 0; i < utlities.length; i++) {
		menuArr.push(utlities[i]);
	}

    // Window width for navigation 
    $(window).on("resize", handleBreakpoints).on('load', function () {
        handleBreakpoints(false);
	});

	// Call functions dependent upon breakpoints
    $(window).on("breakpoint", function (e, breakpoint) {

 	   // console.log(breakpoint.name);
	   
       if (breakpoint.name == "desktop") {
       		initDesktop();
        } else {
        	initTouch();
        }
    });
		

	
    // Functionlity to add div's for tabs and accordion
    for (var i=0; i < tabs.length; i++){
    	var startTag = '<div class="content" data-section-content></div>',
    	sectionEl = $(tabs[i]),
    	secH2 = sectionEl.find('h2').addClass('title'),
    	sectionHTML,
    	contentDiv;

    	sectionEl.find('h2').remove();
    	sectionHTML = sectionEl.html();
    	sectionEl.html(startTag);
    	sectionEl.prepend(secH2);
    	contentDiv = sectionEl.find('.content:first');
    	contentDiv.append(sectionHTML);
    }
	
	// Convert input button to links so they can be styled more appropriatly
	convertButton();

	// IE placeholder text
	$('input, textarea').placeholder();

	$('.hideforjs #modules').css('display', 'block');
	
	
})(); // End of SIAF