var canvas;
var firebase = new Firebase('https://cs117whiteboard.firebaseio.com');

var SCALE_FACTOR = 0.5;
var canvasScale = 1;

$( document ).ready( function() {
  // Initialize Drawing Canvas
  canvas = this.__canvas = new fabric.Canvas('whiteboard');
  canvas.isDrawingMode = true;

  // Set Pen Options
  canvas.freeDrawingBrush.color = '#000';
  canvas.freeDrawingLineWidth = 10;

  firebase.on('value', function(snapshot) {
    // Read from Firebase
    canvas.loadFromJSON(snapshot.val());
    //resetDefaultToZoom();
    canvas.renderAll();
  });

  canvas.on("mouse:up", function () {
    // Upload to Firebase
    var canvasData = canvas.toJSON();
    canvasData = removePathFill(canvasData);
    //resetZoomToDefault();
    firebase.set(canvasData);
  });

});

function removePathFill(canvasData) {
  var path;
  for(path in canvasData.objects ) {
    console.log(canvasData.objects[path]);
    canvasData.objects[path].fill = false;
  }
  return canvasData;
}

function clearFun() {
	canvas.clear();
}

function zoomOutFun() {
	var objects = canvas.getObjects();
	    for (var i in objects) {
	        var scaleX = objects[i].scaleX;
	        var scaleY = objects[i].scaleY;
	        var left = objects[i].left;
	        var top = objects[i].top;
	        
	        var tempScaleX = scaleX * SCALE_FACTOR;
	        var tempScaleY = scaleY * SCALE_FACTOR;
	        var tempLeft = left * SCALE_FACTOR;
	        var tempTop = top * SCALE_FACTOR;
	        
	        objects[i].scaleX = tempScaleX;
	        objects[i].scaleY = tempScaleY;
	        objects[i].left = tempLeft;
	        objects[i].top = tempTop;
	        
	        objects[i].setCoords();
	    }

	canvas.renderAll();
	canvasScale *= SCALE_FACTOR;
}

function zoomInFun() {
	var objects = canvas.getObjects();
	    for (var i in objects) {
	        var scaleX = objects[i].scaleX;
	        var scaleY = objects[i].scaleY;
	        var left = objects[i].left;
	        var top = objects[i].top;
	        
	        var tempScaleX = scaleX / SCALE_FACTOR;
	        var tempScaleY = scaleY / SCALE_FACTOR;
	        var tempLeft = left / SCALE_FACTOR;
	        var tempTop = top / SCALE_FACTOR;
	        
	        objects[i].scaleX = tempScaleX;
	        objects[i].scaleY = tempScaleY;
	        objects[i].left = tempLeft;
	        objects[i].top = tempTop;
	        
	        objects[i].setCoords();
	    }

	canvas.renderAll();
	canvasScale /= SCALE_FACTOR;

}


function resetZoomToDefault() {

	var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
    
        var tempScaleX = scaleX * (1 / canvasScale);
        var tempScaleY = scaleY * (1 / canvasScale);
        var tempLeft = left * (1 / canvasScale);
        var tempTop = top * (1 / canvasScale);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }
        
    canvas.renderAll();

}

function resetDefaultToZoom() {

	var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
    
        var tempScaleX = scaleX * (canvasScale);
        var tempScaleY = scaleY * (canvasScale);
        var tempLeft = left * (canvasScale);
        var tempTop = top * (canvasScale);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }
        
    canvas.renderAll();
}
