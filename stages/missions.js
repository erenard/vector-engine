engine.stages.missions = (function () {
	"use strict";
	
	var model = new strategy.Model();
	var stage = new engine.Stage('missions', 4000, 4000, model);
	var gui = new strategy.Interface(stage);
	new strategy.Foreground(stage);
	new strategy.Background1(stage);
	new strategy.Background2(stage);

	stage.addEventListeners = function () {
		//Minimap
		stage.addClickListener('zoomIn', engine.camera.zoomIn);
		stage.addClickListener('zoomOut', engine.camera.zoomOut);
		stage.addClickListener('pause', gui.onPause);
		stage.addClickListener('speed', gui.onSpeed);
		//Main menu
		stage.addClickListener('build', gui.onBuild);
		stage.addClickListener('destroy', gui.onDestroy);
		stage.addClickListener('pop5reds', gui.onPopFiveReds);
		//Build Menu
		stage.addClickListener('cancel', gui.onCancel);
		/* Extractors */
		stage.addClickListener('solar', gui.onBuildSolarPower);
		stage.addClickListener('cristal', gui.onBuildCristalExtractor);
		stage.addClickListener('deuterium', gui.onBuildDeuteriumExtractor);
		stage.addClickListener('metal', gui.onBuildMetalExtractor);
		stage.addClickListener('uranium', gui.onBuildUraniumExtractor);
		/* Router */
		stage.addClickListener('router', gui.onBuildRouter);
		stage.addClickListener('canon', gui.onBuildCanon);
		stage.addClickListener('laser', gui.onBuildLaser);
		//Minimap
		widget.minimap.addEventListeners();
	}

	stage.removeEventListeners = function () {
		//Minimap
		stage.removeClickListener('zoomIn', engine.camera.zoomIn);
		stage.removeClickListener('zoomOut', engine.camera.zoomOut);
		stage.removeClickListener('pause', gui.onPause);
		stage.removeClickListener('speed', gui.onSpeed);
		//Main menu
		stage.removeClickListener('build', gui.onBuild);
		stage.removeClickListener('destroy', gui.onDestroy);
		stage.removeClickListener('pop5reds', gui.onPopFiveReds);
		//Build menu
		stage.removeClickListener('cancel', gui.onCancel);
		/* Extractors */
		stage.removeClickListener('power', gui.onBuildSolarPower);
		stage.removeClickListener('mineral', gui.onBuildMineralExtractor);
		stage.removeClickListener('gas', gui.onBuildGasExtractor);
		stage.removeClickListener('metal', gui.onBuildMetalExtractor);
		/* Router */
		stage.removeClickListener('router', gui.onBuildRouter);
		stage.removeClickListener('canon', gui.onBuildCanon);
		stage.removeClickListener('laser', gui.onBuildLaser);
		//Minimap
		widget.minimap.removeEventListeners();
	}

	stage.onCreate = function () {
		widget.minimap.setElement(stage.elementById('minimap'));
		widget.generalInformation.create(model, stage);
		widget.selectedInformation.create(model, stage);

		var missionName = sessionStorage.getItem('missionName');
		if(missionName) {
			var template = engine.stages.missions.templates[missionName];
			if(template.hq) {
				var hq = new entity.Storage(template.hq.x, template.hq.y);
				hq.onCreate(model);
			}
			if(template.enemyBase) {
				model.enemyBase = new entity.EnemyBase(template.enemyBase.x, template.enemyBase.y);
			}
			var planetoids = template.planetoids;
			if(planetoids) {
				if(planetoids.star) {
					var star = new entity.planetoid.Star(planetoids.star.x, planetoids.star.y);
					star.onCreate(model);
				}
				if(planetoids.planets) {
					for(var i in planetoids.planets) {
						var planet = new entity.planetoid.Planet(planetoids.planets[i].x, planetoids.planets[i].y, planetoids.planets[i].type);
						planet.onCreate(model);
					}
				}
			}
		} else {
			var hq = new entity.Storage(250, 250);
			hq.onCreate(model);
			model.enemyBase = new entity.EnemyBase(3750, 3750);
			var star = new entity.planetoid.Star(2000, 2000);
			star.onCreate(model);
		}
	}
	
	stage.onDestroy = function () {
		widget.generalInformation.destroy();
		widget.selectedInformation.destroy();
	}

	stage.templates = {
		mission1 : {
			hq: {x: 1900, y: 2000},
			planetoids: {
				star:  {x: 2000, y: 2000},
				planets: [
					{x: 2200, y: 1900, type: strategy.Materials.metal},
					{x: 2400, y: 1900, type: strategy.Materials.cristal},
					{x: 2600, y: 1900, type: strategy.Materials.deuterium}
				]
			}
		},
		mission4 : {
			hq: {x: 250, y: 250},
			enemyBase: {x: 3750, y: 3750},
			planetoids: {
				star:  {x: 2000, y: 2000},
				planets: []
			}
		},
		mission5 : {
			hq: {x: 250, y: 250},
			enemyBase: {x: 3750, y: 3750},
			planetoids: {
				star:  {x: 2000, y: 2000},
				planets: []
			}
		}
	};

	return stage;
}())
