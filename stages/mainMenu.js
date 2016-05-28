
engine.stages.mainMenu = (function () {
	"use strict";
	var stage = new engine.Stage('mainMenu', engine.width, engine.height, new engine.Model());

    var storyButton = function (_event) {
		engine.event.catchEvent(_event);
        stage.elementById('main').style.display = 'none';
        stage.elementById('missions').style.display = '';
	}

    var mainMenuButton = function (_event) {
		engine.event.catchEvent(_event);
        stage.elementById('main').style.display = '';
        stage.elementById('missions').style.display = 'none';
	}

    var missionButton = function (_event) {
		engine.event.catchEvent(_event);
		var element = engine.event.element(_event);
		var missionName = stage.getIdOfElement(element);
		sessionStorage.setItem('missionName', missionName);
		engine.viewport.goToStage('missions');
	}

	var optionsButton = function (_event) {
		engine.viewport.showModal('options');
	}

	stage.addEventListeners = function () {
        stage.addClickListener('button_story', storyButton);
		stage.addClickListener('button_back', mainMenuButton);
		stage.addClickListener('button_options', optionsButton);
		
		for(var i = 1; i < 11; i++) {
			stage.addClickListener('mission' + i, missionButton);
		}
	}
	
	stage.removeEventListeners = function () {
        stage.removeClickListener('button_story', storyButton);
		stage.removeClickListener('button_back', mainMenuButton);
		stage.removeClickListener('button_options', optionsButton);

		for(var i = 1; i < 11; i++) {
			stage.removeClickListener('mission' + i, missionButton);
		}
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
