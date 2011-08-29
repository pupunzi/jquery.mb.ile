/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2011. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/


/*sliding footer Behavior*/

/*
*
* How to initialize it:
* if you want to apply this behavior generally on your app where a fixed footer exists:
*
* on your index page:
* $(document).bind("pagebeforeshow",function(e){e.page.setCollapsibleFooter();})
*
* 
* if you want to apply the behavior only to a specific page:
* $("[data-name=your-page-name]").one("pagebeforeshow",function(e){e.page.setCollapsibleFooter();})
*
*
* this will be applied whenever a loaded page contains a fixed footer
* */

$(function(){

  $.mbile.collapsibleFooter=function(){
    if($.mbile){

      var footer = $(this).find("[data-role=footer][data-position=fixed]");
      if(footer.attr("collapsableFooterInit")) return;
      var collapsFooter = $("<span/>").addClass("collapsFooter").attr("collapsed", 0).html("&nbsp;");
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
      footer.attr("collapsableFooterInit",true);
    }
  };

  $.fn.collapsibleFooter_init=$.mbile.collapsibleFooter;

});
