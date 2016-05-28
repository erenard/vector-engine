var widget = (function (widget) {
	"use strict";
	/** Minimap  */
	widget.minimap = (function () {
		var posX, posY,
			width, height,
			ratioX, ratioY,
			map, thickness,
			element, context,
			clicking = false;

		function setElement(_element) {
			element = _element;
			posX = element.offsetLeft;
			posY = element.offsetTop;
			width = element.offsetWidth;
			height = element.offsetHeight;
			/*
			var parentNode = element.parentNode;
			while(parentNode.offsetWidth < engine.width) {
				posX += parentNode.offsetLeft;
				parentNode = parentNode.parentNode;
			}
			parentNode = element.parentNode;
			while(parentNode.offsetHeight < engine.height) {
				posY += parentNode.offsetTop;
				parentNode = parentNode.parentNode;
			}
			*/
		}

		function enter(_context) {
			context = _context;
			context.save();
			//Minimap frame
			context.translate(posX, posY);
			/*
			//context.strokeStyle = 'white';
			context.fillStyle = 'black';
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(width, 0);
			context.lineTo(width, height);
			context.lineTo(0, height);
			context.closePath();
			//context.stroke();
			context.fill();
			context.clip();
			//isMouseOver = context.isPointInPath(engine.mouse.x, engine.mouse.y);
			*/
			//Prepare rendering
			map = engine.camera.getMinimap();
			ratioX = width / map.width;
			ratioY = height / map.height;
			thickness = 1 / ratioX;
			context.scale(ratioX, ratioY);
			context.lineWidth = thickness;
		}

		function style(_style) {
			context.strokeStyle = _style;
		}
		
		function draw(_renderable) {
			context.beginPath();
			context.moveTo(_renderable.x, _renderable.y);
			context.lineTo(_renderable.x, _renderable.y + thickness);
			context.lineTo(_renderable.x + thickness, _renderable.y + thickness);
			context.lineTo(_renderable.x + thickness, _renderable.y);
			context.closePath();
			context.stroke();
		}
		
		function leave() {
			context.beginPath();
			context.moveTo(map.minX, map.minY);
			context.lineTo(map.maxX, map.minY);
			context.lineTo(map.maxX, map.maxY);
			context.lineTo(map.minX, map.maxY);
			context.closePath();
			context.strokeStyle = 'rgba(127, 127, 255, 1)';
			context.stroke();
			context.restore();
		}

		function mouseUp(_event) {
			if (clicking) {
				clicking = false;
			}
		}
		
		function mouseDown(_event) {
			engine.event.catchEvent(_event);
			clicking = true;
			mouseMove(_event);
		}
		
		function mouseMove(_event) {
			if (clicking) {
				engine.event.catchEvent(_event);
				engine.camera.scroll((_event.clientX - engine.left - posX) / ratioX, (_event.clientY - engine.top - posY) / ratioY);
			}
		}
		
		function addEventListeners() {
			if(element) {
				element.addEventListener('mouseup', mouseUp);
				element.addEventListener('mousedown', mouseDown);
				element.addEventListener('mousemove', mouseMove);
			}
		}
		
		function removeEventListeners() {
			if(element) {
				element.removeEventListener('mouseup', mouseUp);
				element.removeEventListener('mousedown', mouseDown);
				element.removeEventListener('mousemove', mouseMove);
			}
		}
		
		return {
			setElement: setElement,
			enter: enter,
			leave: leave,
			addEventListeners: addEventListeners,
			removeEventListeners: removeEventListeners,
			style: style,
			draw: draw
		};
	}());

	return widget;
}(widget || {}));
