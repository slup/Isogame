function init() {
    var canvas = document.getElementById('map');
    var map = new Map(canvas, 'level.json');
}

window.addEventListener('load', init, false);