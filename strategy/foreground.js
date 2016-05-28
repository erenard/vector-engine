/**
 * Foreground type pour le tout les niveaux du jeu
 */
var strategy = (function (strategy) {
	"use strict";
	strategy.Foreground = function(_stage) {
		engine.Layer.call(this, _stage, 1, 800, 450);
		this.render = function (_context, _model) {
			var mouseOver;
			if(_model.builder) {
				mouseOver = _model.builder.redraw(_context) || mouseOver;
			}
			for(var id in _model.planetoids) {
				mouseOver = _model.planetoids[id].redraw(_context) || mouseOver;
			}
			for(var id in _model.powerLinks) {
				_model.powerLinks[id].redraw(_context);
			}
			for(var id in _model.buildings) {
				mouseOver = _model.buildings[id].redraw(_context) || mouseOver;
			}
			if(_model.enemyBase) {
				_model.enemyBase.redraw(_context);
			}
			for(var id in _model.vehicules) {
				_model.vehicules[id].redraw(_context);
			}
			//Other objects
			//...
			return mouseOver;
		}
	}
	return strategy;
}(strategy || {}));
