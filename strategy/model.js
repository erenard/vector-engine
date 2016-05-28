/**
 * Model type pour le tout les niveaux du jeu
 */
var strategy = (function (strategy) {
	"use strict";
	
	strategy.Model = function() {
		engine.Model.call(this);

		this.tick = function (_delta) {}
		
		this.reset = function () {
			engine.camera.setZoomBounds(0.5, 1.5);
		}

		this.load = function () {}

		this.save = function () {}
	}

	return strategy;
}(strategy || {}));
