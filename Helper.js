 function loadJSON(path) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, false);
    xobj.send(null);  
    if (xobj.responseText) {
        return xobj.responseText;
    } else {
        return null;
    }
 }

 var CONSTANT = {
    TILE_WIDTH : 64,
    TILE_HEIGHT : 32,
}

var MOVEMENT_MODE = {
	MOVE_NONE : 0,
	MOVE_MAP : 1,
	MOVE_UNIT : 2,
}