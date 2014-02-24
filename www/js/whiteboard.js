$( document ).ready( function() {
  // Initialize Drawing Canvas
  Whiteboard.canvas = new fabric.Canvas('whiteboard');
  var canvas = Whiteboard.canvas;
  canvas.isDrawingMode = true;
  $('#title').text(Whiteboard.session);
  //initCanvas(Whiteboard.firebase.child(Whiteboard.session), canvas);

  // Set Pen Options
  canvas.freeDrawingBrush.color = '#000';
  canvas.freeDrawingLineWidth = 10;


  // Update Canvas
  Whiteboard.firebase.on('value', function(snapshot) {
    updateCanvas(snapshot, canvas);
  });

  // Update Firebase
  Whiteboard.canvas.on("mouse:up", function () {
    updateFirebase(Whiteboard.firebase, canvas)
  });

  $('#sessionSubmit').click(function() {
    Whiteboard.session = $('#sessionId').val();
    $('#sessionId').val('');
    if ( Whiteboard.session === '' ) {
        Whiteboard.session = 'Whiteboard';
    }
    $('#title').text(Whiteboard.session);
    Whiteboard.firebase = Whiteboard.firebase.root().child(Whiteboard.session);
    clear(canvas);
    initCanvas(Whiteboard.firebase, canvas);
  });

  //set handle for clear-canvas button
  $('#clear-canvas').click(function(){
    clear(canvas);
  });


  //handler for zoom out button
  $('#zoom-out').click(function(){
    zoomOut(canvas);
  });

  //handler for zoom in button click
  $('#zoom-in').click(function(){
    zoomIn(canvas);
  });

  $('#default-view').click(function(){
    defaultView(canvas);
  });

/*
  $('#back-to-zoom').click(function(){
    backToZoom(canvas);
  });
*/
});

function initCanvas(firebase, canvas) {
  firebase.once('value', function(data) {
    canvas.loadFromJSON(data.val());
    //resetDefaultToZoom();
    canvas.renderAll();
  });
}

function updateCanvas(snapshot, canvas) {
    canvas.loadFromJSON(snapshot.val());
    //resetDefaultToZoom();
    canvas.renderAll();
}


function updateFirebase(firebase, canvas) {
    var canvasData = canvas.toJSON();
    canvasData = removePathFill(canvasData);
    //resetZoomToDefault();
    firebase.set(canvasData);
}

function removePathFill(canvasData) {
  var path;
  for(path in canvasData.objects ) {
    canvasData.objects[path].fill = false;
  }
  return canvasData;
}


function clear(canvas){
  canvas.clear();
}

function zoomOut(canvas) {
  var objects = canvas.getObjects();
      for (var i in objects) {
          var scaleX = objects[i].scaleX;
          var scaleY = objects[i].scaleY;
          var left = objects[i].left;
          var top = objects[i].top;
          
          var tempScaleX = scaleX * Whiteboard.SCALE_FACTOR;
          var tempScaleY = scaleY * Whiteboard.SCALE_FACTOR;
          var tempLeft = left * Whiteboard.SCALE_FACTOR;
          var tempTop = top * Whiteboard.SCALE_FACTOR;
          
          objects[i].scaleX = tempScaleX;
          objects[i].scaleY = tempScaleY;
          objects[i].left = tempLeft;
          objects[i].top = tempTop;
          
          objects[i].setCoords();
      }

  canvas.renderAll();
  Whiteboard.canvasScale *= Whiteboard.SCALE_FACTOR;
}

function zoomIn(canvas) {
var objects = canvas.getObjects();
      for (var i in objects) {
          var scaleX = objects[i].scaleX;
          var scaleY = objects[i].scaleY;
          var left = objects[i].left;
          var top = objects[i].top;
          
          var tempScaleX = scaleX / Whiteboard.SCALE_FACTOR;
          var tempScaleY = scaleY / Whiteboard.SCALE_FACTOR;
          var tempLeft = left / Whiteboard.SCALE_FACTOR;
          var tempTop = top / Whiteboard.SCALE_FACTOR;
          
          objects[i].scaleX = tempScaleX;
          objects[i].scaleY = tempScaleY;
          objects[i].left = tempLeft;
          objects[i].top = tempTop;
          
          objects[i].setCoords();
      }

  canvas.renderAll();
  Whiteboard.canvasScale /= Whiteboard.SCALE_FACTOR;

}

function defaultView(canvas) {
  if(Whiteboard.canvasScale === 1) return;
  else{
    var objects = canvas.getObjects();
      for (var i in objects) {
          var scaleX = objects[i].scaleX;
          var scaleY = objects[i].scaleY;
          var left = objects[i].left;
          var top = objects[i].top;
      
          var tempScaleX = scaleX * (1 / Whiteboard.canvasScale);
          var tempScaleY = scaleY * (1 / Whiteboard.canvasScale);
          var tempLeft = left * (1 / Whiteboard.canvasScale);
          var tempTop = top * (1 / Whiteboard.canvasScale);

          objects[i].scaleX = tempScaleX;
          objects[i].scaleY = tempScaleY;
          objects[i].left = tempLeft;
          objects[i].top = tempTop;

          objects[i].setCoords();
      }
          
      canvas.renderAll();
      Whiteboard.canvasScale = 1;
    }

}

function backToZoom(canvas) {

  var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
    
        var tempScaleX = scaleX * (Whiteboard.canvasScale);
        var tempScaleY = scaleY * (Whiteboard.canvasScale);
        var tempLeft = left * (Whiteboard.canvasScale);
        var tempTop = top * (Whiteboard.canvasScale);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }
        
    canvas.renderAll();
}

/*
function zoomOutFun() {
  var canvas = Whiteboard.canvas;
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
}*/
/*
function zoomInFun() {
  var canvas = Whiteboard.canvas;
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

}*/
/*

function resetZoomToDefaultFun() {

  var canvas = Whiteboard.canvas;
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


*/

/*
function resetDefaultToZoomFun() {

  var canvas = Whiteboard.canvas;
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
*/

function functErase()
{
	canvas.isDrawingMode = false;
	canvas.selection = true;

	canvas.on('object:selected', function(options) {
		if(options.target)
		{
			canvas.remove(canvas.getActiveObject());
		}

	});
	
}
