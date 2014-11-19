/*jshint undef:false */
var meter = new FPSMeter();
$.ajaxSetup({ cache: false });
function testMobile() {
    return false;// Modernizr.touch || window.innerWidth < 600;
}

var SOCKET = null;
var windowWidth = 810,
windowHeight = 456;

if(testMobile()){
	windowWidth = 640;
	windowHeight = 960;
}
var renderer;


var windowWidthVar = window.innerWidth,
windowHeightVar = window.innerHeight;
var renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);

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
	var ratio = tempRation < (window.innerWidth/windowWidth)?tempRation:(window.innerWidth/windowWidth);
	windowWidthVar = windowWidth * ratio;
	windowHeightVar = windowHeight * ratio;
	//proportional
	// renderer.view.style.width = windowWidthVar+'px';
	// renderer.view.style.height = windowHeightVar+'px';

	renderer.view.style.width = windowWidth+'px';
	renderer.view.style.height = windowHeight+'px';


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
	$(App.init);
})();
function pointDistance(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}




