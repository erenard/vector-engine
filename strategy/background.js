/**
 * Background type pour le tout les niveaux du jeu
 */
var strategy = (function (strategy) {
	"use strict";
	strategy.Background1 = function(_stage) {
		engine.Layer.call(this, _stage, 4, 800, 450);
		this.stars = new Array();
		this.starsCount = 100;
		for(var i = 0; i < this.starsCount; i++) {
			var x = Math.round(Math.random() * this.width);
			var y = Math.round(Math.random() * this.height);
			this.stars[i] = {x: x, y: y};
		}
		var context = engine.sprite.newContext(12, 12);
		context.beginPath();
		context.arc(6, 6, 6, -Math.PI, Math.PI);
		context.closePath();
		context.fillStyle = 'gray';
		context.fill();
		context.beginPath();
		context.arc(6, 6, 3, -Math.PI, Math.PI);
		context.closePath();
		context.fillStyle = 'white';
		context.fill();
		engine.sprite.add('star');
		
		this.render = function (_context) {
			for(var i = 0; i < this.starsCount; i++) {
				engine.sprite.draw(_context, 'star', this.stars[i].x, this.stars[i].y);
			}
		};
	}
	strategy.Background2 = function(_stage) {
		engine.Layer.call(this, _stage, 8, 800, 450);
		this.stars = new Array();
		this.starsCount = 100;
		for(var i = 0; i < this.starsCount; i++) {
			var x = Math.round(Math.random() * this.width);
			var y = Math.round(Math.random() * this.height);
			this.stars[i] = {x: x, y: y};
		}
		var context = engine.sprite.newContext(8, 8);
		context.beginPath();
		context.arc(2, 2, 4, -Math.PI, Math.PI);
		context.closePath();
		context.fillStyle = 'gray';
		context.fill();
		context.beginPath();
		context.arc(2, 2, 2, -Math.PI, Math.PI);
		context.closePath();
		context.fillStyle = 'white';
		context.fill();
		engine.sprite.add('star3');
		
		this.render = function (_context) {
			for(var i = 0; i < this.starsCount; i++) {
				engine.sprite.draw(_context, 'star3', this.stars[i].x, this.stars[i].y);
			}
			if(engine.mouse.y < 449)  return this;
		}
	}
	return strategy;
}(strategy || {}));
