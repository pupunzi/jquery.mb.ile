/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.ile.selectableLines.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
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
 *  last modified: 04/01/13 17.13
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

  $.mbile.selectableLines=function(){
    if($.mbile){
      var selectables = $(this).find("[data-role=selectable]");

      selectables.each(function() {
        var $selectableBlock=$(this);
        var selected=[];
        $selectableBlock.data("selected","");
        if($selectableBlock.attr("selectableInit")) return;


        var selectableElements=$selectableBlock.children();
        selectableElements.each(function(){

          var el=this;
          var $el=$(el);

          $el.addClass("selectable");
          var selImg = $("<span/>").addClass("selImg");
          $el.append(selImg);
          
          $el.click(function(){

            if($el.hasClass("selected")){
              $el.removeClass("selected");
              var idx= $.inArray(el.id,selected);
              if(idx!=-1) selected.splice(idx,1);
            }else{
              $el.addClass("selected");
              selected.push(el.id);

            }
            $selectableBlock.data("selected",selected);
          }).addTouch();
        });
        
        $selectableBlock.attr("selectableInit",true);
      });
    }
  };

  $.fn.selectableLines_init=$.mbile.selectableLines;
});
