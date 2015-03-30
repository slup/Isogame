

function Map (canvas, mapname) {
    this.mapSettings = {};
	this.map = {}
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");;
	
	this.canvas.onmousedown = this.onMoveStart.bind(this);
	this.canvas.onmouseup = this.onMoveStop.bind(this);
	this.canvas.onmousemove = this.onMove.bind(this);
	
	this.movementMode = MOVEMENT_MODE.MOVE_NONE;
    this.dragOffset = {x : 0, y : 0};
	this.mapOffset = {x : 0, y : 0};
	
	this.loadMap('data/'+mapname);
}

Map.prototype.loadMap = function (mapfile) {
    var loadedMap = loadJSON(mapfile);
    this.mapSettings = JSON.parse(loadedMap);
	
	this.backgroundObjectType = GameObjects[this.mapSettings.backgroundObjectType];
	
	for (var x = 0; x < this.mapSettings.width; x++) {
        for (var y = 0; y < this.mapSettings.height; y++) {
			this.map[x+","+y] = [];
			var currentLocation = this.map[x+","+y];
            var background = new this.backgroundObjectType(x,y);
			currentLocation.push(background);
			
			var detailObjects = this.mapSettings.detail[x+","+y];
			for (detailObjectIndex in detailObjects) {
				var detailObject = detailObjects[detailObjectIndex];
				var detailType = new GameObjects[detailObject](x,y);
				currentLocation.push(detailType);
			}
			
			var movableObjects = this.mapSettings.movable[x+","+y];
			for (movableObjectIndex in movableObjects) {
				var movableObject = movableObjects[movableObjectIndex];
				var movableType = new GameObjects[movableObject](x,y);
				currentLocation.push(movableType);
			}
        }
    }
	
	this.draw();
}

Map.prototype._clear = function () {
	// Store the current transformation matrix
	this.ctx.save();

	// Use the identity matrix while clearing the canvas
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

	// Restore the transform
	this.ctx.restore();
}

Map.prototype.draw = function () {
	
	this._clear();
	
	for (locationIndex in this.map) {
		var layerObjects = this.map[locationIndex];
		for (layerObjectIndex in layerObjects) {
			var layerObject = layerObjects[layerObjectIndex];
			layerObject.draw(this.ctx);
		}
	}
}

Map.prototype.onMoveStart = function(event) {
	this.dragOffset.x = event.clientX;
	this.dragOffset.y = event.clientY;
	
	var objects = this._getObjectsAtPixelCoordinate(event.clientX, event.clientY);
	var moveableObjects = this._getMoveableObjects(objects);

	if (moveableObjects.length) {
		this.movementMode = MOVEMENT_MODE.MOVE_UNIT;
		this.movingObject = moveableObjects[0];
		this.movingObject.select(true);
	} else {
		this.movementMode = MOVEMENT_MODE.MOVE_MAP;
	}
	
}

Map.prototype.onMoveStop = function(event) {
	if (this.movementMode === MOVEMENT_MODE.MOVE_UNIT) {
		this.movingObject.select(false);
		this.movingObject = undefined;
	}
	
	this.movementMode = MOVEMENT_MODE.MOVE_NONE;
}

Map.prototype.onMove = function(event) {
	if(!this.movementMode) {
		return;
	}
	
	if (this.movementMode === MOVEMENT_MODE.MOVE_MAP) {
	
		this.mapOffset.x += event.clientX - this.dragOffset.x;
		this.mapOffset.y += event.clientY - this.dragOffset.y;
		
		this.ctx.translate(
			event.clientX - this.dragOffset.x, 
			event.clientY - this.dragOffset.y);
			
	} else if (this.movementMode === MOVEMENT_MODE.MOVE_UNIT
		&& this.movingObject) {
		var newLocation = this._getMapCoordinateForPixelCoordinate(event.clientX, event.clientY);
		this._moveObject(this.movingObject, newLocation);
	} else {
	}
	
	this.draw();
	
	this.dragOffset.x = event.clientX;
	this.dragOffset.y = event.clientY;
	
	return false;
}

Map.prototype._getMapCoordinateForPixelCoordinate = function(px, py) {
	var pixelX = px - this.mapOffset.x;
	var pixelY = py - this.mapOffset.y;
		
	var y = Math.floor(((pixelY + (pixelX / 2)) - (CONSTANT.TILE_HEIGHT / 2))
				/ CONSTANT.TILE_HEIGHT);
        		
	var x = Math.floor(-((pixelY - (pixelX / 2)) - (CONSTANT.TILE_HEIGHT / 2))
				/ CONSTANT.TILE_HEIGHT);
				
	return {x : x, y : y};
}

Map.prototype._getObjectsAtPixelCoordinate = function(px, py) {

	var point = this._getMapCoordinateForPixelCoordinate(px, py);
	
	var layerObjects = this.map[point.x+','+point.y];
	return layerObjects;
}

Map.prototype._getMoveableObjects = function(objectList) {

	var moveableObjects = [];

	for (layerObjectIndex in objectList) {
		var layerObject = objectList[layerObjectIndex];
		if (layerObject.isMoveable()) {
			moveableObjects.push(layerObject);
		}
	}
	
	return moveableObjects;
}

Map.prototype._moveObject = function(object, mTo) {
	var layerObjects = this.map[object.x+','+object.y];
	var index = layerObjects.indexOf(object);
	var moveObject = undefined;
	
	if (index > -1) {
		moveObject = layerObjects.splice(index, 1)[0];
	}
	
	if (moveObject && moveObject.isMoveable()) {	
		moveObject.moveTo(mTo.x, mTo.y);
		
		this.map[mTo.x+','+mTo.y].push(moveObject);
	}
}



