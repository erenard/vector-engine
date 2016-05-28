
engine.modals.options = (function () {
	"use strict";
	var modal = new engine.Modal('options');
    
	modal.addEventListeners = function () {
		modal.elementById('close').addEventListener('click', closeMe);
		modal.elementById('100stars').addEventListener('click', stars100);
		modal.elementById('200stars').addEventListener('click', stars200);
		modal.elementById('400stars').addEventListener('click', stars400);
        
	}
	
	modal.removeEventListeners = function () {
		modal.elementById('close').removeEventListener('click', closeMe);
		modal.elementById('100stars').removeEventListener('click', stars100);
		modal.elementById('200stars').removeEventListener('click', stars200);
		modal.elementById('400stars').removeEventListener('click', stars400);
	}

    modal.onShow = function () {
    }

    modal.onHide = function () {
    }

    function closeMe() {
        engine.viewport.hideModal('options');
    };

    function stars100() {
        engine.options['stars'] = 25;
    };

    function stars200() {
        engine.options['stars'] = 50;
    };

    function stars400() {
        engine.options['stars'] = 100;
    };
    
    return modal;
}())
