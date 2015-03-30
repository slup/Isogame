var GameObjects = {
   Grass: Grass,
   Street: Street,
   Tank: Tank
};


function GameObject (x, y, tilename) {
    this.x = x;
    this.y = y;
	
	this.selected = false;

    var img = new Image(); 
    img.src = 'data/img/' + tilename; // Set source path
    this.tile = img;
}

GameObject.prototype.draw = function (ctx) {
    ctx.drawImage(this.tile, this.getPixelX(), this.getPixelY());
	
	if (this.isSelected()) {
		var overlay = new Image(); 
		overlay.src = 'data/img/overlay_red.png';
		ctx.drawImage(overlay, this.getPixelX(), this.getPixelY());
	}
}

GameObject.prototype.getPixelX = function () {
    return parseInt(
            this.x * (0.5 * CONSTANT.TILE_WIDTH) + 
            this.y * (0.5 * CONSTANT.TILE_WIDTH));
}

GameObject.prototype.getPixelY = function () {
    return parseInt(
            this.y * (0.5 * CONSTANT.TILE_HEIGHT) - 
            this.x * (0.5 * CONSTANT.TILE_HEIGHT));
}

GameObject.prototype.isMoveable = function () {
    return false;
}

GameObject.prototype.isSelected = function () {
    return this.selected;
}

GameObject.prototype.select = function (selected) {
    this.selected = selected;
}

function Grass(mx, my) {
    GameObject.call(this, mx, my, "ground_grass.png");
}
Grass.prototype = Object.create(GameObject.prototype);

function Street(px, py) {
    GameObject.call(this, px, py, "ground_street.png");
}
Street.prototype = Object.create(GameObject.prototype);

// -----------------------------------
function MoveableGameObject(px, py, tilename) {
    GameObject.call(this, px, py, tilename);
}
MoveableGameObject.prototype = Object.create(GameObject.prototype);

MoveableGameObject.prototype.isMoveable = function () {
    return true;
}

MoveableGameObject.prototype.moveTo = function (mx, my) {
	this.x = mx;
	this.y = my;
}

function Tank(px, py) {
    MoveableGameObject.call(this, px, py, "move_tank_s.png");
}
Tank.prototype = Object.create(MoveableGameObject.prototype);