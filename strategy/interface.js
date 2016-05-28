/**
 * Interface type pour le tout les niveaux du jeu
 */
var strategy = (function (strategy) {
	"use strict";
	strategy.Interface = function(_stage) {
		engine.Layer.call(this, _stage, 0);
		
		function goToMenu(_menuId) {
			_stage.elementById('menu').style.display = 'none';
			_stage.elementById('buildMenu').style.display = 'none';
			_stage.elementById(_menuId).style.display = '';
		}

		this.onBuild = function(_event) {
			engine.event.catchEvent(_event);
			goToMenu('buildMenu');
		}

		this.onDestroy = function(_event) {
			engine.event.catchEvent(_event);
			goToMenu('buildMenu');
		}
		
		this.onPause = function(_event) {
			engine.event.catchEvent(_event);
			var paused = _stage.onPause();
			var button = _stage.elementById('pause');
			if(paused) {
				button.className = 'paused';
			} else {
				button.className = 'pause';
			}
		}

		this.onSpeed = function(_event) {
			engine.event.catchEvent(_event);
			var speed = _stage.onSpeed();
			var button = _stage.elementById('speed');
			if(speed == 1) {
				button.className = 'fastforward';
			} else {
				button.className = 'fastforwarded';
			}
		}

		this.renderMinimap = function (_context, _renderables) {
			for(var i in _renderables) {
				var renderable = _renderables[i];
				if(renderable.minimapStyle) {
					widget.minimap.style(renderable.minimapStyle);
					widget.minimap.draw(renderable);
				}
			}
		}

		this.render = function (_context, _model) {
			//Minimap
			widget.minimap.enter(_context);
			this.renderMinimap(_context, _model.planetoids);
			this.renderMinimap(_context, _model.buildings);
			this.renderMinimap(_context, _model.enemies);
			widget.minimap.leave();
			//Interface
			//Status of selection board
			if(_model.selectedObject) {
				widget.generalInformation.hide();
				widget.selectedInformation.show();
				widget.selectedInformation.render();
			} else {
				widget.selectedInformation.hide();
				widget.generalInformation.show();
				widget.generalInformation.render();
			}
		};
	}
	return strategy;
}(strategy || {}));
