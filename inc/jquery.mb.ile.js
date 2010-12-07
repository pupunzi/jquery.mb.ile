/*
 *
 * jQuery.mb.components: jquery.mb.ile
 * version: 1.0 alpha - 12-nov-2010 - 48
 * © 2001 - 2010 Matteo Bicocchi (pupunzi), Open Lab
 *
 * Licences: MIT, GPL
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * email: mbicocchi@open-lab.com
 * site: http://pupunzi.com
 *
 *
 *
 * EVENTS triggered:
 *
 * beforepagechange
 * beforepageshow
 * pageshow
 *
 * This framework works perfectly on iOs devices; Android partially support webkit transitions so the scroll behavior is slow.
 * if you want to enable anyway the fixed header and footer on Android add the Android closure:
 *
 * document.transitionEnabled = $.browser.safari && (/(iPod || iPad || iPhone || Mac || windows || Android )/i).test(navigator.userAgent);
 */
document.transitionEnabled = $.browser.safari && (/(iPod|iPad|iPhone|Mac|windows)/i).test(navigator.userAgent);

document.iScroll = {};
document.iScroll.enabled = true;
document.myScroll = null;


(function($) {
  $.mbile = {
    name:"mb.ile",
    author:"Matteo Bicocchi",
    version:"0.2 alpha",
    defaults:{
      collapsibleFooter:true,
      startupScreen: false,
      icon:false,
      icon4:false,
      addGlossToIcon:false,
      slidingSections:true,
      manageHistory:true,
      errorPage:"pages/error_page.html"
    },
    orientation:"portrait",
    pages:{},
    initComponents:[],


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
      // Set appropriate icon (retina display stuff is experimental)
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

      $(document).bind('orientationchange', $.mbile.checkOrientation);
      $(document).bind('touchmove', function (e) {
        if (document.transitionEnabled)
          e.preventDefault();
      }, false);

      var pages = $("[data-role=page]");
      pages.addClass("offScreen");

      if (opt.url)
        $.mbile.goToPage(opt.url);

    },
    
    checkOrientation:function() {
      if (document.transitionEnabled)
        $.mbile.setHeight($.mbile.actualPage);
      $.mbile.orientation = Math.abs(window.orientation) == 0 ? 'portrait' : 'landscape';
      $("body").removeClass('portrait landscape').addClass($.mbile.orientation);
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
      }
      $.mbile.setLinkBehavior(page);
      $.mbile.setButtonBehavior(page);

      if (document.transitionEnabled) {
        //wraps content into a scrollable wrapper
        $.mbile.setHeight(page);
        if ($.mbile.defaults.slidingSections)
          $.mbile.setSectionBehavior(page);

        if (document.myScroll)
          document.myScroll.destroy();
        document.myScroll = new iScroll(page.find("[data-role=content]:first").get(0), {desktopCompatibility:true});
        $.mbile.refreshScroll();
      } else {
        $("body").addClass("noTransition");
        $.setFixed(page);
      }
       page.data("inited", true);
    },

    goToPage:function(url, animation, addHistory, pageData) {

      if (url.indexOf("#") < 0) {
        var id = url.asId();

        // page is loaded when not present or with data passed
        if ($("#" + id).size() <= 0 || pageData) {//
          $.ajax({
            type: "GET",
            url: url,
            data:pageData,
            dataType:"html",
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

              //trigger event: pagecreate
              var pagecreate = $.Event("pagecreate");
              pagecreate.page = newCandidatePage;
              newCandidatePage.trigger(pagecreate);

              /* the page is now loaded the goToPage will be called again to proceed */

              $.mbile.goToPage("#" + id, animation, addHistory, pageData);
            }
          });
          return;
        } else {
          url = "#" + id;
        }
      }

      if (url == "#")
        return;
      if ($.mbile.pageIsChanging)
        return;
      if ($.mbile.actualPage && $.mbile.actualPage.attr("id") == id)
        return;

      $.mbile.pageIsChanging = true;
      $.mbile.showPageLoading(1000);

      var newPage = $(url).hide();
      var oldPage = $.mbile.actualPage;


      // both old and new page are on the body
      // fix bars, eventually add default bars, make scrollable, fix a href
      // init the content of new page

      if (animation == undefined) {
        if (newPage.data("animation")) {
          animation = newPage.data("animation");
        } else {
          animation = "slideleft";
        }
      }
      newPage.data("animation", animation);

      /* Add page to history */

      if (addHistory == undefined) addHistory = true;

      if (!$.mbile.pages[newPage.attr("id")])
        $.mbile.pages[newPage.attr("id")] = {};
      if (oldPage && addHistory) {
        $.extend($.mbile.pages[newPage.attr("id")], {prev:oldPage.attr("id"),data:oldPage.data("pageData"),anim:animation,scroll:document.myScroll ? document.myScroll.actualY : 0});
      }

      if (oldPage && document.myScroll) {
        oldPage.data("scrollTop", document.myScroll.actualY);
      }

      $.mbile.initContent(newPage);

      //trigger event: pagebeforeshow
      var pagebeforeshow = $.Event("pagebeforeshow");
      pagebeforeshow.oldPage = oldPage;
      pagebeforeshow.canChangePage = true;
      newPage.trigger(pagebeforeshow);
      if (!pagebeforeshow.canChangePage) {
        pagebeforeshow.canChangePage = true;
        return;
      }

      //trigger event: pagebeforehide
      if (oldPage){
        var pagebeforehide = $.Event("pagebeforehide");
        pagebeforehide.canChangePage = true;
        oldPage.trigger(pagebeforehide);
        if (!pagebeforehide.canChangePage) {
          pagebeforehide.canChangePage = true;
          return;
        }
      }

      /* reposition scroll to old scroll */

      if (newPage.data("scrollTop") && document.transitionEnabled)
        document.myScroll.scrollTo(0, newPage.data("scrollTop"), "10ms");

      newPage.hide().removeClass("offScreen");

      $.mbile.hidePageLoading();

      if (document.transitionEnabled) {

        if (oldPage) {
          newPage.addClass(animation);
          oldPage.addClass(animation);

          /* Apply transition */

          oldPage.addClass("out");
          newPage.addClass("in").show();
          newPage.bind('webkitAnimationEnd', function() {
            newPage.unbind('webkitAnimationEnd');
            newPage.removeClass("in " + animation);
            oldPage.addClass("offScreen").removeClass("out " + animation);

            transitionCompleted(oldPage, newPage, animation);
          });

        } else {

          /* this is the first page shown */

          $("body").show();
          newPage.fadeIn(500, function() {
            $.mbile.home = newPage;
            transitionCompleted(oldPage, newPage, animation);
          });
        }

      } else {

        if (!oldPage)
          $.mbile.home = newPage;
        else
          oldPage.fadeOut(500);

        newPage.fadeIn(500);
        transitionCompleted(oldPage, newPage, animation);
      }

      function transitionCompleted(oldP, newP) {

        $.mbile.actualPage = newP;

        /* trigger event: pageshow */

        var pageshow = $.Event("pageshow");
        pageshow.oldPage = oldP;
        newPage.trigger(pageshow);

        if (oldP){
          var pagehide = $.Event("pagehide");
          pagehide.newPage = newP;
          oldPage.trigger(pagehide);
        }

        $.mbile.pageIsChanging = false;
      }
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

      var backBtn = $("<a class='backBtn back black'><span></span></a>").hide();
      header.prepend(backBtn);
      var backBtnText = $.mbile.pages[actualPageID].prev && $.mbile.pages[actualPageID].prev != $.mbile.home.attr("id") ? "back" : "home";
      header.find(".backBtn").append(backBtnText).bind("mouseup", $.mbile.goBack);
      backBtn.show();
    },

    goBack:function() {
      var actualPage = $.mbile.actualPage.attr("id");
      var url = $.mbile.pages[actualPage].prev ? $.mbile.pages[actualPage].prev : $.mbile.home.attr("id");
      var anim = $.mbile.pages[actualPage].anim;
      var pageData = $.mbile.pages[actualPage].data;
      $(this).goToPage("#" + url, $.mbile.getBackAnim(anim), false, pageData);
    },

    setHeaderFooterBehavior:function(page) {
      page.find("[data-role=header]").each(function() {
        if ($(this).data("position")!="fixed"){
          page.find("[data-role=content]").prepend($(this));
        }
      });

      page.find("[data-role=footer]").each(function() {
        if ($(this).data("position")!="fixed"){
          page.find("[data-role=content]").append($(this));
        }
      });

      /*sliding footer Behavior*/
      if ($.mbile.defaults.collapsibleFooter) {
        var collapsFooter = $("<span/>").addClass("collapsFooter").attr("collapsed", 0).html("&nbsp;");
        var footer = page.find("[data-role=footer][data-position=fixed]");
        if(footer.length==0) return;
        footer.append(collapsFooter);
        footer.addClass("collapsibleFooter");
        collapsFooter.bind("mousedown", function() {
          var el = $(this);
          if (el.attr("collapsed") == 0) {
            footer.addClass("out");
            el.attr("collapsed", 1)
          } else {
            footer.removeClass("out");
            el.attr("collapsed", 0)
          }
        });
      }
    },

    setLinkBehavior:function(page) {
      page.find("a").not("[rel=external]").each(function() {
        var link = $(this);
        link.parent(".line").setHover();

        var url = $(this).attr("href");
        if (url && (url.indexOf("javascript:") < 0 || !link.is("[rel=external]"))) {
          link.removeAttr("href");
          var animation = link.data("animation");
          var hasHistory = link.data("hasHistory");
          var pageData = link.data("parameters");
          link.click(function(){
            $(this).goToPage(url, animation, hasHistory, pageData);
          });
        }
      });
      $("[onclick]").each(function() {
        var action = $(this).attr("onclick");
        $(this).removeAttr("onclick").bind("mouseup", action);
      });
    },

    setSectionBehavior:function(page) {
      var slideSection = page.attr("data-sections") == "slide";

      if (!document.transitionEnabled || !slideSection) return;
      clearInterval(document.SectionBehavior);
      page.find("[data-role=section].fake").remove();
      var $sections = page.find("[data-role=section]");
      var containerTop = page.find("[data-role=header]").height();
      var $fakeSection = $("<div data-role='section'>").addClass("fake").css({position:"absolute", top:0, zIndex:2, width:"100%"}).hide();
      page.find("[data-role=content]").before($fakeSection);
      document.SectionBehavior = setInterval(function() {
        $sections.each(function() {
          var $section = $(this);
          var top = $section.offset().top;
          if (top < containerTop + 10) {
            $fakeSection.fadeIn(800).text($section.text());
          }
        });
        if ($sections.length > 0 && $sections.eq(0).offset().top > containerTop) {
          $fakeSection.hide();
        }
      }, 50);
    },

    setButtonBehavior:function(page) {
      var buttons = page.find("button,.button, .backBtn");
      buttons.setHover();
    },

    setHover:function() {
      this.bind("mousedown", function() {
        $(this).addClass("hover"); })
              .bind("mouseup", function() {$(this).removeClass("hover")});
      if (document.transitionEnabled)
        $(this).addTouch();
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
      setTimeout(function () {
        if (document.myScroll) document.myScroll.refresh()
      }, 0)
    },

    alert:function(message) {
    },


    /*Custom behaviors*/

    setListBehavior:function() {},

    setSelectableBehavior:function() {
      var selectables = $(".line.selectable");
      selectables.each(function() {
        var selImg = $("<span/>").addClass("selImg");
        $(this).append(selImg);

        $(this).toggle(
                function() {$(this).addClass("selected");},
                function() {$(this).removeClass("selected");}
                ).addTouch();
      });
    },

    setPanelBehavior:function() {
      var $panels = $($.mbile.defaults.body + " #scroller").find("a[rel=panel]");
      $panels.each(function() {
        var panel = $(this).attr("href");
        var panelImg = $("<span/>").addClass("panelImg");
        $(this).parent("span").append(panelImg);
        $(this).toggle(
                function() {
                  $(panel).openPanel();
                  $.mbile.refreshScroll();
                },
                function() {
                  $(panel).closePanel();
                  $.mbile.refreshScroll();
                }
                ).addTouch();
      })
    },

    setSortableBehavior:function() {
      $(".sortable .line").each(function() {
        var handle = $("<span/>").addClass("handle").html("&nbsp;");
        $(this).append(handle);
        handle.addTouch();
        handle.bind("mousedown", function() {
          document.iScroll.enabled = false;
        });
      });
      $(".sortable").sortable({
        helper:"clone",
        axis: 'y',
        handle:".handle",
        start: function(event, ui) {
          $(ui.helper).addClass("clone selected");
          $($.mbile.defaults.body).append(ui.helper);
        },
        stop: function(event, ui) {
          event.stopPropagation();
          document.iScroll.enabled = true;
        }
      });
    },

    changeTheme:function(themeURL) {
      $("#mbileCSS").attr("href", themeURL);
    }

  };

  $.fn.goToPage = $.mbile.goToPage;
  $.fn.setHover = $.mbile.setHover;
  $.fn.initialize = $.mbile.initialize;

  /* Utilities*/

  String.prototype.asId = function () {
    return this.replace(/[^a-zA-Z0-9_]+/g, '');
  };

  $.fn.isOnPage = function() {
    return this.length > 0;
  };

  //Panels
  $.fn.openPanel = function() {
    this.removeClass("close");
    this.addClass("open").one('webkitAnimationEnd', $.mbile.refreshScroll);
    this.prev("span").addClass("selected header");
    $.mbile.refreshScroll();
  };
  $.fn.closePanel = function() {
    this.removeClass("open");
    this.addClass("close").one('webkitAnimationEnd', function() {
      $(".panel.close").removeClass("close");
      $.mbile.refreshScroll();
    });
    this.prev("span").removeClass("selected header");
  };

  /* touch events */

  $.fn.swipe = function(opt) {
    var defaults = {
      time:600,
      diff:120,
      swipeLeft:function() {
      },
      swipeRight:function() {
      }
    };
    $.extend(defaults, opt);
    return this.each(function() {
      this.swipe = {s:0,e:0};
      this.addEventListener('touchstart', function(event) {
        event.preventDefault();
        var touch = event.touches[0];
        this.swipe.s = touch.pageX;
      }, false);
      this.addEventListener('touchend', function(event) {
        event.preventDefault();
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
  };

  /* binding for fixed header/footer (all but iOs) */

  $.setFixed = function(page) {
    if(page.find(".headerPlaceHolder").size()==0){
      var placeHolder=$("<div/>").addClass("headerPlaceHolder").css({height:page.find("[data-role=header]").outerHeight()});
      page.find("[data-role=content]").prepend(placeHolder).scrollTop( 100 );
    }

    $(document).bind("touchmove", function() {
      page.find("[data-role=header]:visible").each(function() {
        $(this).hide();
      });
      page.find("[data-role=footer]:visible").each(function() {
        $(this).hide();
      });
    });
    $(document).bind("scroll", function() {
      // scrolling is finished?
      var oldPos = window.scrollY,newPos;
      var header = page.find("[data-role=header]");
      if (header.size() > 0) {
        header.css({position:"absolute",width:"100%", top:window.scrollY, zIndex:10000}).show();
      }
      var footer = page.find("[data-role=footer]");
      if (footer.size() > 0) {
        footer.css({position:"absolute", width:"100%",top:window.scrollY + (window.innerHeight - (footer.outerHeight()/2)), zIndex:10000}).show();
      }
    });
  };

  /* go to error page on any ajax error */

  $(function() {
    $(document).bind("ajaxError", function(ev) {
      $.mbile.pageIsChanging = false;
      console.debug("Error on ajax:",ev);
      $.mbile.goToPage($.mbile.defaults.errorPage, "pop");
    });
  });

  //  function alert(){
  //    $.mbile.alert()
  //  };

})(jQuery);
