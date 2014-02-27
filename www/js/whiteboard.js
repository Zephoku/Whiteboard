$( document ).ready( function() {
  // Initialize Drawing Canvas
  Whiteboard.canvas = new fabric.Canvas('whiteboard');
  var canvas = Whiteboard.canvas;
  //yosh added:
  var stackErase = new Array();
  canvas.isDrawingMode = true;
  $('#title').text(Whiteboard.session);
  var sessionQuery = getURLParameter('session');
  if ( sessionQuery !== undefined ) {
    $('#title').text(sessionQuery);
    Whiteboard.session = sessionQuery;
    console.log(sessionQuery);
    Whiteboard.firebase = Whiteboard.firebase.root().child(Whiteboard.session);
    clearFun();
    initCanvas(Whiteboard.firebase, canvas);
  }

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
    Whiteboard.firebase.off("value");
    Whiteboard.firebase = Whiteboard.firebase.root().child(Whiteboard.session);
    clear(canvas);
    initCanvas(Whiteboard.firebase, canvas);

    // Remove old listerner
    // Update Canvas
    Whiteboard.firebase.on('value', function(snapshot) {
      updateCanvas(snapshot, canvas);
    });
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

  $('#select-on').click(function(){
    selectFun(canvas);
  });

  $('#draw-on').click(function(){
    drawFun(canvas);
  });

  $('#erase').click(function(){
  	functErase(canvas, stackErase);
  });

  $('#default-view').click(function(){
    defaultView(canvas);
  });

  $('#pan-down').click(function(){
    pan(canvas, 'down');
  });

  $('#pan-up').click(function(){
    pan(canvas, 'up');
  });

 $('#pan-left').click(function(){
    pan(canvas, 'left');
  });

  $('#pan-right').click(function(){
    pan(canvas, 'right');
  });

  $('#undo').click(function(){
    functUndo(canvas, stackErase);
  })

  // Pen size and color
  // Pulled from http://fabricjs.com/freedrawing/
  var drawingLineWidthE1 = document.getElementById("drawing-line-width");
  var drawingColorE1 = document.getElementById("drawing-color");

  drawingLineWidthE1.onchange = function() {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.previousSibling.innerHTML = this.value;
  }

  drawingColorE1.onchange = function() {
    canvas.freeDrawingBrush.color = this.value;
  }

  // Set defaults for pen size and color
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorE1.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthE1.value, 10) || 1;
  }

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

function pan(canvas, dir) {
  var objects = canvas.getObjects();

  var tempXOffset = 0;
  var tempYOffset = 0;

  switch (dir) {
      case 'up':
      tempXOffset = 0;
      tempYOffset = -5;
      break;
      case 'down':
      tempXOffset = 0;
      tempYOffset = 5;
      break;
      case 'left':
      tempXOffset = -5;
      tempYOffset = 0;
      break;
      case 'right':
      tempXOffset = 5;
      tempYOffset = 0;
      break;
  }

  for (var i in objects) {
  
      var left = objects[i].left;
      var top = objects[i].top;
  
      var tempLeft = left + tempXOffset;
      var tempTop = top + tempYOffset;

      objects[i].left = tempLeft;
      objects[i].top = tempTop;

      objects[i].setCoords();
  }

    canvas.renderAll();
    Whiteboard.xOffset += tempXOffset;
    Whiteboard.yOffset += tempYOffset;
}

function selectFun(canvas) {

  canvas.isDrawingMode = false;

  canvas.off('object:selected');

}

function drawFun(canvas) {

  canvas.isDrawingMode = true;
}

function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

//erase functionality implementation 
function functErase(canvas, stackErase)
{
	canvas.isDrawingMode = false;
	canvas.selection = true;

  //if multiple objects are selected before the erase button is clicked, then we want to erase those objects
  var multObj = canvas.getActiveGroup();

  if(multObj)
  {

    var multObjToPush = new Array();

    multObj.forEachObject(function (obj) {
      
      var toRemove = obj;
      multObjToPush.push(toRemove);
      canvas.remove(obj);
    });

    stackErase.push(multObjToPush);
    canvas.discardActiveGroup().renderAll();
  }

  //if just one object is selected before the erase button is clicked, then we want to erase only that object

  var oneObj = canvas.getActiveObject();

  if(oneObj)
  {
    var oneObjToPush = new Array();
    oneObjToPush.push(oneObj);
    stackErase.push(oneObjToPush);
    canvas.remove(oneObj);
    canvas.renderAll();
  }

  //if no object is selected prior to hitting the erase button, then delete what user clicks an object
	canvas.on('object:selected', function(options) {
		if(options.target)
		{
      var toRemove = canvas.getActiveObject();
      
      if(toRemove)
      {
        var oneObjToPush = new Array();
        oneObjToPush.push(toRemove);
        stackErase.push(oneObjToPush);
      }

			canvas.remove(canvas.getActiveObject());
      canvas.renderAll();
		}
	});
}

//undo-erase functionality implementation 
function functUndo(canvas, stackErase)
{
    canvas.isDrawingMode = false;
    var object = stackErase.pop();
    
    if(object)
    {
      var multObj = object.pop();
      while(multObj)
      {
        canvas.add(multObj).renderAll();
        multObj = object.pop();
      }
    }
}