/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.ile.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 27/01/14 20.06
 *  *****************************************************************************
 */

/*
 *
 * jQuery.mb.components: jquery.mb.ile
 * version: 1.0 alpha - 12-nov-2010 - 48
 * © 2001 - 2011 Matteo Bicocchi (pupunzi), Open Lab
 *
 * Licences: MIT, GPL
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * email: mbicocchi@open-lab.com
 * site: http://pupunzi.com
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Thanks to Roberto Bicchierai
 * (http://roberto.open-lab.com/)
 * and his unvaluable help.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * EVENTS triggered:
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * turn:
 * ---------------------------------
 *     when the device rotate
 *    $(document).on("pagecreate",function(e){...}); argument: e.orientation
 *
 * pagecreate:
 * ---------------------------------
 *     when a specific page is created
 *    $("[data-name = pageName]").on("pagecreate",function(e){...}); argument: e.page
 *    [page].on("pagecreate",function(e){...}); argument: e.page
 *
 *     when any page is created
 *    $(document).on("pagecreate",function(e){...}); argument: e.page
 *
 * pagebeforeshow:
 * ---------------------------------
 *     when a specific page is going to be shown
 *    $("[data-name = pageName]").on("pagebeforeshow",function(e){...}); arguments: e.page, e.oldPage, e.canChangePage (if set to false the change page event is stopped)
 *    [page].on("pagebeforeshow",function(e){...}); arguments: e.page, e.oldPage, e.canChangePage (if set to false the change page event is stopped)
 *
 *     when any page is going to be shown
 *    $(document).on("pagebeforeshow",function(e){...}); arguments: e.page, e.oldPage, e.canChangePage (if set to false the change page event is stopped)
 *
 * pagebeforehide:
 * ---------------------------------
 *     when a specific page is going to be hide
 *    $("[data-name = pageName]").on("pagebeforehide",function(e){...}); arguments: e.page, e.newPage
 *    [page].on("pagebeforehide",function(e){...}); arguments: e.page, e.newPage
 *
 *     when any page is going to be hide
 *    $(document).on("pagebeforehide",function(e){...}); arguments: e.page, e.newPage
 *
 * pageshow:
 * ---------------------------------
 *     when a specific page is shown
 *    $("[data-name = pageName]").on("pageshow",function(e){...}); arguments: e.page, e.oldPage
 *    [page].on("pageshow",function(e){...}); arguments: e.page, e.oldPage
 *
 *     when any page is going to be hide
 *    $(document).on("pagebeforehide",function(e){...}); arguments: e.page, e.oldPage
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * This framework works perfectly on iOs devices; Android partially support webkit transitions so the scroll behavior is slow.
 * if you want to enable anyway the fixed header and footer on Android add the Android closure:
 * document.transitionEnabled = $.browser.safari && (/(iPod || iPad || iPhone || Mac || windows || Android )/i).test(navigator.userAgent);
 *
 *
 */

/*******************************************************************************
 *
 * jquery.mb.browser
 * Author: pupunzi
 * Creation date: 16/01/13
 *
 ******************************************************************************/
