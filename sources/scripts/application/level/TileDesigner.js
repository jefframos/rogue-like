/*jshint undef:false */
var TileDesigner = Class.extend({
	init: function (){
		this.parent = parent;
	},
	roundTilesBaseIslandColors: function(data){
		for (var i = data.length - 1; i >= 0; i--) {
			for (var j = data[i].length - 1; j >= 0; j--) {
				if(data[i][j].biome !== undefined){
					if(data[i][j].tile === 'TOP_LEFT'){
						data[i][j].biome = 'ROAD1';
					}else if(data[i][j].tile === 'TOP_RIGHT'){
						data[i][j].biome = 'ROAD3';
					}else{
						data[i][j].biome = 'ROAD2';
					}
				}
			}
		}

		this.improveColors(data,'ROAD2');
		this.improveColors(data,'ROAD1');
		this.improveColors(data,'ROAD3');
		
	},
	improveColors: function(data,type){
		for (var ii = data.length - 1; ii >= 0; ii--) {
			for (var jj = data[ii].length - 1; jj >= 0; jj--) {
				if(data[ii][jj] !== undefined){
					if(data[ii][jj].biome !== undefined && data[ii][jj].biome === type){
						for (var kk = jj; kk >= jj - 4; kk--) {
							if(data[ii][kk].biome !== undefined){
								data[ii][kk].biome = type;
							}
						}
					}
				}
			}
		}
	},
	roundTilesBaseIsland: function(data, type){
		var tempType = type;
		var ix = 0;
		var jy = 0;
		var tempTL = null;
		var tempT = null;
		var tempTR = null;
		var tempL = null;
		var tempR = null;
		var tempBL = null;
		var tempB = null;
		var tempBR = null;
		var current = null;

		var ocean = function(data){
			if(data === null){
				return false;
			}
			var ret = false;
			for (var i = type.length - 1; i >= 0; i--) {
				ret = data.biome !== type[i];
				if(!ret){
					return ret;
				}
			}
			return ret;
		};
		var verifyCross = function(data){
			if(data === null){
				return false;
			}
			return (ocean(tempB) && !ocean(tempT) && ocean(tempL) && ocean(tempR))||
				(ocean(tempT) && !ocean(tempB) && ocean(tempL) && ocean(tempR))||
				(!ocean(tempR) && ocean(tempL) && ocean(tempT) && ocean(tempB))||
				(!ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB))||
				(ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB));
		};

		
		for (var i = data.length - 2; i >= 1; i--) {
			for (var j = data[i].length - 2; j >= 1; j--) {
				//if(data[i][j].biome === type){
				current = data[i][j];
				//topLeft
				if(data[i-1][j-1] !== undefined){
					tempTL = data[i-1][j-1];
				}
				//top
				if(data[i][j-1] !== undefined){
					tempT = data[i][j-1];
				}
				//topRight
				if(data[i+1][j-1] !== undefined){
					tempTR = data[i+1][j-1];
				}
				//Left
				if(data[i-1][j] !== undefined){
					tempL = data[i-1][j];
				}
				//Right
				if(data[i+1][j] !== undefined){
					tempR = data[i+1][j];
				}
				//bottomLeft
				if(data[i-1][j+1] !== undefined){
					tempBL = data[i-1][j+1];
				}
				//bottom
				if(data[i][j+1] !== undefined){
					tempB = data[i][j+1];
				}
				//bottomRight
				if(data[i+1][j+1] !== undefined){
					tempBR = data[i+1][j+1];
				}
				//}
				if(ocean(tempB) && ocean(tempL) && !ocean(tempR))
				{
					current.tile = 'TOP_RIGHT';
				}
				// if(ocean(tempT) && ocean(tempL) && !ocean(tempR))
				// {
				// 	current.tile = 'BOTTOM_RIGHT';
				// }
				if(ocean(tempB) && ocean(tempR) && !ocean(tempL))
				{
					current.tile = 'TOP_LEFT';
				}

				if(current !== null && ocean(tempB) && ocean(tempR) && ocean(tempL))
				{
					current.tile = 'BASE1';
				}
				// if(ocean(tempT) && ocean(tempR) && !ocean(tempL))
				// {
				// 	current.tile = 'BOTTOM_LEFT';
				// }

				// if(verifyCross(current)){
				// 	current.biome = 'OCEAN';
				// }
			}
		}
		

	},
	roundTilesBorder2: function(data, type, targetBiome){
		var tempType = type;
		var ix = 0;
		var jy = 0;
		var tempTL = null;
		var tempT = null;
		var tempTR = null;
		var tempL = null;
		var tempR = null;
		var tempBL = null;
		var tempB = null;
		var tempBR = null;
		var current = null;
		var rnd = Math.random();
		var ocean = function(data){
			if(data === null){
				return false;
			}
			var ret = false;
			for (var i = type.length - 1; i >= 0; i--) {
				ret = data.biome === type[i];
				if(ret){
					return ret;
				}
			}
			return ret;
		};
		
		for (var i = data.length - 2; i >= 1; i--) {
			for (var j = data[i].length - 2; j >= 1; j--) {
				current = data[i][j];
				//topLeft
				if(data[i-1][j-1] !== undefined){
					tempTL = data[i-1][j-1];
				}
				//top
				if(data[i][j-1] !== undefined){
					tempT = data[i][j-1];
				}
				//topRight
				if(data[i+1][j-1] !== undefined){
					tempTR = data[i+1][j-1];
				}
				//Left
				if(data[i-1][j] !== undefined){
					tempL = data[i-1][j];
				}
				//Right
				if(data[i+1][j] !== undefined){
					tempR = data[i+1][j];
				}
				//bottomLeft
				if(data[i-1][j+1] !== undefined){
					tempBL = data[i-1][j+1];
				}
				//bottom
				if(data[i][j+1] !== undefined){
					tempB = data[i][j+1];
				}
				//bottomRight
				if(data[i+1][j+1] !== undefined){
					tempBR = data[i+1][j+1];
				}
				// if(current){
				// 	console.log(rnd, current.biome);
				// }
				if(ocean(current))
				{
					// if(Math.random() > 0.2){
					data[i][j+1] = {tile :'CENTER', biome : targetBiome};
					// }
					console.log('create', targetBiome);
				}
				
			}
		}
		

	},
	roundTilesBorder: function(data, dataCompare, type){
		var tempType = type;
		var ix = 0;
		var jy = 0;
		var tempTL = null;
		var tempT = null;
		var tempTR = null;
		var tempL = null;
		var tempR = null;
		var tempBL = null;
		var tempB = null;
		var tempBR = null;
		var current = null;

		var ocean = function(data){
			// console.log(tempType);
			if(data === null){
				return false;
			}
			return data.biome === type;
		};
		var verifyCross = function(data){
			if(data === null){
				return false;
			}
			return (ocean(tempB) && !ocean(tempT) && ocean(tempL) && ocean(tempR))||
				(ocean(tempT) && !ocean(tempB) && ocean(tempL) && ocean(tempR))||
				(!ocean(tempR) && ocean(tempL) && ocean(tempT) && ocean(tempB))||
				(!ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB))||
				(ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB));
		};

		
		for (var i = dataCompare.length - 2; i >= 1; i--) {
			for (var j = dataCompare[i].length - 2; j >= 1; j--) {
				if(dataCompare[i][j].biome === type){
					current = data[i][j];
					//topLeft
					if(dataCompare[i-1][j-1] !== undefined){
						tempTL = dataCompare[i-1][j-1];
					}
					//top
					if(dataCompare[i][j-1] !== undefined){
						tempT = dataCompare[i][j-1];
					}
					//topRight
					if(dataCompare[i+1][j-1] !== undefined){
						tempTR = dataCompare[i+1][j-1];
					}
					//Left
					if(dataCompare[i-1][j] !== undefined){
						tempL = dataCompare[i-1][j];
					}
					//Right
					if(dataCompare[i+1][j] !== undefined){
						tempR = dataCompare[i+1][j];
					}
					//bottomLeft
					if(dataCompare[i-1][j+1] !== undefined){
						tempBL = dataCompare[i-1][j+1];
					}
					//bottom
					if(dataCompare[i][j+1] !== undefined){
						tempB = dataCompare[i][j+1];
					}
					//bottomRight
					if(dataCompare[i+1][j+1] !== undefined){
						tempBR = dataCompare[i+1][j+1];
					}
				}
				if(dataCompare[i][j].tile === 'TOP_LEFT' || dataCompare[i][j].tile === 'TOP_RIGHT'){
					data[i][j].tile = 'CENTER';
					data[i][j].biome = 'ROAD3';
				}
				else if(!ocean(tempT) && (ocean(tempB) ||ocean(current)))
				{
					if(tempT.tile === 'CENTER'){
						current.tile = 'CENTER';
					}else if(tempT.tile === 'TOP_RIGHT'){
						current.tile = 'TOP_RIGHT';
					}
					else if(tempT.tile === 'TOP_LEFT'){
						current.tile = 'TOP_LEFT';
					}

					current.biome = 'ROAD3';
				}

				
			}
		}
		

	},
	roundTiles: function(data, type){
		var tempType = type;
		var ix = 0;
		var jy = 0;
		var tempTL = null;
		var tempT = null;
		var tempTR = null;
		var tempL = null;
		var tempR = null;
		var tempBL = null;
		var tempB = null;
		var tempBR = null;
		var current = null;

		var ocean = function(data){
			// console.log(tempType);
			if(data === null){
				return false;
			}
			return data.biome !== tempType;
		};
		var verifyCross = function(data){
			if(data === null){
				return false;
			}
			return (ocean(tempB) && !ocean(tempT) && ocean(tempL) && ocean(tempR))||
				(ocean(tempT) && !ocean(tempB) && ocean(tempL) && ocean(tempR))||
				(!ocean(tempR) && ocean(tempL) && ocean(tempT) && ocean(tempB))||
				(!ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB))||
				(ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB));
		};

		
		for (var i = data.length - 1; i >= 0; i--) {
			for (var j = data[i].length - 1; j >= 0; j--) {
				if(data[i][j].biome === type){
					current = data[i][j];
					//topLeft
					if(data[i-1][j-1] !== undefined){
						tempTL = data[i-1][j-1];
					}
					//top
					if(data[i][j-1] !== undefined){
						tempT = data[i][j-1];
					}
					//topRight
					if(data[i+1][j-1] !== undefined){
						tempTR = data[i+1][j-1];
					}
					//Left
					if(data[i-1][j] !== undefined){
						tempL = data[i-1][j];
					}
					//Right
					if(data[i+1][j] !== undefined){
						tempR = data[i+1][j];
					}
					//bottomLeft
					if(data[i-1][j+1] !== undefined){
						tempBL = data[i-1][j+1];
					}
					//bottom
					if(data[i][j+1] !== undefined){
						tempB = data[i][j+1];
					}
					//bottomRight
					if(data[i+1][j+1] !== undefined){
						tempBR = data[i+1][j+1];
					}
				}
				if(ocean(tempB) && ocean(tempL) && !ocean(tempR))
				{
					current.tile = 'TOP_RIGHT';
				}
				if(ocean(tempT) && ocean(tempL) && !ocean(tempR))
				{
					current.tile = 'BOTTOM_RIGHT';
				}
				if(ocean(tempB) && ocean(tempR) && !ocean(tempL))
				{
					current.tile = 'TOP_LEFT';
				}
				if(ocean(tempT) && ocean(tempR) && !ocean(tempL))
				{
					current.tile = 'BOTTOM_LEFT';
				}

				if(verifyCross(current)){
					current.biome = 'OCEAN';
				}
			}
		}
		

	},
	roundTilesCost: function(data, type){

		var ix = 0;
		var jy = 0;
		var tempTL = null;
		var tempT = null;
		var tempTR = null;
		var tempL = null;
		var tempR = null;
		var tempBL = null;
		var tempB = null;
		var tempBR = null;
		var current = null;

		var ocean = function(data){
			if(data === null){
				return false;
			}
			return data.biome === 'OCEAN';
		};
		var verifyCross = function(data){
			if(data === null){
				return false;
			}
			return (ocean(tempB) && !ocean(tempT) && ocean(tempL) && ocean(tempR))||
				(ocean(tempT) && !ocean(tempB) && ocean(tempL) && ocean(tempR))||
				(!ocean(tempR) && ocean(tempL) && ocean(tempT) && ocean(tempB))||
				(!ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB))||
				(ocean(tempL) && ocean(tempR) && ocean(tempT) && ocean(tempB));
		};

		
		for (var i = data.length - 1; i >= 0; i--) {
			for (var j = data[i].length - 1; j >= 0; j--) {
				if(data[i][j].biome === type){
					current = data[i][j];
					//topLeft
					if(data[i-1][j-1] !== undefined){
						tempTL = data[i-1][j-1];
					}
					//top
					if(data[i][j-1] !== undefined){
						tempT = data[i][j-1];
					}
					//topRight
					if(data[i+1][j-1] !== undefined){
						tempTR = data[i+1][j-1];
					}
					//Left
					if(data[i-1][j] !== undefined){
						tempL = data[i-1][j];
					}
					//Right
					if(data[i+1][j] !== undefined){
						tempR = data[i+1][j];
					}
					//bottomLeft
					if(data[i-1][j+1] !== undefined){
						tempBL = data[i-1][j+1];
					}
					//bottom
					if(data[i][j+1] !== undefined){
						tempB = data[i][j+1];
					}
					//bottomRight
					if(data[i+1][j+1] !== undefined){
						tempBR = data[i+1][j+1];
					}
				}
				if(ocean(tempB) && ocean(tempL) && !ocean(tempR))
				{
					current.tile = 'TOP_RIGHT';
				}
				if(ocean(tempT) && ocean(tempL) && !ocean(tempR))
				{
					current.tile = 'BOTTOM_RIGHT';
				}
				if(ocean(tempB) && ocean(tempR) && !ocean(tempL))
				{
					current.tile = 'TOP_LEFT';
				}
				if(ocean(tempT) && ocean(tempR) && !ocean(tempL))
				{
					current.tile = 'BOTTOM_LEFT';
				}

				if(verifyCross(current)){
					current.biome = 'OCEAN';
				}
			}
		}
		

	},
});