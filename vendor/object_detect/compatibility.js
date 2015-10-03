/**
 * @namespace Allows access to webRTC and other features for browsers that are
 * not conforming to the latest standard (yet). Supported Browsers are:
 * Chrome, Opera and Firefox (soon).
 */

window.Bricks = window.Bricks || {};
//**PH - I'm not going to wrap this in a bigger IIFE because I want the local variables to be accessible from anywhere; 

Bricks.Compatibility = (function() {
	var lastTime = 0,

		URL = window.URL || window.webkitURL,

		requestAnimationFrame = function(callback, element) {
			var requestAnimationFrame =
				window.requestAnimationFrame		||
				window.webkitRequestAnimationFrame	||
				window.mozRequestAnimationFrame		||
				window.oRequestAnimationFrame		||
				function(callback, element) {
		            var currTime = new Date().getTime();
		            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		            var id = window.setTimeout(function() {
		            	callback(currTime + timeToCall);
		            }, timeToCall);
		            lastTime = currTime + timeToCall;
		            return id;
		        };

			return requestAnimationFrame.call(window, callback, element);
		},

		getUserMedia = function(options, success, error) {
			var getUserMedia =
				window.navigator.getUserMedia ||
				window.navigator.mozGetUserMedia ||
				window.navigator.webkitGetUserMedia ||
				function(options, success, error) {
					error();
				};

			return getUserMedia.call(window.navigator, options, success, error);
		};

	//PH** - calling compatibility variable invokes this page of code, returning the vars/funcs below as publically accessible entities. The rest is, of course, namespaced inside the immediate IIFE
	return {
		URL: URL,
		requestAnimationFrame: requestAnimationFrame,
		getUserMedia: getUserMedia
	};
})();