/*Browser detection patch*/
if (!jQuery.browser) {
	jQuery.browser = {}, jQuery.browser.mozilla = !1, jQuery.browser.webkit = !1, jQuery.browser.opera = !1, jQuery.browser.safari = !1, jQuery.browser.chrome = !1, jQuery.browser.msie = !1;
	var nAgt = navigator.userAgent;
	jQuery.browser.ua = nAgt, jQuery.browser.name = navigator.appName, jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;
	if (-1 != (verOffset = nAgt.indexOf("Opera")))jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 6), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)); else if (-1 != (verOffset = nAgt.indexOf("MSIE")))jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer", jQuery.browser.fullVersion = nAgt.substring(verOffset + 5); else if (-1 != nAgt.indexOf("Trident")) {
		jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer";
		var start = nAgt.indexOf("rv:") + 3, end = start + 4;
		jQuery.browser.fullVersion = nAgt.substring(start, end)
	} else-1 != (verOffset = nAgt.indexOf("Chrome")) ? (jQuery.browser.webkit = !0, jQuery.browser.chrome = !0, jQuery.browser.name = "Chrome", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 != (verOffset = nAgt.indexOf("Safari")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("AppleWebkit")) ? (jQuery.browser.webkit = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("Firefox")) ? (jQuery.browser.mozilla = !0, jQuery.browser.name = "Firefox", jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)) : (nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")) && (jQuery.browser.name = nAgt.substring(nameOffset, verOffset), jQuery.browser.fullVersion = nAgt.substring(verOffset + 1), jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() && (jQuery.browser.name = navigator.appName));
	-1 != (ix = jQuery.browser.fullVersion.indexOf(";")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)), -1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)), jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10), isNaN(jQuery.browser.majorVersion) && (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10)), jQuery.browser.version = jQuery.browser.majorVersion
}


var ua = navigator.userAgent.toLowerCase();

document.isTouch = 'ontouchstart' in window;
document.isAndroid=(/Android/i).test(navigator.userAgent);
document.isAndroidTablet = document.isAndroid && !(ua.search("mobile") > -1);
document.isiOs = ua.match(/(iphone|ipod|ipad)/);
document.isiPad = ua.match(/ipad/);
document.transitionEnabled = $.browser.webkit && (/(iPod|iPad|iPhone|Mac|windows || Android)/i).test(navigator.userAgent);
document.isTablet = document.isiPad || document.isAndroidTablet;
document.isStandAlone = window.navigator.standalone;
document.mbileScroll = null;

$("body").css({opacity:0});

