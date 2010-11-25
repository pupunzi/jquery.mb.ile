/*
 *
 * jQuery.mb.components: jquery.mbMobile extension -> mb.geolocation.js
 * version: 1- 19-nov-2010 - 33
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
 * from jQtouch (with small modifications): http://www.jqtouch.com/
 * Built by David Kaneda and maintained by Jonathan Stark.
 *
 */

(function($) {
    if ($.mbile)
    {
        $.mbile.getGeoLocation=function(callBack){
            if(!navigator.geolocation) return;
            var latitude, longitude;

            function savePosition(position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                if (callBack) {
                    callBack(getLocation());
                }
            }
            function getLocation() {
                if (latitude && longitude) {
                    return {
                        latitude: latitude,
                        longitude: longitude
                    }
                } else {
                    alert('No location available.');
                    return false;
                }
            }
            navigator.geolocation.getCurrentPosition(savePosition);
            return {latitude:latitude,longitude:longitude}
        };
    }
})(jQuery);