/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.ile.collapsibleFooter.js
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
 *  last modified: 02/10/13 22.42
 *  *****************************************************************************
 */


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

	$.mbile.collapsibleFooter=function(dblTap){

		if($.mbile){

			$.fn.showHideFooter = function(footer) {
				var el = this;
				if (el.attr("collapsed") == 0) {
					footer.addClass("out");
					el.attr("collapsed", 1)
				} else {
					footer.removeClass("out");
					el.attr("collapsed", 0)
				}
			};


			var page = $(this);
			var footer = page.find("[data-role=footer][data-position=fixed]");

			if(page.attr("collapsableFooterInit") || footer.length==0)
				return;

			if(dblTap == "false"){
				var collapsFooter = $("<span/>").addClass("collapsFooter").attr("collapsed", 0).html("&nbsp;");
				footer.append(collapsFooter);
				collapsFooter.on($.mbile.events.end, function() {
					$(this).showHideFooter(footer);
					footer.addClass("collapsibleFooter");
				});
			}else{
				page.attr("collapsed", 0);
				page.dblTap(function() {
					page.showHideFooter(footer);
				})

			}

			page.attr("collapsableFooterInit",true);
		}
	};

	$.fn.collapsibleFooter_init=$.mbile.collapsibleFooter;

});
