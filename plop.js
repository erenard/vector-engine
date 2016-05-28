var engine = (function (engine) {
    "use strict";
    /** Animable */
    engine.Animable = (function () {
        function initialize() {
            this.update = function (_model) {/* abstract */};
        };
        return initialize;
    }());

    /** Renderable */
    engine.Renderable = (function () {
        function initialize() {
            engine.Animable.call(this);
            this.x = 0;
            this.y = 0;
            this.r = 0;
            this.minimapStyle = null;
            this.render = function (_context) {/* abstract */};
            this.enter = function (_context) {
                _context.save();
                _context.translate(this.x, this.y);
                _context.rotate(this.r);
            };
            this.redraw = function (_context) {
                this.enter(_context);
                this.render(_context);
                this.leave(_context);
            };
            this.leave = function (_context) {
                _context.restore();
            };
        };
        return initialize;
    }());

    /** Selectable */
    engine.Selectable = (function () {
        function initialize() {
            engine.Renderable.call(this);
            this.isMouseOver = false;
            this.isSelected = false;
            this.selectionPath = function (_context) {/* abstract */};
            this.renderMouseOver = function (_context) {/* abstract */};
            this.renderSelected = function (_context) {/* abstract */};
            this.renderInformation = function (_data, _button1, _button2, _button3) {/* abstract */};
            this.redraw = function (_context) {
                this.enter(_context);
                this.selectionPath(_context);
                this.isMouseOver = engine.mouse.overDistance !== 0 && _context.isPointInPath(engine.mouse.x, engine.mouse.y);
                if (this.isSelected) {
                    this.renderSelected(_context);
                }
                if (this.isMouseOver) {
                    this.renderMouseOver(_context);
                }
                this.render(_context);
                this.leave(_context);
                if (this.isMouseOver) {
                    return this;
                }
            };
            this.mouseEvent = function (_type, _model) {/* abstract */};
        };
        return initialize;
    }());
    
    /** Clickable */
    engine.Clickable = (function () {
        function initialize() {
            engine.Selectable.call(this);
            this.clicking = false;
            this.mouseEvent = function (_type, _model) {
                if(!_model.paused) {
                    switch (_type) {
                    case 'down':
                        if(this.isMouseOver) {
                            this.clicking = true;
                        }
                    break;
                    case 'up':
                        if(this.isMouseOver && this.clicking) {
                            this.clicking = false;
                            this.onClick(_model);
                        }
                    break;
                    }
                }
            };
            this.onClick = function (_model) {/* abstract */};
        };
        return initialize;
    }());
    
    /** Button */
    engine.Button = (function () {
        function initialize(_text, _width, _height, _x, _y) {
            engine.Clickable.call(this);
            this.text = _text;
            this.activeText = _text;
            this.width = _width || 100;
            this.height = _height || 30;
            this.font = '8pt Arial';
            this.style = 'rgba(255, 255, 255, 1)';
            this.overStyle = 'rgba(255, 0, 0, 1)';
            this.overActiveStyle = 'rgba(255, 127, 0, 1)';
            this.activeStyle = 'rgba(255, 255, 0, 1)';
            this.styleTransparent = 'rgba(255, 255, 255, 0.25)';
            this.overStyleTransparent = 'rgba(255, 0, 0, 0.25)';
            this.overActiveStyleTransparent = 'rgba(255, 127, 0, 0.25)';
            this.activeStyleTransparent = 'rgba(255, 255, 0, 0.25)';
            this.isActive = false;
            this.x = _x || 5;
            this.y = _y || 5;

            this.selectionPath = function (_context) {
                _context.beginPath();
                _context.moveTo(0, 0);
                _context.lineTo(this.width, 0);
                _context.lineTo(this.width, this.height);
                _context.lineTo(0, this.height);
                _context.closePath();
            };

            this.render = function (_context) {
                var color = '';
                if(this.isActive) {
                    color = this.isMouseOver ? this.overActiveStyle : this.activeStyle;
                } else {
                    color = this.isMouseOver ? this.overStyle : this.style;
                }
                _context.strokeStyle = color;
                _context.stroke();
                _context.fillStyle = 'black';
                _context.fill();

                if(this.text) {
                    _context.textAlign = 'center';
                    _context.textBaseline = 'middle';
                    _context.font = this.font;
                    _context.fillStyle = color;
                    if(this.isActive) {
                        _context.fillText(this.activeText, this.width / 2, this.height / 2, this.width);
                    } else {
                        _context.fillText(this.text, this.width / 2, this.height / 2, this.width);
                    }
                } else {
                    _context.translate(this.width / 2, this.height / 2);
                    if(this.isActive) {
                        _context.fillStyle = this.isMouseOver ? this.overActiveStyleTransparent : this.activeStyleTransparent;
                    } else {
                        _context.fillStyle = this.isMouseOver ? this.overStyleTransparent : this.styleTransparent;
                    }
                    this.renderIcon(_context);
                }
            };
            
            this.renderIcon = function (_context) {};
        }
        return initialize;
    })();
    /** Layer */
    engine.Layer = (function () {
        function initialize(_stage, _distance, _canvasWidth, _canvasHeight) {
            this.width = _stage.width;
            this.height = _stage.height;
            this.canvasWidth = _canvasWidth || engine.width;
            this.canvasHeight = _canvasHeight || engine.height;
            this.distance = _distance;
            this.position = {
                x: 0,
                y: 0,
                z: 1 / (_distance || 1)
            };
            this.render = function (_context, _model) {
                /* abstract */
            };
            this.redraw = function (_context, _model) {
                _context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                engine.camera.apply(this, _context);
                return this.render(_context, _model);
            };
            _stage.addLayer(this);
        };
        return initialize;
    }());

    /** Model */
    engine.Model = (function () {
        function initialize () {
            this.tickPeriod = 1000 / 30;
            this.lastTick;
            this.time;
            this.paused = false;
            this.speed = 1;
            this.reset = function () {/* abstract */};
            this.selectedObject = null;
            this.init = function () {
                this.lastTick = new Date() * 1;
                this.time = 0;
                this.selectedObject = null;
                this.reset();
            };
            this.tick = function (_delta) {/* abstract */}
            this.update = function (_time) {
                var updated = false;
                while ((_time - this.lastTick) > this.tickPeriod) {
                    //Real time
                    this.lastTick += this.tickPeriod / this.speed;
                    //Classic
                    //this.lastTick = _time;
                    if(!this.paused) {
                        this.tick(this.tickPeriod);
                        this.time += this.tickPeriod;
                        updated = true;
                    }
                }
                return updated;
            };
            this.select = function(_object) {
                if(this.selectedObject) this.selectedObject.isSelected = false;
                this.selectedObject = _object;
                if(this.selectedObject) this.selectedObject.isSelected = true;
            };
            this.unselect = function() {
                if(this.selectedObject) this.selectedObject.isSelected = false;
                this.selectedObject = null;
            };
        };
        return initialize;
    }());

    engine.mouse = {x: -1, y: -1, wheel: 0, overDistance: 1};

    /** Stage */
    engine.Stage = (function () {
        function initialize (_name, _width, _height, _model) {
            this.name = _name;
            this.width = _width;
            this.height = _height;
            this.model = _model;
            
            this.stageElement = document.getElementById(this.name + '_stage');
            this.canvasElement = document.getElementById(this.name + '_canvas');

            //Layers
            this.layers = new Array();
            function sortLayers(_l1, _l2) {return _l1.distance - _l2.distance;};
            this.layersCount = 0;
            this.addLayer = function(_layer) {
                this.layers[this.layersCount++] = _layer;
                this.layers = this.layers.sort(sortLayers);
            }
            //Drawing contexts
            this.contexts = new Array();
            //Mouse owner
            this.mouseOver = null;
            
            //getElementById
            this.elementById = function (_id) {
                return document.getElementById(this.name + '_' + _id);
            }

            this.getIdOfElement = function (_element) {
                var id = _element.id;
                if(id != null) {
                    return id.substring(this.name.length + 1);
                }
                return null;
            }

            function stopPropagation(_event) {
                _event.stopPropagation();
            };

            //special case for clicked elements
            this.addClickListener = function (_id, _handler) {
                var element = this.elementById(_id);
                if (element) {
                    element.addEventListener('click', _handler);
                    element.addEventListener('mouseup', engine.event.catchEvent);
                    element.addEventListener('mousedown', engine.event.catchEvent);
                }
            }

            //special case for clicked elements
            this.removeClickListener = function (_id, _handler) {
                var element = this.elementById(_id);
                if (element) {
                    element.removeEventListener('click', _handler);
                    element.removeEventListener('mouseup', engine.event.catchEvent);
                    element.removeEventListener('mousedown', engine.event.catchEvent);
                }
            }

            //Abstract function
            this.addEventListeners = function () {
            }
            
            //Abstract function
            this.removeEventListeners = function () {
            }
            
            /** Canvas and other init */
            this.createDomElements = function () {
                //Create canvas
                for(var i = this.layersCount; i > 0; i--) {
                    var canvasWidth = this.layers[i - 1].canvasWidth;
                    var canvasHeight = this.layers[i - 1].canvasHeight;
                    var canvas = window.document.createElement('canvas');
                    canvas.setAttribute('width', canvasWidth + 'px');
                    canvas.setAttribute('height', canvasHeight + 'px');
                    canvas.setAttribute('style', 'position: absolute;');
                    this.canvasElement.appendChild(canvas);
                    var context = canvas.getContext('2d');
                    context.webkitImageSmoothingEnabled = false;
                    context.mozImageSmoothingEnabled = false;
                    this.contexts[i - 1] = context;
                }
                //Display
                this.stageElement.style.display = '';
            }
            
            /** Canvas and other cleanup */
            this.destroyDomElements = function () {
                //Display
                this.stageElement.style.display = 'none';
                // Destroy canvas
                while (this.canvasElement.firstChild) {
                    this.canvasElement.removeChild(this.canvasElement.firstChild);
                }
                this.contexts = new Array();
            }

            /** Event propagation */
            this.mouseEvent = function (_type) {
                if(this.mouseOver != null) {
                    if(!this.mouseOver.mouseEvent(_type, this.model)) {
                        engine.camera.mouseEvent(_type, this.model);
                    }
                }
            };
            
            function renderLayer(_layer, _context) {
                var mouseOver = null;
                if (_layer && _context) {
                    _context.save();
                    mouseOver = _layer.redraw(_context, this.model);
                    _context.restore();
                }
                return mouseOver;
            };
            
            this.update = function (_time, _delta) {
                if(this.model.update(_time) | engine.camera.update(_delta, this.width, this.height)) {
                    var newMouseOverObject = null;
                    engine.mouse.overDistance = 1;
                    for(var i = 0; i < this.layersCount; i++) {
                        var layer = this.layers[i];
                        var mouseOverObject = renderLayer.call(this, layer, this.contexts[i]);
                        if(newMouseOverObject == null && mouseOverObject != null) {
                            newMouseOverObject = mouseOverObject;
                            engine.mouse.overDistance = layer.distance;
                        }
                    }
                    if(engine.mouse.overDistance == 0) {
                        this.mouseOver = null;
                    } else if (newMouseOverObject != null) {
                        this.mouseOver = newMouseOverObject;
                    } else {
                        this.mouseOver = engine.camera;
                    }
                }
            };
            
            this.onCreate = function () {};
            this.onCreated = function () {};
            this.onDestroy = function () {};
            this.onDestroyed = function () {};
            this.onPause = function () {
                this.model.paused = !this.model.paused;
                return this.model.paused;
            };
            this.onSpeed = function () {
                this.model.speed++;
                if(this.model.speed > 3) this.model.speed = 1;
                return this.model.speed;
            };
        };
        return initialize;
    })();
    
    engine.stages = {};

    /** Camera */
    engine.camera = (function () {
        //Update period
        var period = 1000 / 25,
        //Smoothness, 1 minimum
            smoothness = 4,
            //drag and drop startX, startY, startTime
            dndX = 0,
            dndY = 0,
            dndT = 0,
            //viewport size
            screenSizeX,
            screenSizeY,
            //pixelThickness
            pixelThickness = 1,
            //scene size
            width = 0,
            height = 0,
            //camera bounds
            minX = 0,
            minY = 0,
            minZ = 0,
            layersMinZ = 0,
            maxX = 0,
            maxY = 0,
            maxZ = 0,
            //camera state
            posX = 0,
            posY = 0,
            posZ = 1,
            //targeted position
            tgtX = 0,
            tgtY = 0,
            tgtZ = 1,
            //Minimap plugin
            minimap = {
                width: 0,
                height: 0,
                minX: 0,
                minY: 0,
                maxX: 0,
                maxY: 0
            },
            //initialization state
            bounded = false;

        function initStage(_stage) {
            if (_stage) {
                screenSizeX = engine.width;
                screenSizeY = engine.height;
                width = _stage.width;
                height = _stage.height;
                minimap.width = width;
                minimap.height = height;
                layersMinZ = 0;
                for(var i = 0; i < _stage.layersCount; i++) {
                    var layer = _stage.layers[i];
                    if(layer.distance == 1) {
                        screenSizeX = layer.canvasWidth;
                        screenSizeY = layer.canvasHeight;
                    } else if(layer.distance > 1) {
                        layer.position.z = (1 + 1 / layer.distance) * Math.max(screenSizeX / layer.width, screenSizeY / layer.height);
                        layersMinZ = Math.max(layersMinZ, layer.position.z);
                    }
                }
                initZBounds();
                initXYBounds();
                bounded = true;
                //First position
                zoom((maxZ - minZ) / 2);
                scroll(width / 2, height / 2);
                smoothness = 1;
                update(1);
                smoothness = 4;
            } else {
                screenSizeX = engine.width;
                screenSizeY = engine.height;
                width = screenSizeX;
                height = screenSizeY;
                pixelThickness = 1;
                dndX = 0;
                dndY = 0;
                dndT = 0;
                posX = 0;
                posY = 0;
                posZ = 1;
                tgtX = 0;
                tgtY = 0;
                tgtZ = 1;
                minX = 0;
                minY = 0;
                minZ = 0.5;
                maxX = 0;
                maxY = 0;
                maxZ = 1.5;
                bounded = false;
            }
        }

        /** Initialization */
        function setZoomBounds(_minZ, _maxZ) {
            if(_minZ > 0) {
                initZBounds();
                minZ = Math.max(_minZ, minZ);
                maxZ = Math.max(_maxZ, minZ);
                initXYBounds();
            }
        }

        /** public, handle mouse */
        function mouseEvent(_type, _model) {
            switch(_type) {
            //Begin drag and drop
            case 'down':
                dndX = engine.mouse.x;
                dndY = engine.mouse.y;
                dndT = new Date();
                tgtX = posX;
                tgtY = posY;
                tgtZ = posZ;
            break;
            //Continue drag and drop
            case 'move':
                if(dndT != 0) {
                    scroll(tgtX - (engine.mouse.x - dndX) / posZ, tgtY - (engine.mouse.y - dndY) / posZ);
                    dndX = engine.mouse.x;
                    dndY = engine.mouse.y;
                } else {
                    return false;
                }
            break;
            //End drag and drop
            case 'up':
                if(dndT != 0) {
                    dndT = 0;
                } else {
                    return false;
                }
            break;
            //Wheel Zoom
            case 'wheel':
                //Coordonnee relatives au milieu du viewport / viewport (-1 ... +1)
                //var offsetX = 2 * ((screenSizeX / 2) - _x) / screenSizeX;
                //var offsetY = 2 * ((screenSizeY / 2) - _y) / screenSizeY;
                //Future zoom
                zoom(tgtZ + (engine.mouse.wheel > 0 ? 0.1 : -0.1));
            break;
            default:
                return false;
            }
            return true;
        }

        /** public, does the camera has the mouse focus ? */
        function isDragStarted() {
            return dndT != 0;
        }

        /** public, scroll to (x, y) */
        function scroll(_tgtX, _tgtY) {
            tgtX = _tgtX;
            tgtY = _tgtY;

            applyXYBounds();
        }

        /** public, zoom and scroll to (x, y, z) */
        function zoom(_tgtZ) {
            tgtZ = _tgtZ;

            tgtZ = tgtZ < minZ ? minZ : tgtZ;
            tgtZ = tgtZ > maxZ ? maxZ : tgtZ;

            initXYBounds();
        }
        
        function zoomIn () {
            zoom(tgtZ + 0.1);
        }
        
        function zoomOut () {
            zoom(tgtZ - 0.1);
        }
        
        function initXYBounds() {
            maxX = width - screenSizeX / (2 * tgtZ);
            minX = width - maxX;
            maxY = height - screenSizeY / (2 * tgtZ);
            minY = height - maxY;
            
            applyXYBounds();
            bounded = true;
        }
        
        function applyXYBounds() {
            tgtX = tgtX < minX ? minX : tgtX;
            tgtX = tgtX > maxX ? maxX : tgtX;
            tgtY = tgtY < minY ? minY : tgtY;
            tgtY = tgtY > maxY ? maxY : tgtY;
        }

        function initZBounds() {
            minZ = Math.max(screenSizeX / width, screenSizeY / height);
            minZ = Math.max(minZ, layersMinZ + 0.1);
            maxZ = minZ + 1;
        }

        /**
         *    _delta: amount of time since the last update
         */
        function update(_delta) {
            if (bounded) {
                do {
                    posX += (tgtX - posX) / smoothness;
                    posY += (tgtY - posY) / smoothness;
                    posZ += (tgtZ - posZ) / smoothness;

                    var upperLeft = toWorld(0, 0);
                    minimap.minX = upperLeft.x;
                    minimap.minY = upperLeft.y;

                    var lowerRight = toWorld(screenSizeX, screenSizeY);
                    minimap.maxX = lowerRight.x;
                    minimap.maxY = lowerRight.y;

                    pixelThickness = 1 / posZ;

                    _delta -= period;
                } while (_delta > period);
                return true;
            }
            return false;
        }

        /** Apply the camera to the context */
        function apply(_layer, _ctx) {
            if(bounded) {
                if(_layer.distance == 0) {
                    _layer.position.x = engine.width / 2;
                    _layer.position.y = engine.height / 2;
                    _layer.position.z = 1;
                } else if(_layer.distance == 1) {
                    _layer.position.x = posX;
                    _layer.position.y = posY;
                    _layer.position.z = posZ;
                } else {
                    if(maxX != minX) {
                        var tmp = screenSizeX / _layer.position.z;
                        _layer.position.x = tmp / 2;
                        _layer.position.x += (posX - minX) * (width - tmp) / (maxX - minX);
                    } else {
                        _layer.position.x = posX;
                    }
                    if(minY != maxY) {
                        var tmp = screenSizeY / _layer.position.z;
                        _layer.position.y = tmp / 2;
                        _layer.position.y += (posY - minY) * (height - tmp) / (maxY - minY);
                    } else {
                        _layer.position.y = posY;
                    }
                }
                //Screen size compensation
                _ctx.translate(_layer.canvasWidth / 2, _layer.canvasHeight / 2);
                //Zoom
                _ctx.scale(_layer.position.z, _layer.position.z);
                //Scroll
                _ctx.translate(0 - _layer.position.x, 0 - _layer.position.y);
                //console.log(_layer.distance + ' : ' + posX + ' ' + posY + ' ' + posZ + ' -> ' + _layer.position.x + ' ' + _layer.position.y);
            }
        }

        function toWorld(_x, _y, _layer) {
            if(_layer == null) {
                /*
                //Non optimis� mais lisible
                var x = _x;
                var y = _y;
                x -= screenSizeX / 2;
                y -= screenSizeY / 2;
                x /= posZ;
                y /= posZ;
                x += posX;
                y += posY;
                */
                var x = posX + (_x - (screenSizeX / 2)) / posZ;
                var y = posY + (_y - (screenSizeY / 2)) / posZ;
                return {x: (0.5 + x) | 0, y: (0.5 + y) | 0};
            } else {
                var x = _layer.position.x + (_x - (screenSizeX / 2)) / _layer.position.z;
                var y = _layer.position.y + (_y - (screenSizeY / 2)) / _layer.position.z;
                return {x: (0.5 + x) | 0, y: (0.5 + y) | 0};
            }
        }

        /** Obtain the visible rectangle */
        function visibleRect(_posX, _posY, _width, _height, _size) {
            if(bounded) {
                var upperLeft = toWorld(0, 0);
                var lowerRight = toWorld(screenSizeX, screenSizeY);
                
                var xMin = upperLeft.x - _posX;
                var yMin = upperLeft.y - _posY;
                var xMax = lowerRight.x - _posX;
                var yMax = lowerRight.y - _posY;
                
                xMin = xMin < 0 ? 0 : xMin;
                yMin = yMin < 0 ? 0 : yMin;
                xMax = xMax < 0 ? 0 : xMax;
                yMax = yMax < 0 ? 0 : yMax;
            
                xMin = xMin > _width  ? _width  : xMin;
                yMin = yMin > _height ? _height : yMin;
                xMax = xMax > _width  ? _width  : xMax;
                yMax = yMax > _height ? _height : yMax;

                xMin /= _size;
                yMin /= _size;
                xMax /= _size;
                yMax /= _size;
                
                xMin = (0.5 + xMin) | 0;
                yMin = (0.5 + yMin) | 0;
                xMax = (0.5 + xMax) | 0;
                yMax = (0.5 + yMax) | 0;

                return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
            }
            return null;
        }

        function getMinimap() {
            return minimap;
        }
        
        function getPixelThickness() {
            return pixelThickness;
        }

        return {
            initStage: initStage,
            mouseEvent: mouseEvent,
            scroll: scroll,
            zoom: zoom,
            zoomIn: zoomIn,
            zoomOut: zoomOut,
            update: update,
            apply: apply,
            toWorld: toWorld,
            visibleRect: visibleRect,
            isDragStarted: isDragStarted,
            getMinimap: getMinimap,
            getPixelThickness: getPixelThickness,
            setZoomBounds: setZoomBounds
        };
     }());

    /** Viewport */
    engine.viewport = (function () {
        var opacityShutter = null,
            mouseEventListener = null,
            boundingClientRect = null,
            //0 none, 1 opening, 2 normal, 3 closing, 4 modal
            stageState = 0,
            stage = null,
            nextStages = new Array(),
            globalOpacity = 0,
            lastTick = -1;

        // Mouse Events handling
        function mouseMove(_event) {
            engine.event.catchEvent(_event);
            engine.mouse.x = _event.clientX - boundingClientRect.left;
            engine.mouse.y = _event.clientY - boundingClientRect.top;
            if (stage) stage.mouseEvent('move');
        }

        function mouseUp(_event) {
            engine.event.catchEvent(_event);
            if (stage) stage.mouseEvent('up');
        }

        function mouseDown(_event) {
            engine.event.catchEvent(_event);
            if (stage) stage.mouseEvent('down');
        }

        function mouseWheel(_event) {
            engine.event.catchEvent(_event);
            engine.mouse.wheel = _event.detail ? _event.detail * -1 : _event.wheelDelta / 40;
            if (stage) stage.mouseEvent('wheel');
        }

        /** Queue the next rendering stage */
        function goToStage(_stageName) {
            var nextStage = engine.stages[_stageName];
            if(nextStage) {
                nextStages.push(nextStage);
            }
        }

        function showModal(_modalId) {
            if(stageState == 2 && engine.modals[_modalId]) {
                globalOpacity = 0.5;
                opacityShutter.style.display = '';
                stageState = 4;
                var modal = document.getElementById(_modalId + '_modal');
                modal.style.display = '';
                engine.modals[_modalId].addEventListeners();
                engine.modals[_modalId].onShow();
            }
        }

        function hideModal(_modalId) {
            if(stageState == 4 && engine.modals[_modalId]) {
                globalOpacity = 0;
                opacityShutter.style.display = 'none';
                stageState = 2;
                var modal = document.getElementById(_modalId + '_modal');
                modal.style.display = 'none';
                engine.modals[_modalId].removeEventListeners();
                engine.modals[_modalId].onHide();
            }
        }

        //Animation
        function start() {
            lastTick = new Date();
        }
        
        function tick(_time) {
            var delta = _time - lastTick;
            if(stage) {
                stage.update(_time, delta);
            }
            switch (stageState) {
            case 0:
                //Full black screen
                globalOpacity = 1;
                if(nextStages.length > 0) {
                    stage = nextStages.shift();
                    stageState = 1;
                    stage.createDomElements();
                    engine.camera.initStage(stage);
                    stage.model.init();
                    stage.onCreate();
                }
                break;
            case 1:
                //Opening
                globalOpacity -= delta / 500;
                globalOpacity = Math.max(globalOpacity, 0);
                if(globalOpacity == 0) {
                    stageState = 2;
                    //Register event listeners
                    stage.addEventListeners();
                    stage.onCreated();
                    opacityShutter.style.display = 'none';
                }
                break;
            case 2:
                //No black screen
                if(nextStages.length > 0) {
                    stageState = 3;
                    //Unregister event listeners
                    stage.removeEventListeners();
                    stage.onDestroy();
                    opacityShutter.style.display = '';
                }
                break;
            case 3:
                //Closing
                globalOpacity += delta / 500;
                globalOpacity = Math.min(globalOpacity, 1);
                if(globalOpacity === 1) {
                    stageState = 0;
                    stage.onDestroyed();
                    stage.destroyDomElements();
                }
                break;
            case 4:
                //Modal
                break;
            }
            opacityShutter.style.background = 'rgba(0, 0, 0, ' + globalOpacity + ')';
            lastTick = _time;
        }

        function initialize() {
            opacityShutter = document.getElementById('opacityShutter');
            if (opacityShutter) {
                boundingClientRect = opacityShutter.getBoundingClientRect();
                engine.left = boundingClientRect.left;
                engine.top = boundingClientRect.top;
                engine.width = boundingClientRect.width;
                engine.height = boundingClientRect.height;
                opacityShutter.addEventListener('mousemove', engine.event.catchEvent);
                opacityShutter.addEventListener('mouseup', engine.event.catchEvent);
                opacityShutter.addEventListener('mousedown', engine.event.catchEvent);
                opacityShutter.addEventListener('click', engine.event.catchEvent);
                if(Modernizr.hasEvent('mousewheel')) {
                    opacityShutter.addEventListener('mousewheel', engine.event.catchEvent);
                } else {
                    opacityShutter.addEventListener('DOMMouseScroll', engine.event.catchEvent);
                }
            }
            mouseEventListener = document.getElementById('mouseEventListener');
            if(mouseEventListener) {
                mouseEventListener.addEventListener('mousemove', mouseMove);
                mouseEventListener.addEventListener('mouseup', mouseUp);
                mouseEventListener.addEventListener('mousedown', mouseDown);
                //TODO handle mouse out
                mouseEventListener.addEventListener('mouseout', mouseUp);
                if(Modernizr.hasEvent('mousewheel')) {
                    mouseEventListener.addEventListener('mousewheel', mouseWheel);
                } else {
                    mouseEventListener.addEventListener('DOMMouseScroll', mouseWheel);
                }
            }
        }

        return {
            initialize: initialize,
            goToStage: goToStage,
            showModal: showModal,
            hideModal: hideModal,
            start: start,
            tick: tick
        };
    }());
    
    engine.left = 0;
    engine.top = 0;
    engine.width = 800;
    engine.height = 600;

    /** Animator */
    engine.animator = (function () {
        //state
        var running = false,
            viewport = engine.viewport,
        //fps counter
            lastFps = 0,
            calls = 0,
            fpsContainer = document.getElementById('fps'),
            lastTick = new Date();

        function requestAnimFrame(callback) {
            (window.requestAnimationFrame      || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            })(callback);
        }

        function animate(_time) {
            if (running) {
                _time = _time || new Date();
                viewport.tick(_time);
                if (fpsContainer) {
                    calls++;
                    if (_time - lastFps > 1000) {
                        fpsContainer.innerHTML = calls + ' fps';
                        lastFps = _time;
                        calls = 0;
                    }
                }
                
                requestAnimFrame(animate);
            }
        }

        function start() {
            running = true;
            viewport.start();
            animate();
        }

        function stop() {
            running = false;
        }

        return {
            start: start,
            stop: stop
        };
    }());

    /** Math */
    engine.math = (function () {
        function direction(dX, dY) {
            if(dY == 0) {
                if(dX < 0) {
                    return Math.PI;
                } else {
                    return 0;
                }
            }
            /*
            if(dX == 0) {
                if(dY > 0) {
                    return Math.PI / 2;
                } else {
                    return Math.PI / -2;
                }
            }
            */
            if(dX < 0) {
                if(dY < 0) {
                    return Math.atan(dY / dX) - Math.PI;
                } else {
                    return Math.atan(dY / dX) + Math.PI;
                }
            } else {
                //Marche
                return Math.atan(dY / dX);
            }
            return alpha;
        }
        function distance(dX, dY, max) {
            var pythagore = dX * dX + dY * dY;
            if(max) {
                return pythagore < (max * max);
            } else {
                return Math.sqrt(pythagore);
            }
        }
        function round(a) {
            return (0.5 + a) | 0;
        }
        return {
            direction: direction,
            distance: distance,
            round: round
        };
    }());

    /** Pattern */
    engine.pattern = (function () {
        var context;
        var canvas;
        function newPattern(_width, _height) {
            canvas = window.document.createElement('canvas');
            canvas.setAttribute('width', _width + 'px');
            canvas.setAttribute('height', _height + 'px');
            context = canvas.getContext('2d');
            return context;
        }
        function add(_name, _repeat) {
            engine.patterns[_name] = context.createPattern(canvas, _repeat);
            context = null;
            canvas = null;
        }
        function remove(_name) {
            delete engine.patterns[_name];
        }
        return {
            newPattern: newPattern,
            remove: remove,
            add: add
        };
    }());
    
    engine.patterns = {};
    
    /** Sprite */
    engine.sprite = (function () {
        var context;
        var canvas;
        function newContext(_width, _height) {
            canvas = window.document.createElement('canvas');
            canvas.setAttribute('width', _width + 'px');
            canvas.setAttribute('height', _height + 'px');
            context = canvas.getContext('2d');
            return context;
        }
        function add(_name) {
            engine.sprites[_name] = canvas;
            context = null;
            canvas = null;
        }
        function remove(_name) {
            delete engine.sprites[_name];
        }
        function draw(_context, _id, _x, _y) {
            var sprite = engine.sprites[_id];
            if(sprite != null) {
                _context.drawImage(sprite, _x - sprite.width / 2, _y - sprite.height / 2);
            }
        }
        function drawTopLeft(_context, _id, _x, _y) {
            var sprite = engine.sprites[_id];
            if(sprite != null) {
                _context.drawImage(sprite, _x, _y);
            }
        }
        return {
            newContext: newContext,
            remove: remove,
            add: add,
            drawTopLeft: drawTopLeft,
            draw: draw
        };
    }());
    
    engine.sprites = {};
    
    engine.colors = (function () {
    
        function allyLifeBar(_ratio) {
            var red = Math.floor(255 * (1 - _ratio));
            return 'rgb(' + red + ', ' + (255 - red) + ', 0)';
        }

        function enemyLifeBar(_ratio) {
            return allyLifeBar(1 - _ratio);
        }

        return {
            allyLifeBar: allyLifeBar,
            enemyLifeBar: enemyLifeBar
        };
    }());
    
    /** Modal */
    engine.Modal = (function () {
        function initialize (_name) {
            this.name = _name;
            this.onHide = function () {};
            this.onShow = function () {};
            this.addEventListeners = function () {}
            this.removeEventListeners = function () {}
            //getElementById
            this.elementById = function (_id) {
                return document.getElementById(this.name + '_' + _id);
            }
        };
        return initialize;
    })();
    
    engine.modals = {};

    /** Options cache */
    engine.options = {};
    
    engine.event = (function () {
        function catchEvent(_event) {
            _event.preventDefault();
            _event.stopPropagation();
        }
        
        function element(_event) {
            if(_event.srcElement) {
                return _event.srcElement;
            } else {
                return _event.target;
            }
        }

        return {
            catchEvent: catchEvent,
            element: element
        };
    }());

    return engine;
}(engine || {}));