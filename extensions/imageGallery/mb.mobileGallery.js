/*
 *
 * jQuery.mb.components: jquery.mbMobile extension -> mb.mobGallery.js
 * version: 1- 19-nov-2010 - 33
 * © 2001 - 2011 Matteo Bicocchi (pupunzi), Open Lab
 *
 * Licences: MIT, GPL
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * email: mbicocchi@open-lab.com
 * site: http://pupunzi.com
 *
 *
 */

(function($) {
  if ($.mbile)
  {
    $.mbile.mobGallery={
      defaults:{
        id:"gallery"
      },
      init:function(options){
        var opt={};
        $.extend(opt,$.mbile.mobGallery.defaults,options);
        $("#"+opt.id).hide();
        var images = $("#"+opt.id).children("div");
        var actualImage=1;
        var totalImages=images.length;
        var galleryWrapper=$("<div/>").addClass("galleryWrapper");


        function loadNext(url){
          var newImage=$("<img/>").attr("src",url);

          newImage.bind("load",function(){
            var imageWrapper=$("<div/>").addClass("imageWrapper");
            $("#"+id).append()
          })
        }
      }

    };
  }
})(jQuery);