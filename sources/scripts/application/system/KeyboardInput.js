/*jshint undef:false */
var KeyboardInput = Class.extend({
	init: function (parent){
		var self = parent;
		document.body.addEventListener('mouseup', function(e){
			if(self.player){
				self.mouseDown = false;
			}
		});
		document.body.addEventListener('mousedown', function(e){
			if(self.player){
				self.mouseDown = true;
				// self.player.fireFreqAcum = 0;
			}
		});
		document.body.addEventListener('keyup', function(e){
			// console.log(e.keyCode);
			if(self.player){
				if(e.keyCode === 87 || e.keyCode === 38 && self.player.velocity.y < 0){
					self.removePosition('up');
				}
				else if(e.keyCode === 83 || e.keyCode === 40 && self.player.velocity.y > 0){
					self.removePosition('down');
				}
				else if(e.keyCode === 65 || e.keyCode === 37 && self.player.velocity.x < 0){
					self.removePosition('left');
				}
				else if(e.keyCode === 68 || e.keyCode === 39 && self.player.velocity.x > 0){
					self.removePosition('right');
				}
				else if(e.keyCode === 32){
					self.useShortcut(5);
				}
				else if(e.keyCode === 49 || e.keyCode === 50 || e.keyCode === 51  || e.keyCode === 52  || e.keyCode === 53){
					var id = 1;
					if(e.keyCode === 50){
						id = 2;
					}else if(e.keyCode === 51){
						id = 3;
					}else if(e.keyCode === 52){
						id = 4;
					}else if(e.keyCode === 53){
						id = 5;
					}


					self.useShortcut(id - 1);
				}
				self.updatePlayerVel();
			}
		});
		document.body.addEventListener('keydown', function(e){
			var vel = 6;
			//console.log('keydown');

			if(e.keyCode === 87 || e.keyCode === 38){
				self.removePosition('down');
				self.addPosition('up');
			}
			else if(e.keyCode === 83 || e.keyCode === 40){
				self.removePosition('up');
				self.addPosition('down');
			}
			else if(e.keyCode === 65 || e.keyCode === 37){
				self.removePosition('right');
				self.addPosition('left');
			}
			else if(e.keyCode === 68 || e.keyCode === 39){
				self.removePosition('left');
				self.addPosition('right');
			}
			self.updatePlayerVel();
		});
	},
});