(function($) {
	$.mbile = {
		name:"mb.ile",
		author:"Matteo Bicocchi",
		version:"0.6 alpha",
		defaults:{
			persistInDom:true,
			startPage:null,
			startupScreen: false,
			icon:false,
			icon4:false,
			addGlossToIcon:false,
			slidingSections:true,
			manageHistory:true,
			extensionsRoot:"extensions",
			errorPage:"pages/error_page.html"
		},
		events:{
			start: document.isTouch ? "touchstart" : "mousedown",
			move: document.isTouch ? "touchmove" : "mousemove",
			end: document.isTouch ? "touchend" : "mouseup",
			windowResize: "resize"  //"orientationchange"
		},
		orientation:"portrait",
		pages:{},
		loadedExtensions:[],

		init:function( options) {


			$.extend($.mbile.defaults, options);
			var opt = $.mbile.defaults;

			//set defaults for header and footer
			$.mbile.defaultHeader = $("[data-role=defaultHeader]").clone();
			$.mbile.defaultFooter = $("[data-role=defaultFooter]").clone();
			$("[data-role=defaultHeader],[data-role=defaultFooter]").remove();

			// Set startup screen

			if (opt.startupScreen)
				$("head").append('<link rel="apple-touch-startup-image" href="' + opt.startupScreen + '" />');

			if (opt.icon || opt.icon4) {
				var precomposed, appropriateIcon;
				if (opt.icon4 && window.devicePixelRatio && window.devicePixelRatio === 2) {
					appropriateIcon = opt.icon4;
				} else if (opt.icon) {
					appropriateIcon = opt.icon;
				} else {
					appropriateIcon = false;
				}
				if (appropriateIcon) {
					precomposed = (opt.addGlossToIcon) ? '' : '-precomposed';
					$("head").append('<link rel="apple-touch-icon' + precomposed + '" href="' + appropriateIcon + '" />');
				}
			}
			$(document).on($.mbile.events.windowResize+".mbile", $.mbile.checkOrientation);
			$.mbile.checkOrientation();

			if (document.transitionEnabled)
				$(document).on($.mbile.events.move+".mbile","[data-role=page]", function (e) {e.preventDefault();}, false);

			var pages = $("[data-role=page]");
			pages.addClass("offScreen");

			var home=opt.startPage?opt.startPage:"#"+$("body").find("[data-role=page]:first").attr("id");
			$.mbile.goToPage(home,"fade",false,false);
		},

		orientationVal: null,
		orientation:"portrait",

		checkOrientation:function() {

			if($.mbile.orientationVal == null){
				$.mbile.orientationVal = Math.abs(window.orientation);
				var landscape =  $.mbile.orientationVal == 90;
			}else{
				$.mbile.orientationVal = Math.abs(window.orientation);
				var landscape = $.mbile.orientationVal == 0 || $.mbile.orientationVal == 180;
			}

			$("body").removeClass('portrait landscape');
			$.mbile.orientation = landscape ? 'landscape' : 'portrait';
			$("body").addClass($.mbile.orientation);

			if (document.transitionEnabled && $.mbile.actualPage)
				$.mbile.setHeight($.mbile.actualPage);

			$.mbile.refreshScroll();

			//trigger event: turn
			var turn=$.Event("turn");
			$(document).trigger(turn);

		},

		setHeight: function(page) {
			var headerH = page.find("[data-role=header]").parents().is("[data-role=content]") ? 0 : page.find("[data-role=header]").outerHeight(true);
			var footerH = page.find("[data-role=footer]").outerHeight(true);
			var wrapperH = $(window).height() - headerH ; // - footerH;
			page.find(".scroller").css({height:wrapperH});
			page.find("[data-role=content]").css({minHeight:wrapperH});
		},

		getHeight:function(page){
			var headerH = page.find("[data-role=header]").outerHeight(true);
			var contentH = page.find(".scroller").outerHeight(true);
			var footerH = page.find("[data-role=footer]").outerHeight(true);
			return contentH - headerH - footerH ;
		},

		initContent:function(page) {

			var inited = page.data("inited");
			if (!inited) {
				page.find("[data-role=content]").wrap("<div class='scroller'/>");
				$.mbile.setHeaderFooterBehavior(page);
				$.mbile.addBackBtn(page);
				$.mbile.setButtonBarBehavior(page);
				$.mbile.setFormBehaviour(page);
			}else{
				page.updatePage();
			}

			$.mbile.setLinkBehavior(page);
			$.mbile.setButtonBehavior(page);

			$(document).on("pagebeforeshow",function(e){});

			if (document.transitionEnabled) {
				//wraps content into a scrollable wrapper
				$("body").css({"text-rendering":"optimizeLegibility","-webkit-backface-visibility":"hidden"});
				$.mbile.setHeight(page);
				if ($.mbile.defaults.slidingSections)
					$.mbile.setSectionBehavior(page);

				/*
				 if (document.mbileScroll)
				 document.mbileScroll.destroy();
				 */

				document.mbileScroll = new iScroll(page.find(".scroller").get(0));
				$.mbile.refreshScroll();

				page.find("img").each(function(i){
					$(this).on("load",function(){
						$.mbile.refreshScroll();
					})
				})

			} else {
				$("body").addClass("noTransition");
			}

			page.data("inited", true);
		},

		/*todo:
		 *
		 * 1. create a method to change Data for the page call
		 *
		 * */

		goToPage:function(url, animation, addHistory, pageData, originalUrl) {

			/* if the URL is inconsistent (neither an ID or a real URL) return */
			if(url=="#") return;

			/*
			 if DATA are present remove the actual stored page
			 from te DOM to recreate it with new DATA
			 */

			if (pageData)
				$("#"+url.asId()).remove();

			/*
			 if the called page is in the DOM but has DATA-RELOAD=TRUE
			 it's removed to be reloaded
			 */

			if (url.indexOf("#") < 0) {
				var id = url.asId();

				/* page is loaded when not present or with data passed */

				if ($("#" + id).size() <= 0 || pageData) {
					$.ajax({
						type: "GET",
						url: url,
						data:pageData,
						dataType:"html",
						cache : false,
						success: function(response) {
							var newCandidatePage = $(response);

							if (newCandidatePage.filter("[data-role=page]:first").size() <= 0) { // page is not standard format -> wrap it into a "page"
								newCandidatePage.wrap("<div data-role='page'></div>");
								newCandidatePage = newCandidatePage.parent();
							}
							if (newCandidatePage.find("[data-role=content]:first").size() <= 0) { // content is not standard format -> wrap it into a "content"
								newCandidatePage.wrapInner("<div data-role='content'></div>");
							}

							var page = newCandidatePage.filter("[data-role=page]:first");

							page.attr("id", url.asId());
							page.attr("url", url);

							newCandidatePage.addClass("offScreen");
							$("body").append(newCandidatePage);

							/* trigger event: pagecreate */

							var pagecreate = $.Event("pagecreate");
							pagecreate.page = newCandidatePage;
							newCandidatePage.trigger(pagecreate);

							/* the page is now loaded in the DOM and the goToPage will be called again to proceed */

							$.mbile.goToPage("#" + id, animation, addHistory, pageData, url);
						}
					});
					return;
				} else {
					url = "#" + id;
				}
			}

			/* if the URL is inconsistent return */

			if (url == "#")
				return;

			/* if a page is being shown return */

			if ($.mbile.pageIsChanging)
				return;

			/* if the called page is the actual page shown return */

			if ($.mbile.actualPage && $.mbile.actualPage.attr("id") == id)
				return;

			$.mbile.pageIsChanging = true;
			$.mbile.showPageLoading(1000,false);

			var newPage = $(url).hide();
			var oldPage = $.mbile.actualPage;


			/*
			 both old and new page are on the body
			 fix bars, eventually add default bars, make scrollable, fix a href
			 init the content of new page
			 */

			if (animation == undefined) {
				if (newPage.data("animation")) {
					animation = newPage.data("animation");
				} else {
					animation = "slideleft";
				}
			}

			newPage.data("animation", animation);

			/* Add page to history */
			/* todo: add also the URL of the page in the case it is removed from the DOM */

			if (addHistory === undefined) addHistory = true;

			if (!$.mbile.pages[newPage.attr("id")])
				$.mbile.pages[newPage.attr("id")] = {};

			if (oldPage && addHistory) {
				$.extend($.mbile.pages[newPage.attr("id")], {url:originalUrl,prev:oldPage.attr("id"),data:oldPage.data("pageData"),anim:animation,scroll:document.mbileScroll ? document.mbileScroll.actualY : 0});
			}

			if (oldPage && document.mbileScroll) {
				oldPage.data("scrollTop", document.mbileScroll.actualY);
			}

			$(".buttonBar .sel").removeClass("sel");
			$.mbile.initContent(newPage);

			/* trigger event: pagebeforeshow */

			var pagebeforeshow = $.Event("pagebeforeshow");
			pagebeforeshow.page = newPage;
			pagebeforeshow.oldPage = oldPage;
			pagebeforeshow.canChangePage = true;
			newPage.trigger(pagebeforeshow);
			if (!pagebeforeshow.canChangePage) {
				pagebeforeshow.canChangePage = true;
				return;
			}

			/* trigger event: pagebeforehide */

			if (oldPage){
				var pagebeforehide = $.Event("pagebeforehide");
				pagebeforehide.page = oldPage;
				pagebeforehide.newPage = newPage;
				oldPage.trigger(pagebeforehide);
			}

			/* reposition scroll to old scroll */

			if (newPage.data("scrollTop") && document.transitionEnabled)
				document.mbileScroll.scrollTo(0, newPage.data("scrollTop"), "10ms");

			newPage.hide().removeClass("offScreen");

			$.mbile.hidePageLoading();

			if (document.transitionEnabled) {

				if (oldPage) {
					newPage.addClass(animation);
					oldPage.addClass(animation);

					/* Apply transition */

					oldPage.addClass("out");

					setTimeout(function(){newPage.addClass("in").show();},200);

					oldPage.on('webkitAnimationEnd', function() {
						oldPage.addClass("offScreen");
						oldPage.removeClass("out " + animation);
						oldPage.off('webkitAnimationEnd');
						newPage.removeClass("in " + animation);
						transitionCompleted(oldPage, newPage, animation);
					});

				} else {

					/* this is the first page shown */

					newPage.fadeIn(500, function() {
						$.mbile.home = newPage;
						$.mbile.home.url = originalUrl;
						transitionCompleted(oldPage, newPage, animation);
						setTimeout(function(){$("body").fadeTo(500,1);},1000);
					});


				}

			} else {

				if (!oldPage){
					$.mbile.home = newPage;
					$.mbile.home.url = originalUrl;
				}else
					oldPage.fadeOut(500);

				newPage.fadeIn(500,function(){
					setTimeout(function(){$("body").fadeTo(500,1);},1000);
				});
				transitionCompleted(oldPage, newPage, animation);
			}

			function transitionCompleted(oldP, newP) {

				$.mbile.actualPage = newP;

				/* trigger event: pageshow */

				var pageshow = $.Event("pageshow");
				pageshow.page = newP;
				pageshow.oldPage = oldP;
				newP.trigger(pageshow);

				if (oldP){
					var pagehide = $.Event("pagehide");
					pagehide.newPage = newP;
					oldP.trigger(pagehide);

					if (oldP.is("[data-persist=false]"))
						oldP.remove();
				}

				$.mbile.pageIsChanging = false;
			}
		},

		updatePage:function(){
			var page = this;
			if(page.length)
				if(!$.mbile.pages[page.attr("id")].prev || $.mbile.home == undefined)
					return;
			$.mbile.addBackBtn(page);
		},


		/* Set all the default behavior to page elements*/

		getBackAnim:function(anim) {
			var backAnim;
			switch (anim) {
				case "slideleft":
					backAnim = "slideright";
					break;
				case "slideright":
					backAnim = "slideleft";
					break;
				case "pop":
					backAnim = "pop";
					break;
				case "slidedown":
					backAnim = "slideup";
					break;
				case "slideup":
					backAnim = "slidedown";
					break;
				case "flipleft":
					backAnim = "flipright";
					break;
				case "flipright":
					backAnim = "flipleft";
					break;
				case "swapright":
					backAnim = "swapleft";
					break;
				case "swapleft":
					backAnim = "swapright";
					break;
				case "cubeleft":
					backAnim = "cuberight";
					break;
				case "cuberight":
					backAnim = "cubeleft";
					break;
				case "fade":
					backAnim = "fade";
					break;
				default:
					backAnim = "slideright";
			}
			return backAnim;
		},

		addBackBtn:function(page) {
			var header = page.find("[data-role=header]");
			header.find(".backBtn").remove();
			var actualPageID = page.attr("id");
			if (page == undefined || !$.mbile.pages[actualPageID].prev || $.mbile.home == undefined || actualPageID == $.mbile.home.attr("id")) return;

			header.find(".backBtn").remove();
			var backBtn = $("<a class='backBtn'></a>").hide();
			header.prepend(backBtn);
			var backBtnText = $.mbile.pages[actualPageID].prev && $.mbile.pages[actualPageID].prev != $.mbile.home.attr("id") ? "Back" : "Home";
			header.find(".backBtn").append(backBtnText).on($.mbile.events.end, $.mbile.goBack);
			backBtn.show();
		},

		goBack:function() {
			var actualPage = $.mbile.actualPage.attr("id");
			var actualPageHistory=$.mbile.pages[actualPage];
			var home="#"+ $.mbile.home.attr("id");
			var url = actualPageHistory.prev ? "#"+actualPageHistory.prev : home;

			if($(url).length==0)
				url = $.mbile.pages[actualPageHistory.prev].url ? $.mbile.pages[actualPageHistory.prev].url:$.mbile.home.url;

			var anim = actualPageHistory.anim;
			var pageData = actualPageHistory.data;
			$(this).goToPage(url, $.mbile.getBackAnim(anim), false, pageData);
			actualPageHistory.prev = $.mbile.home.attr("id");
		},

		setHeaderFooterBehavior:function(page) {

			page.find("[data-role=header]").each(function() {

				var header = $(this);
				if (header.data("position")!="fixed"){
					page.find("[data-role=content]").prepend(header);
				}
				if(header.data("type")==="default"){
					var title = $("h1", header).html();
					header.html($.mbile.defaultHeader.html());
					if(title && title.length)
						$("h1", header).html(title);
				}

			});

			page.find("[data-role=footer]").each(function() {
				if ($(this).data("position")!="fixed"){
					page.find("[data-role=content]").append($(this));
				}

				if($(this).data("type")==="default"){
					$(this).html($.mbile.defaultFooter.html());
				}

			});
		},

		setLinkBehavior:function(page) {
			page.find("a").not("[rel=external]").each(function() {
				var link = $(this);
				link.parent(".line").setHover(page);
				var url = $(this).attr("href");
				if (url && (url.indexOf("javascript:") < 0 || !link.is("[rel=external]"))) {
					link.removeAttr("href");
					var animation = link.data("animation");
					var hasHistory = link.data("hasHistory");
					var pageData = link.data("parameters");
					link.on($.mbile.events.start,function(e){
						touch = e;
						if(document.isTouch)
							var touch = e.changedTouches[0];
						document.x = touch.clientX;
						document.y = touch.clientY;
					})
					link.on($.mbile.events.end,function(e){
						touch = e;
						if(document.isTouch)
							var touch = e.changedTouches[0];
						if(touch.clientY > document.y+20 || touch.clientY < document.y-20 || touch.clientX > document.x+20 || touch.clientX < document.x-20)
							return;

						$(this).goToPage(url, animation, hasHistory, pageData);
					});
				}
			});
		},

		setButtonBarBehavior:function(page){
			var buttonBars = page.find(".buttonBar");
			buttonBars.each(function(){

				var buttonBar = $(this);

				var adjust = buttonBar.parents().data("role") === "footer" ? .2 : 3;
				var buttons= buttonBar.children();

				var buttonsLength= buttons.length;
				buttons.css({width:((100/buttonsLength)-adjust)+"%"});

				$(document).one("pagebeforeshow",function(e){

					buttonBar.find(".sel").removeClass("sel");
					if(e.page){
						$("." + e.page.attr("id")).addClass("sel");
					}
				});

				buttons.each(function(){
					if($(this).data("page")){
						var className =$(this).data("page").asId();
						$(this).addClass(className).on($.mbile.events.end,function(){
							$.mbile.goToPage($(this).data("page"));
						})
					}

					if($(this).is("button"))
						$(this).wrapInner("<span/>");
				})
			})
		},

		setFormBehaviour: function(page){
			page.find("form input[type=checkbox]").addTouch();
		},

		setSectionBehavior:function(page) {
			var slideSection = page.attr("data-sections") == "slide";

			if (!document.transitionEnabled || !slideSection)
				return;

			clearInterval(document.SectionBehavior);
			page.find("[data-role=section].fake").remove();
			var $sections = page.find("[data-role=section]");
			var containerTopHeight = page.find("[data-role=header]").height();
			var $fakeSection = $("<div data-role='section'>").addClass("fake").css({position:"absolute", top:0, zIndex:2, width:"100%"}).hide();
			page.prepend($fakeSection);

			document.SectionBehavior = setInterval(function() {
				$sections.each(function() {
					var $section = $(this);
					var top = $section.offset().top;
					if (top < containerTopHeight + 10) {
						$fakeSection.fadeIn().text($section.text());
					}
				});
				if ($sections.length > 0 && $sections.eq(0).offset().top > containerTopHeight) {
					$fakeSection.hide();
				}
			}, 50);
		},

		setButtonBehavior:function(page) {
			var buttons = page.find("button,.button, .backBtn");
			buttons.setHover(page);
		},

		setHover:function(page) {
			if(page.data("inited")) return;
			this.on($.mbile.events.start, function() {
				$(this).addClass("hover"); })
					.on($.mbile.events.end, function() {$(this).removeClass("hover")});
		},

		showPageLoading:function(delay, timeout) {
			var loaderScreen = $("#loader").length == 0 ? $("<div/>").attr("id", "loader") : $("#loader");
			if ($("#loader").length == 0) {
				var spinner = $("<div/>").attr("id", "spinner");
				for (var i = 1; i <= 12; i++) {
					var bar = $("<div/>").addClass("bar" + i);
					spinner.append(bar);
				}
				loaderScreen.append(spinner);
				$("body").append(loaderScreen);
			}
			//loaderScreen.show();
			var timer = delay ? 0 : delay;
			setTimeout(function() {
				loaderScreen.fadeTo(300, 1);
				if (timeout != undefined) setTimeout($.mbile.hidePageLoading, timeout);
			}, timer);

			return loaderScreen;
		},

		hidePageLoading:function(callBack) {
			if (callBack == undefined) callBack = function(){};
			var loaderScreen = $("#loader");
			loaderScreen.fadeOut(300, function() {
				callBack();
				loaderScreen.remove();
			});
			return loaderScreen;
		},

		refreshScroll:function() {
			if(document.mbileScroll)
				setTimeout(function(){
					document.mbileScroll.refresh();
				},300);
		},

		alert:function(message, type) {

			if(!type)
				type = "";
			$(".alertBox").remove();

			var alertBox = $("<div/>").addClass("alertBox "+ type);
			alertBox.html(message);

			$("body").append(alertBox);

			setTimeout(function(){
				alertBox.fadeOut(500,function(){
					$(this).remove();
				})
			},3000);
		},

		dialog:function(message) {

		},

		includeCSS:function(URL){
			var link=$("<link/>").attr({href:URL,type:"text/css", rel:"stylesheet"});
			$("head").append(link);
		},

		addExtensions:function(){
			$.each(arguments,function(i){
				var name=this[0];
				var param=this[1];
				var hasCSS=this[2];

				if(!$.mbile.loadedExtensions[name]){
					if(hasCSS)
						$.mbile.includeCSS($.mbile.defaults.extensionsRoot+"/"+name+"/"+name+".css");

					$.getScript($.mbile.defaults.extensionsRoot+"/"+name+"/jquery.mb.ile."+name+".js",function(){
						if(typeof $.fn[name+"_init"] === "function")
							$(document).on("pagebeforeshow.mbileInit",function(e){
								e.page[name+"_init"](param);
							})
					});
				}
				$.mbile.loadedExtensions.push(name);
			});
		},

		addTouch: function(){

			this.each(function(i,el){
				$(el).on('touchstart touchmove touchend touchcancel',function(){

					//we pass the original event object because the jQuery event
					//object is normalized to w3c specs and does not provide the TouchList

					handleTouch(event);
				});
			});

			var handleTouch = function(event){
				touch = event;
				if(document.isTouch)
					var touches = event.changedTouches,
							first = touches[0],
							type = '';

				switch(event.type)
				{
					case 'touchstart':
						type = 'mousedown';
						break;

					case 'touchmove':
						type = 'mousemove';
						break;

					case 'touchend':
						type = 'mouseup';
						break;

					default:
						return;
				}

				var simulatedEvent = document.createEvent('MouseEvent');
				simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0/*left*/, null);

				first.target.dispatchEvent(simulatedEvent);

				event.preventDefault();
			};
		},

		isOnPage: function() {
			return this.length > 0;
		},

		swipe: function(opt) {
			var defaults = {
				time:600,
				diff:120,
				swipeLeft:function() {},
				swipeRight:function() {}
			};
			$.extend(defaults, opt);
			return this.each(function() {
				this.swipe = {s:0,e:0};
				this.addEventListener($.mbile.events.start, function(event) {
					event.preventDefault();
					touch = event;
					if(document.isTouch)
						var touch = event.touches[0];
					this.swipe.s = touch.pageX;
				}, false);
				this.addEventListener($.mbile.events.end, function(event) {
					event.preventDefault();
					touch = event;
					if(document.isTouch)
						var touch = event.changedTouches[0];
					this.swipe.e = touch.pageX;
					if (this.swipe.e > this.swipe.s + defaults.diff) {
						event.stopPropagation();
						defaults.swipeRight(this);
					} else if (this.swipe.e < this.swipe.s - defaults.diff) {
						event.stopPropagation();
						defaults.swipeLeft(this);
					}
				}, false);
			})
		},
		tap: function(opt) {
			var defaults = {
				time:600,
				tap:function(o) {}
			};
			$.extend(defaults, opt);
			return this.each(function() {

				var el = this;

				el.tap = {s:0,e:0};
				$(el).on($.mbile.events.start, function(event) {

					event.preventDefault();
					el.tap.s = new Date().getTime();
				});
				$(el).on($.mbile.events.end, function(event) {
					event.preventDefault();
					el.tap.e = new Date().getTime();
					if (el.tap.e - el.tap.s >= defaults.time) {
						event.stopPropagation();
						defaults.tap(el);
					}
				});
			})
		},

		dblTap: function(callback) {
			var time = 300;
			var el = this.get(0);

			var count = 0;

			el.dbltap = {s:0,e:0};

			$(el).on($.mbile.events.start, function() {
				el.dbltap.s = new Date().getTime();
			});

			$(el).on($.mbile.events.end, function() {
				el.dbltap.e = new Date().getTime();

				if (el.dbltap.e - el.dbltap.s < time && count>=1) {
					callback();
					count = 0;
				}else{
					count++;
					setTimeout(function(){
						count=0;
					}, time+100)
				}
			});
		},

		setFixed: function(page) {
			if(page.find(".headerPlaceHolder").size()==0){
				var placeHolder=$("<div/>").addClass("headerPlaceHolder").css({height:page.find("[data-role=header]").outerHeight()});
				page.find("[data-role=content]").prepend(placeHolder).scrollTop( 100 );
			}
			page.on($.mbile.events.move, function() {
				page.find("[data-role=header]:visible").each(function() {
					$(this).hide();
				});
				page.find("[data-role=footer]:visible").each(function() {
					$(this).hide();
				});
			});

			page.on($.mbile.events.end, function() {
				// scrolling is finished?

				var oldPos = window.scrollY,newPos;
				var fHF=setInterval(function(){
					newPos=window.scrollY;
					if(newPos!=oldPos) {
						oldPos=newPos;
					}else{
						clearInterval(fHF);
						var header = page.find("[data-role=header]");
						if (header.size() > 0) {
							header.css({position:"absolute",width:$(window).width(), top:window.scrollY, zIndex:10000}).show();
						}
						var footer = page.find("[data-role=footer]");
						if (footer.size() > 0) {
							footer.css({position:"absolute", width:$(window).width(),top:window.scrollY + (window.innerHeight - (footer.outerHeight()/2)), zIndex:10000}).show();
						}
					}
				},100);
			});
		}

	};
	/* Utilities*/

	String.prototype.asId = function () {
		return this.replace(/[^a-zA-Z0-9_]+/g, '');
	};

	/* go to error page on any ajax error */

	$(document).on("ajaxError", function(ev) {
		$.mbile.pageIsChanging = false;
		console.debug("Error on ajax:",ev);
		$.mbile.goToPage($.mbile.defaults.errorPage,"pop",true);
	});

})(jQuery);


$.fn.goToPage = $.mbile.goToPage;
$.fn.setHover = $.mbile.setHover;
$.fn.updatePage = $.mbile.updatePage;

$.fn.addTouch = $.mbile.addTouch;
$.fn.isOnPage = $.mbile.isOnPage;
$.fn.swipe = $.mbile.swipe;
$.fn.tap = $.mbile.tap;
$.fn.dblTap = $.mbile.dblTap;



var alert = $.mbile.alert;
