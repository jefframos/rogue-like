/*jshint undef:false */
var Minimap = Class.extend({
	init:function(img){
		if(!img){
			this.background = new PIXI.Graphics();
		}
		else if(typeof(img) === 'string')
		{
			this.texture = new PIXI.Texture.fromImage(img);
		}
		else{
			this.texture = img;
		}

		this.container = new PIXI.DisplayObjectContainer();
		this.container.addChild(this.background);
		this.arrayRooms = [];
		this.margin = {x: 20, y: 20};
		this.sizeTile = {x:50, y:50};
		this.sizeGraph = {x:30, y:30};
	},
	build:function(){
		console.log(APP.gen.rooms);

		var minX = 9999;
		var minY = 9999;
		var maxX = -9999;
		var maxY = -9999;
		var tempX = 0;
		var tempY = 0;

		for (var j = 0; j < APP.gen.rooms.length; j++)
		{
			var item = APP.gen.rooms[j];
			console.log(item);

			for (var i = 0; i < item.length; i++)
			{
				if (item[i].id > 0)
				{
					var tempRoomView = new PIXI.Graphics();
					if(item[i].mode === 1){
						tempRoomView.beginFill(0x52d468);
					}else if(item[i].mode === 2){
						tempRoomView.beginFill(0xaeaeae);
					}else if(item[i].mode === 3){
						tempRoomView.beginFill(0xf7cd39);
					}else if(item[i].mode === 4){
						tempRoomView.beginFill(0xf73939);
					}else if(item[i].mode === 5){
						tempRoomView.beginFill(0x212121);
					}else if(item[i].mode === 6){
						tempRoomView.beginFill(0xcb52c4);
					}else{
						tempRoomView.beginFill(0xffffff);
					}

					tempRoomView.lineStyle(1, 0x333333, 1);
					tempX = item[i].position[1] * this.sizeTile.x;
					tempY = item[i].position[0] * this.sizeTile.y;
					tempRoomView.position.x = tempX;
					tempRoomView.position.y = tempY;
					tempRoomView.drawRect(0,0,this.sizeGraph.x,this.sizeGraph.y);
					tempRoomView.endFill();
					this.container.addChild(tempRoomView);

					if (minX > item[i].position[1]){
						minX = item[i].position[1];
					}
					if (minY > item[i].position[0]){
						minY = item[i].position[0];
					}
						
					if (maxX < item[i].position[1]){
						maxX = item[i].position[1];
					}
					if (maxY < item[i].position[0]){
						maxY = item[i].position[0];
					}

					this.arrayRooms.push(tempRoomView);
				}
			}
		}
		for (var k = 0; k < this.arrayRooms.length; k++) {
			this.arrayRooms[k].position.x -= minX * this.sizeTile.x - this.margin.x - this.sizeGraph.x/2;
			this.arrayRooms[k].position.y -= minY * this.sizeTile.y - this.margin.y - this.sizeGraph.y/2;
		}
		console.log(minX,minY,maxX,maxY, maxX * this.margin.x, this.margin.x);
		this.background.beginFill(0x0);
		// this.background.lineStyle(1, 0xffd900, 1);
		this.background.drawRect(0,0,
			(maxX - minX + 1) * this.sizeTile.x + this.margin.x * 2 + this.sizeGraph.x/2,
			(maxY - minY + 1) * this.sizeTile.y+ this.margin.y * 2+ this.sizeGraph.y/2);
		this.background.endFill();
	},
	getContent:function(){
		return this.container;
	},
	setPosition:function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	}
});