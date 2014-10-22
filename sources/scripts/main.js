/*jshint undef:false */
// AbstractScreen.debug = true;
// ScreenManager.debug = true;


function testMobile() {
    return false;// Modernizr.touch || window.innerWidth < 600;
}

var SOCKET = null;
var windowWidth = 1280,
windowHeight = 720;

if(testMobile()){
	windowWidth = 640;
	windowHeight = 960;
}
var renderer;


var windowWidthVar = window.innerWidth,
windowHeightVar = window.innerHeight;
var renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);
document.body.appendChild(renderer.view);



var qrcode = new QRCode('qrcode', {
	    width: 768,
	    height: 768,
	    colorDark : '#D5272C',
	    colorLight : '#CBF2F1',
	    correctLevel : QRCode.CorrectLevel.H
	});

var firebaseId = parseInt(56659779 * Math.random());

var APP;

// qrcode.makeCode('http://192.168.4.65/socket-smart-control-app/#'+firebaseId);
var funfa = false;
if(funfa){
	firebaseId = 555;
	if(document.location.host === 'localhost' || document.location.host === '192.168.4.65'){
		console.log('local');
		qrcode.makeCode('http://192.168.4.65/socket-smart-control-app/');
		APP = new Application('https://jefframos.firebaseio.com/'+document.location.host.substring(0,3)+firebaseId);
	}else
	{
		qrcode.makeCode('http://jeff.manydevs.com/socket/socket-smart-control-app/');
		APP = new Application('https://jefframos.firebaseio.com/many'+firebaseId);

	}
}else{
	var firebaseId = parseInt(56659779 * Math.random());



	if(testMobile()){
		var fireBaseIdStrHASH = window.location.hash.substring(1);
		var linkCode = '';
		APP = new Application('https://jefframos.firebaseio.com/'+fireBaseIdStrHASH);
	}else{

		if(document.location.host === 'localhost' || document.location.host === '192.168.4.65'){
			linkCode = 'http://192.168.4.65/socket-smart-control-app/'+'#'+firebaseId;
		}
		else
		{
			linkCode = 'http://jeff.manydevs.com/socket/socket-smart-control-app/'+'#'+firebaseId;
		}
		console.log(linkCode);
		qrcode.makeCode(linkCode);

		APP = new Application('https://jefframos.firebaseio.com/'+firebaseId);
		// APP = new Application('https://jefframos.firebaseio.com/'+fireBaseIdStr);
	}



}
// console.log('http://192.168.4.65/socket-smart-control-app/#'+firebaseId);

// var fireBaseIdStr = window.location.hash.substring(1);
// console.log(fireBaseIdStr);



// if(!testMobile()){
// 	APP = new Application('https://jefframos.firebaseio.com/'+firebaseId);
// }else{
// 	APP = new Application('https://jefframos.firebaseio.com/'+firebaseId);
// 	// APP = new Application('https://jefframos.firebaseio.com/'+fireBaseIdStr);
// }



APP.build();
APP.show();

function update() {
	requestAnimFrame(update );
	var tempRation =  (window.innerHeight/windowHeight);
	var ratio = tempRation < (window.innerWidth/windowWidth)?tempRation:(window.innerWidth/windowWidth);
	windowWidthVar = windowWidth * ratio;
	windowHeightVar = windowHeight * ratio;
	renderer.view.style.width = windowWidthVar+'px';
	renderer.view.style.height = windowHeightVar+'px';
	APP.update();
	renderer.render(APP.stage);
}

var initialize = function(){
	// //inicia o game e da um build
	PIXI.BaseTexture.SCALE_MODE = 2;
	requestAnimFrame(update);
};

(function () {
	var App = {
		init: function () {
			// console.log($('qrcode').context.images[0].src);
			initialize();
		}
	};
	$(App.init);
})();





