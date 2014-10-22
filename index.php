<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Goya</title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<link rel="shortcut icon" href="favicon.ico">

		<link rel="stylesheet" href="_dist/css/main.css">
		<script src="https://cdn.firebase.com/js/client/1.0.21/firebase.js"></script>

		<style type="text/css">	
		body{
			margin: 0;
			padding: 0;
			background-color: #201E3B;
			font-family: sans-serif;
		}

		.game {
			background-color: #201E3B;
		}
		canvas {
			position:  absolute;
			width:  20px;
  			height: 20px;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}

	</style>
	</head>
	<body>
		<div id="qrcode" style="display:none"></div>

		<script src="_dist/js/lib/plugins.js"></script>
		<script src="_dist/js/main.js"></script>

		<!-- <img src="https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&amp;size=100x100" alt="" title="" /> -->

		<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
		<!-- <script>
			(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
			function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
			e=o.createElement(i);r=o.getElementsByTagName(i)[0];
			e.src='//www.google-analytics.com/analytics.js';
			r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
			ga('create','UA-XXXXX-X');ga('send','pageview');
		</script> -->
	</body>
</html>
