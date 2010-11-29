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
 */

document.iScroll={};
document.iScroll.enabled=true;
document.myScroll=null;

(function($){
  $.mbile={
    name:"mb.ile",
    author:"Matteo Bicocchi",
    version:"0.1 alpha",
    defaults:{
      context:"#mbPage",
      header:"#header",
      footer:"#footer",
      body:"#wrapper",
      fixedHeaderFooter:true,
      collapsibleFooter:true,
      startupScreen: false,
      icon:false,
      icon4:false,
      addGlossToIcon:false,
      slidingSections:true,
      errorPage:"pages/error_page.html"
    },
    orientation:"portrait",
    pages:{},

    init:function(url,options){
      var opt={};
      $.extend(opt,$.mbile.defaults,options);

      $.mbile.pages[url]={url:url};
      $.mbile.actualPage=url;
      $.mbile.home=url;
      $.mbile.defaultHeader=$(opt.header).clone();
      $.mbile.defaultFooter=$(opt.footer).clone();

      $(opt.header+","+opt.footer).each(function(){
        $(this).wrapInner("<div class='HFcontent'/>");
      });

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

      /*sliding footer behaviour*/
      if(opt.collapsibleFooter){
        var collapsibleFooter= $("<span/>").attr("id","collapsibleFooter").attr("collapsed",0).html("&nbsp;");
        $(opt.footer).append(collapsibleFooter);
        $(opt.footer).addClass("collapsibleFooter");

        $("#collapsibleFooter")
          .bind("mousedown",
          function(){
            var el=$(this);
            if(el.attr("collapsed")==0){
              $(opt.footer).addClass("out");
              el.attr("collapsed",1)
            }else{
              $(opt.footer).removeClass("out");
              el.attr("collapsed",0)
            }
          });
      }

      var finalize= function(content){
        $(document).bind('orientationchange', $.mbile.checkOrientation);
        $(document).bind('touchmove', function (e) { e.preventDefault(); }, false);
        $.mbile.setHeight();
        $.mbile.initContent(opt);
        $(opt.context).css({"visibility":"visible"}).hide();
        var event=$.Event("pageshow");
        event.newPage=content;
        $(document).trigger(event);
        $(opt.context).fadeIn(500);
      };

      if(url!=undefined && $("#"+url).isOnPage()){
        var pages= $("[data-role=page]");
        pages.hide();
        var content=$("#"+url).clone(true);
        content.attr("id",url+"_clone");

        $($.mbile.defaults.body).html(content);
        finalize(content.get(0));
        content.fadeIn(500);

        $.mbile.pages[url].onPage = true;

      }else if(url!=undefined){

        $($.mbile.defaults.body).load(url, function(content){finalize(content);});

      }else{

        alert("Sorry, there's no content to show");

      }
    },
    checkOrientation:function(){
      $.mbile.setHeight();
      $.mbile.orientation = Math.abs(window.orientation) == 0 ? 'portrait' : 'landscape';
      $($.mbile.defaults.context).removeClass('portrait landscape').addClass($.mbile.orientation);
    },
    setHeight: function() {
      var headerH = $($.mbile.defaults.header).outerHeight(true);
      var footerH = $($.mbile.defaults.footer).outerHeight(true);
      var wrapperH = $(window).height() - headerH+15;// - footerH;
      $($.mbile.defaults.body).css({height:wrapperH-15});
    },
    initContent:function(opt){
      if($("#scroller").length==0){
        var scroller=$("<div/>").attr("id","scroller");
        $(opt.body).wrapInner(scroller);
      }
      $("[onclick]").each(function(){
        var action= $(this).attr("onclick");
        $(this).removeAttr("onclick").bind("mousedown",action);
      });
      $.mbile.setHeaderFooterBehavior(opt);
      setTimeout(function(){
        $.mbile.checkOrientation();
        $.mbile.setPanelBehavior();
        $.mbile.setSortableBehavior();
        $.mbile.setSelectableBehavior();
        $.mbile.setLinkBehavior();
        $.mbile.setListBehaviour();
        if(opt.slidingSections)
          $.mbile.setSectionBehavior();
        if(document.iScroll.enabled)
          document.myScroll = new iScroll('scroller', {desktopCompatibility:true});
      },200);
    },
    addBackBtn:function(opt){
      $(opt.header+" .backBtn").remove();
      var actualPage=$.mbile.actualPage;
      if (actualPage==$.mbile.home) return;
      var backBtn=$("<a class='backBtn back black'><span></span></a>").hide();
      $(opt.header+" .HFcontent").prepend(backBtn);
      var backBtnText= $.mbile.pages[actualPage].prev && $.mbile.pages[actualPage].prev!=$.mbile.home?"back":"home";

      $(opt.header+" .backBtn").append(backBtnText).bind("mousedown",function(){
        var url= $.mbile.pages[actualPage].prev?$.mbile.pages[actualPage].prev:$.mbile.home;
        var anim= $.mbile.pages[actualPage].anim;
        $(this).addClass("hover").goToPage(url,$.mbile.getBackAnim(anim),false);
      });

      backBtn.show();
    },
    goBack:function(){
      var actualPage=$.mbile.actualPage;
      var url= $.mbile.pages[actualPage].prev?$.mbile.pages[actualPage].prev:$.mbile.home;
      var anim= $.mbile.pages[actualPage].anim;
      $(this).addClass("hover").goToPage(url,$.mbile.getBackAnim(anim),false);

    },
    setHeaderFooterBehavior:function(opt){
      var newHeader=$(opt.body).find("[data-role=header]").clone(true);
      var header= newHeader.length>=1?newHeader:$.mbile.defaultHeader;
      var newFooter=$(opt.body).find("[data-role=footer]").clone(true);
      var footer= newFooter.length>=1?newFooter:$.mbile.defaultFooter;

      $(opt.header+" .HFcontent").fadeOut(0,function(){
        $(this).empty();
        $(this).append(header.html());
        $(opt.body).find("[data-role=header]").remove();
        $.mbile.addBackBtn(opt);
        $(this).fadeIn(50);
      });

      $(opt.footer+" .HFcontent").fadeOut(0,function(){
        $(this).empty();
        $(this).append(footer.html());
        $(opt.body).find("[data-role=footer]").remove();
        $(this).fadeIn(0);
      });
      setTimeout($.mbile.setButtonBehavior,100);
    },
    setListBehaviour:function(){
      var lines=$(".list .line");
      lines.setHover();
    },
    setSelectableBehavior:function(){
      var selectables=$(".line.selectable");
      selectables.each(function(){
        var selImg=$("<span/>").addClass("selImg");
        $(this).append(selImg);

        $(this).toggle(
          function(){$(this).addClass("selected")},
          function(){$(this).removeClass("selected")}
          ).addTouch();

      });
    },
    setLinkBehavior:function(){
      var links=$($.mbile.defaults.body + " #scroller").find("a[rel=page]");
      links.each(function(){
        var link=$(this);
        var linkImg=$("<span/>").addClass("linkImg");
        var url=$(this).attr("href").replace("#","");
        var animation=link.data("animation");
        $(this)
          .parent("span")
          .append(linkImg)
          .bind("click",function(){
          $(this).addClass("hover").goToPage(url,animation);
        }).addTouch();
      });
    },
    setSectionBehavior:function(){
      clearInterval(document.SectionBehavior);
      var $sections=$($.mbile.defaults.body + " #scroller").find("span.section");
      var containerTop= $($.mbile.defaults.body).offset().top;
      var $fakeSection=$("<span>").addClass("fake section").css({position:"absolute", top:0, zIndex:2, width:"100%"}).hide();
      $($.mbile.defaults.body).prepend($fakeSection);
      document.SectionBehavior=setInterval(function(){
        $sections.each(function(){
          var $section = $(this);
          var top = $section.offset().top;
          if (top < containerTop+10) {
            $fakeSection.fadeIn(800).text($section.text());
          }
        });
        if($sections.length>0 && $sections.eq(0).offset().top>containerTop){
          $fakeSection.hide();
        }
      },50)
    },
    setButtonBehavior:function(){
      var buttons=$("button,.button, .backBtn");
      buttons.setHover();
    },
    setPanelBehavior:function(){
      var $panels= $($.mbile.defaults.body + " #scroller").find("a[rel=panel]");
      $panels.each(function(){
        var panel=$(this).attr("href");
        var panelImg=$("<span/>").addClass("panelImg");
        $(this).parent("span").append(panelImg);
        $(this).toggle(
          function(){$(panel).openPanel(); $.mbile.refreshScroll();},
          function(){$(panel).closePanel(); $.mbile.refreshScroll();}
          ).addTouch();
      })
    },
    setSortableBehavior:function(){
      $(".sortable .line").each(function(){

        var handle=$("<span/>").addClass("handle").html("&nbsp;");
        $(this).append(handle);
        handle.addTouch();
        handle.bind("mousedown",function(){document.iScroll.enabled=false;});

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
          document.iScroll.enabled=true;
        }
      });
    },
    setHover:function(){
      this.bind("mousedown",function(){$(this).addClass("hover")})
        .bind("mouseup",function(){$(this).removeClass("hover")})
        .addTouch();
    },
    goToPage:function(url,animation,addHistory){
      if($.mbile.pageIsChanging) return;
      $.mbile.pageIsChanging=true;

      if(url==$.mbile.actualPage) return;
      /*
       * trigger event: beforepagechange
       *
       * you can refer to the actual page shown
       * there's not yet the new page on the DOM
       *
       * */
      var beforepagechange=$.Event("beforepagechange");
      beforepagechange.canChangePage=true;
      $(document).trigger(beforepagechange);


      if(!beforepagechange.canChangePage) {
        beforepagechange.canChangePage=true;
        return;
      }

      if (addHistory==undefined) addHistory=true;
      if (animation==undefined) animation="slideleft";

      $(this).addClass("selected");
      $(document).wait();
      var oldPage= $("#scroller").find("div[data-role=page]").addClass("oldPage "+ animation);
      var isOnPage=$("#"+url).isOnPage();

      if(isOnPage){
        if(document.myScroll)
          document.myScroll.destroy();
        var newPage= $("#"+url).clone(true).addClass("newPage "+ animation).hide();
        newPage.find("[data-role=header], [data-role=footer]").hide();
        $(".fake").remove();
        $($.mbile.defaults.body).append(newPage);

        setTimeout(function(){
          oldPage.addClass("out");
          newPage.addClass("in").show();
          newPage.bind('webkitAnimationEnd', function(){
            newPage.unbind('webkitAnimationEnd');
            newPage.removeClass("in "+ animation);

            if(addHistory)
              $.mbile.pages[url]={url:url, prev:$.mbile.actualPage, anim:animation, onPage:isOnPage};

            $.mbile.actualPage=url;

            /*
             * trigger event: pageshow
             *
             * triggered once the new page is inserted on the DOM and shown
             * you can refer either to the oldPage or to te newPage
             *
             * lement.bind("pageshow",function(e){
             *
             *   e.newPage.doSomething()
             *   e.oldPage.doSomething()
             *
             * });
             *
             * */

            var pageshow=$.Event("pageshow");
            pageshow.actualPage=newPage;
            pageshow.oldPage=oldPage;
            pageshow.animation=animation;
            $(document).trigger(pageshow);

            $("#scroller").remove();
            $.mbile.initContent($.mbile.defaults);
            $.mbile.pageIsChanging=false;

            $(document).stopWait();
          });
        },100);


      }else{
        $.ajax({
          type: "GET",
          url: url,
          success: function(response){
            if(document.myScroll)
              document.myScroll.destroy();
            $(document).stopWait();
            var newPage= $(response).addClass("newPage "+ animation).hide();
            newPage.find("[data-role=header], [data-role=footer]").hide();
            $(".fake").remove();
            $($.mbile.defaults.body).append(newPage);
            /*
             * trigger event: beforepageshow
             *
             * triggered once the new page is inserted on the DOM but not yet shown
             * you can refer either to the oldPage or to te newPage
             *
             * lement.bind("beforepageshow",function(e){
             *
             *   e.newPage.doSomething()
             *   e.oldPage.doSomething()
             *
             * });
             *
             * */
            var beforepageshow=$.Event("beforepageshow");
            beforepageshow.newPage=newPage;
            beforepageshow.oldPage=oldPage;
            $(document).trigger(beforepageshow);

            /*Applay transition*/
            setTimeout(function(){
              oldPage.addClass("out");
              newPage.addClass("in").show();
              newPage.bind('webkitAnimationEnd', function(){
                newPage.unbind('webkitAnimationEnd');

                $("#scroller").remove();
                newPage.removeClass("in "+ animation);

                if(addHistory)
                  $.mbile.pages[url]={url:url, prev:$.mbile.actualPage, anim:animation};
                $.mbile.actualPage=url;

                /*
                 * trigger event: pageshow
                 *
                 * triggered once the new page is inserted on the DOM and shown
                 * you can refer either to the oldPage or to te newPage
                 *
                 * lement.bind("pageshow",function(e){
                 *
                 *   e.newPage.doSomething()
                 *   e.oldPage.doSomething()
                 *
                 * });
                 *
                 * */

                var pageshow=$.Event("pageshow");
                pageshow.actualPage=newPage;
                pageshow.oldPage=oldPage;
                pageshow.animation=animation;
                $(document).trigger(pageshow);

                $.mbile.initContent($.mbile.defaults);
                $.mbile.pageIsChanging=false;
              });
            },100);
          }
        });
      }

    },
    getBackAnim:function(anim){
      var backAnim;
      switch(anim) {
        case "slideleft":
          backAnim="slideright";
          break;
        case "slideright":
          backAnim="slideleft";
          break;
        case "pop":
          backAnim="pop";
          break;
        case "slidedown":
          backAnim="slideup";
          break;
        case "slideup":
          backAnim="slidedown";
          break;
        case "flipleft":
          backAnim="flipright";
          break;
        case "flipright":
          backAnim="flipleft";
          break;
        case "swapright":
          backAnim="swapleft";
          break;
        case "swapleft":
          backAnim="swapright";
          break;
        case "cubeleft":
          backAnim="cuberight";
          break;
        case "cuberight":
          backAnim="cubeleft";
          break;
        case "fade":
          backAnim="fade";
          break;
        default:
          backAnim="slideright";
      }
      return backAnim;
    },
    wait:function(now,time){
      var loaderScreen= $("#loader").length==0? $("<div/>").attr("id","loader"):$("#loader");
      if($("#loader").length==0){
        var spinner=$("<div/>").attr("id","spinner");
        for (var i=1; i<=12;i++){
          var bar=$("<div/>").addClass("bar"+i);
          spinner.append(bar);
        }
        loaderScreen.append(spinner);
        $("body").append(loaderScreen);
      }
      //loaderScreen.show();
      var timer=now?10:1000;
      setTimeout(function(){
        loaderScreen.fadeTo(300,1);
        if(time!=undefined) setTimeout($.mbile.stopWait,time);
      },timer);

      return loaderScreen;
    },
    stopWait:function(callBack){
      if(callBack==undefined) callBack=function(){};
      var loaderScreen =$("#loader");
      loaderScreen.fadeOut(300,function(){
        callBack();
        loaderScreen.remove();
      });
      return loaderScreen;
    },
    onPageLoad:function(callback, e){
      $(document).one("pageshow",e, callback);
    },
    refreshScroll:function(){
      setTimeout(function () { if(document.myScroll) document.myScroll.refresh() }, 0)
    },
    changeTheme:function(themeURL){
      $("#mbileCSS").attr("href",themeURL);
    },
    alert:function(message){}
  };

  $.fn.wait=$.mbile.wait;
  $.fn.stopWait=$.mbile.stopWait;
  $.fn.goToPage=$.mbile.goToPage;
  $.fn.setHover=$.mbile.setHover;

  /*-------------------------------------------------------------------------------------------- Utilities*/

  $.fn.openPanel = function(){
    this.removeClass("close");
    this.addClass("open").one('webkitAnimationEnd', $.mbile.refreshScroll);
    this.prev("span").addClass("selected header");
    $.mbile.refreshScroll();
  };
  $.fn.closePanel = function(){
    this.removeClass("open");
    this.addClass("close").one('webkitAnimationEnd', function(){$(".panel.close").removeClass("close");$.mbile.refreshScroll();});
    this.prev("span").removeClass("selected header");
  };

  $.fn.swipe =function(opt){
    var defaults={
      time:600,
      diff:120,
      swipeLeft:function(){},
      swipeRight:function(){}
    };
    $.extend(defaults,opt);
    return this.each(function(){
      this.swipe={s:0,e:0};
      this.addEventListener('touchstart', function(event) {
        event.preventDefault();
        var touch = event.touches[0];
        this.swipe.s= touch.pageX;
      }, false);
      this.addEventListener('touchend', function(event) {
        event.preventDefault();
        var touch = event.changedTouches[0];
        this.swipe.e=touch.pageX;
        if(this.swipe.e > this.swipe.s+defaults.diff){
          event.stopPropagation();
          defaults.swipeRight(this);
        }else if(this.swipe.e< this.swipe.s-defaults.diff){
          event.stopPropagation();
          defaults.swipeLeft(this);
        }
      }, false);
    })
  };

  $.fn.isOnPage=function(){
    return this.length>0;
  };

  //manage fixed pos for header and footer
  $.fn.setFixed=function(pos){ //top, bottom
    var $el=this;
    var el=this.get(0);
    var elPos=0;
    var $elPlaceHolder=$el.clone().addClass("fixedPlaceHolder").hide();
    $el.before($elPlaceHolder);

    $(document).bind("touchstart",function(){$elPlaceHolder.hide();});
    $(document).bind("touchend",function(){
      var oldPos=window.scrollY,newPos;
      el.headerFooterListener= setInterval(function(){
        newPos=window.scrollY;
        if(oldPos==newPos){
          var elH = $el.outerHeight();
          elPos= pos=="top"? window.scrollY : window.scrollY+(window.innerHeight-elH);
          $elPlaceHolder.css({position:"absolute",top:elPos, zIndex:1000}).show();
          clearInterval(el.headerFooterListener);
        }
        oldPos=newPos;
      },10);
    });
  };

  $.setFixedRemove=function(){
    $(".fixedPlaceHolder").remove();
  };


  //on ajax error
  $(function(){
    $(document).bind("ajaxError", function(){
      $.mbile.pageIsChanging=false;
      $.mbile.goToPage($.mbile.defaults.errorPage,"pop");
    })
  });

  //  function alert(){
  //    $.mbile.alert()
  //  };

})(jQuery);
