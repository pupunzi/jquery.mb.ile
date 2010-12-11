/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2010. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*deletable lines Behavior*/

/*
 *
 * How to initialize it:
 *
 * on your index page:
 *
 * $(document).bind("pagebeforeshow",function(e){
 *   e.page.deletableLines({
 *     beforeDelete:function(o){ do something with o ...} if this function return false than the element will not be deleted.
 *     deleted:function(o){ do something with o ...}
 *    });
 * })
 *
 * or:
 *
 * $("[data-name=yourPage data-name]").one("pagebeforeshow",function(e){
 *   $(this).deletableLines({
 *     beforeDelete:function(o){ do something with o ...} if this function return false than the element will not be deleted.
 *     deleted:function(o){ do something with o ...}
 *    });
 * })
 *
 * this will be applied whenever a loaded page contains a [data-role=deletable] container
 *
 *
 * or:
 *  on applied just on the page you need the deletable behavior
 *
 * $("your deletable lines container").deletableLines({
 *     beforeDelete:function(o){ do something with o ...} if this function return false than the element will not be deleted.
 *     deleted:function(o){ do something with o ...}
 *    });
 *
 *
 * The callback functions (beforeDelete, deleted) pass the ID of the deleted element;
 *
 * An array of the deleted elements is stored as data "deleted" of the deletable container. You can get the value as below:
 *
 * var deleted= $("your sortable container ID").data("deleted")
 *
 * */

$(function(){

  $.mbile.deletableLines=function(options){
    var $page=this;
    var page=$page.get(0);
    page.deleted=[];

    var opt={
      beforeDelete:function(o){},
      deleted:function(o){}
    };
    $.extend(opt,options);

    var deletable= $page.find("[data-role=deletable]")
            .add($page.filter("[data-role=deletable]"));

    deletable.data("deleted",[]);

    if(deletable.attr("deletableInit")) return;


    deletable.children().each(function(){
      var line=$(this);
      line.addClass("deletable");

      line.swipe({
        swipeLeft: function(o) {
          deletable.find(".selected").removeClass("selected");
          $(".delete").hide();
          $(o).addClass("selected");
          $(o).find(".delete").fadeIn(500);
        },
        swipeRight: function(o) {
          $(o).removeClass("selected");
          $(o).find(".delete").fadeOut(500);
        }
      });

      var $del=$("<span>").addClass("delete").html("Delete").hide().css("z-index",100);
      $del.bind("click",function(){

        // callback before delete row that can return false to stop the action
        var canGoOn=opt.beforeDelete(line.attr("id"));
        if(canGoOn==undefined) canGoOn=true;
        if(canGoOn)
          line.fadeOut(300,function(){
            page.deleted.push(line.attr("id"));
            deletable.data("deleted",page.deleted);
            $(this).addClass("deleted");

            // callback once deleted from the dom delete
            opt.deleted(line.attr("id"));
            $.mbile.refreshScroll();
          });
        return false;
      });

      line.prepend($del);
    });
    deletable.attr("deletableInit",true);
  };

  $.fn.deletableLines_init=$.mbile.deletableLines;
});
