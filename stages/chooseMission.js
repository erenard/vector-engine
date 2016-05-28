
engine.stages.chooseMission = (function () {
	"use strict";
	var stage = new engine.Stage('chooseMission', engine.width, engine.height, new engine.Model());
	
	var missionButton = function (_event) {
		engine.event.catchEvent(_event);
		engine.viewport.goToStage('testCamera');
	}

	stage.addEventListeners = function () {
        stage.addClickListener('button_story', storyButton);
	}
	
	stage.removeEventListeners = function () {
        stage.removeClickListener('button_story', storyButton);
	}
	
	var background = new engine.Layer(stage, 0);

	var stars = new Array();
	
	for(var i = 0; i < 400; i++) {
		stars[i] = {x: 0, y: 0};
		stars[i].x = Math.random() * engine.width;
		stars[i].y = Math.random() * engine.height;
	}
	
	background.render = function (_context) {
		_context.strokeStyle = 'white';
		_context.fillStyle = 'white';
		for(var i = 0; i < 400; i++) {
			var x = stars[i].x;
			var y = stars[i].y;
			_context.beginPath();
			_context.moveTo(x - 0.5, y - 0.5);
			_context.lineTo(x + 0.5, y - 0.5);
			_context.lineTo(x + 0.5, y + 0.5);
			_context.lineTo(x - 0.5, y + 0.5);
			_context.closePath();
			_context.stroke();
		}
	};
	return stage;
}())
