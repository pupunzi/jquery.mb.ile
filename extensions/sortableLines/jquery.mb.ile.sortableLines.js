/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.ile.sortableLines.js
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
 *  last modified: 07/01/14 22.50
 *  *****************************************************************************
 */

/*sortable lines Behavior*/

/*
 *
 * How to initialize it:
 *
 * on your index page:
 *
 * $(document).bind("pagebeforeshow",function(e){
 *   e.page.setSortableLines({
 *     sortStart:function(o){ do something...}
 *     sortEnd:function(o){ do something...}
 *    });
 * })
 *
 * or:
 *
 * $("[data-name=yourPageDataName]").one("pagebeforeshow",,function(e){
 *   $(this).setSortableLines({
 *     sortStart:function(o){ do something...}
 *     sortEnd:function(o){ do something...}
 *    });
 * })
 *
 * this will be applied whenever a loaded page contains a [data-role=sortable] container
 *
 *
 * or:
 *  on the page you need sortable behavior
 *
 * $("your sortable container ID").setSortableLines({
 *     sortStart:function(o){ do something...}
 *     sortEnd:function(o){ do something...}
 *    });
 *
 *
 * The callback functions (sortStart, sortEnd) pass an array of the sorted elements IDs
 * this array is stored as data "sortOrder" of the sortable container. You can get the value as below:
 *
 * var sortOrder= $("your sortable container ID").data("sortOrder")
 * 
 * */


$(function(){
  if($.mbile){
    $.mbile.sortableLines=function(options) {

      var sortableEl=$(this).find("[data-role=sortable]")
              .add($(this).filter("[data-role=sortable]"));
      var opt={
        sortStart:function(o){},
        sortEnd:function(o){}
      };

      $.extend(opt,options);

      sortableEl.each(function(){
        var sortableBlock=$(this);
	      //sortableBlock.addTouch();
        sortableBlock.data("sortOrder","");

        if(sortableBlock.attr("sortableInit")) return;

        sortableBlock.children().each(function() {
          var handle = $("<span/>").addClass("handle").html("&nbsp;");
          $(this).append(handle);

        });

        sortableBlock.sortable({
          helper:"clone",
          axis: 'y',
          handle:".handle",
          start: function(event, ui) {
            $(ui.helper).addClass("sortableClone selected");
            $($.mbile.defaults.body).append(ui.helper);

	          if(document.mbileScroll)
		          document.mbileScroll.disable();
          },
          stop: function(event, ui) {

            if(document.mbileScroll)
	            document.mbileScroll.enable();

            sortableBlock.data("sortOrder",sortableBlock.sortable("toArray"));
            opt.sortEnd(sortableBlock.data("sortOrder"));
	          event.stopPropagation();

          }
        });
        sortableBlock.attr("sortableInit",true);
      });
    }
  }

  $.fn.sortableLines_init=$.mbile.sortableLines;

});
