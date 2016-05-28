var widget = (function (widget) {
	"use strict";	
	/** Settings */
	widget.settings = (function () {
		var data = {};
		
		var wasPaused;
		var display = false;
		
		function open(_model) {
			wasPaused = _model.paused;
			_model.paused = true;
			display = true;
		};
		
		function close() {
			_model.paused = wasPaused;
			display = false;
		};
		
		return {
			open: open,
			close: close
		};
	}());

	return widget;
}(widget || {}));
