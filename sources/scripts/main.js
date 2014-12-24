/*jshint undef:false */
var meter = new FPSMeter();
// $.ajaxSetup({ cache: false });
function testMobile() {
	return false;// Modernizr.touch || window.innerWidth < 600;
}

var SOCKET = null;
// var windowWidth = 600,
var windowWidth = 820,
// var windowWidth = 810,
// windowHeight = 456;
windowHeight = 600;

var realWindowWidth = 820,
// var windowWidth = 810,
// windowHeight = 456;
realWindowHeight = 600;

if(testMobile()){
	windowWidth = 640;
	windowHeight = 960;
}
var renderer;


var windowWidthVar = window.innerWidth,
windowHeightVar = window.innerHeight;
var renderer = PIXI.autoDetectRenderer(realWindowWidth, realWindowHeight, null, false, true);

// renderer.view.style.width = windowWidthVar+'px';
// renderer.view.style.height = windowHeightVar+'px';

document.body.appendChild(renderer.view);

var APP;
APP = new Application();
APP.build();
APP.show();

function update() {
	requestAnimFrame(update );
	meter.tickStart();
	var tempRation =  (window.innerHeight/windowHeight);
	var ratio = tempRation < (window.innerWidth/realWindowWidth)?tempRation:(window.innerWidth/realWindowWidth);
	windowWidthVar = realWindowWidth * ratio;
	windowHeightVar = realWindowHeight * ratio;
	//proportional
	if(windowWidthVar > realWindowWidth)
	{
		windowWidthVar = realWindowWidth;
	}
	if(windowHeightVar > realWindowHeight)
	{
		windowHeightVar = realWindowHeight;
	}
	renderer.view.style.width = windowWidthVar+'px';
	renderer.view.style.height = windowHeightVar+'px';

	// renderer.view.style.width = windowWidth+'px';
	// renderer.view.style.height = windowHeight+'px';


	// renderer.view.style.width = (windowWidth/1.5)+'px';
	// renderer.view.style.height = (windowHeight/1.5)+'px';
	APP.update();
	renderer.render(APP.stage);
	meter.tick();
}

var initialize = function(){
	// //inicia o game e da um build
	PIXI.BaseTexture.SCALE_MODE = 2;
	requestAnimFrame(update);
};

(function () {
	var App = {
		init: function () {
			initialize();
		}
	};
	App.init();
})();
function pointDistance(x, y, x0, y0){
	return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function degreesToRadians(deg) {
	return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
	return rad / (Math.PI / 180);
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
	r /= 255;
	g /= 255;
	b /= 255;
	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if(max === min){
		h = s = 0; // achromatic
	}else{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return {h:h, s:s, l:l};
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){

	function hue2rgb(p, q, t){
		if(t < 0){
			t += 1;
		}
		if(t > 1){
			t -= 1;
		}
		if(t < 1/6){
			return p + (q - p) * 6 * t;
		}
		if(t < 1/2){
			return q;
		}
		if(t < 2/3){
			return p + (q - p) * (2/3 - t) * 6;
		}
		return p;
	}

	var r, g, b;

	if(s === 0){
		r = g = b = l; // achromatic
	}else{
		

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}

	return {r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255)};
}
function toHex(n) {
	n = parseInt(n,10);
	if (isNaN(n)){
		return '00';
	}
	n = Math.max(0,Math.min(n,255));
	return '0123456789ABCDEF'.charAt((n-n%16)/16) + '0123456789ABCDEF'.charAt(n%16);
}
function rgbToHex(R,G,B) {
	return parseInt('0x' + toHex(R)+toHex(G)+toHex(B));
}


function hexToRgb(hex){
    var r = hex >> 16;
    var g = hex >> 8 & 0xFF;
    var b = hex & 0xFF;
    return {r:r,g:g,b:b};
}

// function hexToRgb(hex) {
//     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16)
//     } : null;
// }
function addSaturation(color, value){
	var rgb = hexToRgb(color);
	var hsl = rgbToHsl(rgb.r,rgb.g,rgb.b);
	hsl.s *= value;
	if(hsl.s > 1){
		hsl.s = 1;
	}
	if(hsl.s < 0){
		hsl.s = 0;
	}
	rgb = hslToRgb(hsl.h,hsl.s,hsl.l);
	return rgbToHex(rgb.r,rgb.g,rgb.b);
}

console.log(addSaturation(0x740B33, 0.5));
// console.log('hexToRgb',hexToRgb(0x740B33));
// console.log('rgbToHex',rgbToHex(116,11,51));
// console.log('rgbToHsl',rgbToHsl(116,11,51).h * 360,rgbToHsl(116,11,51).s * 100,rgbToHsl(116,11,51).l * 360);

// console.log('hslToRgb',hslToRgb(rgbToHsl(116,11,51).h,rgbToHsl(116,11,51).s,rgbToHsl(116,11,51).l));