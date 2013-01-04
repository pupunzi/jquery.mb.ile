/*
 * ******************************************************************************
 *  jquery.mb.components
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: http://pupunzi.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *  *****************************************************************************
 */

/*Set panel Behavior*/

/*
 *
 * How to initialize it:
 * if you want to apply this behavior generally on your app where a panel is declared:
 *
 * on your index page:
 * $(document).bind("pagebeforeshow",function(e){e.page.setPanelBehavior();})
 *
 *
 * if you want to apply the behavior only to a specific page:
 * $("[data-name=your-page-name]").one("pagebeforeshow",function(e){e.page.setPanelBehavior();})
 *
 *
 * this will be applied whenever a loaded page contains a [data-role=panel] container and take the first element as header of the panel.
 * */


$(function(){

  $.mbile.makePanel=function(){
    if($.mbile){
      var $panels = $(this).find("[data-role=panel]");
      if($(this).data("initPanel")) return;

      $panels.each(function() {
        var panelHeader = $(this).children().eq(0).addClass("header");
        var panel = $(this).children().eq(1).addClass("panelContent").hide();

        var panelImg = $("<span/>").addClass("panelImg");
        panelHeader.append(panelImg);
        panelHeader.toggle(
                function() {panel.openPanel();$.mbile.refreshScroll();},
                function() {panel.closePanel();$.mbile.refreshScroll();}
                ).addTouch();
      });
      $(this).data("initPanel",true);
    }

  };

  $.fn.openPanel = function() {
    this.prev().addClass("selected");
    this.show();
    $.mbile.refreshScroll();
  };
  $.fn.closePanel = function() {
    this.prev().removeClass("selected");
    this.hide();
    $.mbile.refreshScroll();
  };

  $.fn.makePanel_init=$.mbile.makePanel;

});



