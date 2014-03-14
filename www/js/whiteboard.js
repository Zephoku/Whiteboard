$( document ).ready( function() {
  // Initialize Drawing Canvas
  Whiteboard.canvas = new fabric.Canvas('whiteboard', {
    backgroundColor: '#ffffff'
  });
  var canvas = Whiteboard.canvas;
  canvas.renderAll();
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
  updateOnEvent('mouse:up', Whiteboard.firebase, canvas);
  
  // Create New Rooms
  $('#sessionSubmit').click(function() {
    Whiteboard.session = $('#sessionId').val();
    $('#sessionId').val('');
    if ( Whiteboard.session === '' ) {
        Whiteboard.session = 'Whiteboard';
    }
    $('#title').text(Whiteboard.session);

    // Remove old listerner
    Whiteboard.firebase.off("value");
    Whiteboard.canvas.off();
    
    Whiteboard.firebase = Whiteboard.firebase.root().child(Whiteboard.session);
    clear(canvas);
    initCanvas(Whiteboard.firebase, canvas);


    // Update Firebase
    updateOnEvent('mouse:up', Whiteboard.firebase, canvas);

    // Update Canvas
    Whiteboard.firebase.on('value', function(snapshot) {
      updateCanvas(snapshot, canvas);
    });

  });

  //set handle for clear-canvas button
  $('#clear-canvas').click(function(){
    clearAndUpdate(Whiteboard.firebase, canvas);
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
    Whiteboard.zoomMode= false;
    Whiteboard.zoomFlag = false;
    selectFun(canvas);
  });

  $('#draw-on').click(function(){
    Whiteboard.zoomMode = false;
    Whiteboard.zoomFlag = false;
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
  });

  $('#zoom-mode').click(function(){
    Whiteboard.zoomFlag = true;
    zoomMode(canvas);
  });

  $('#img-download').click(function(){
    imgDownload(canvas);
  });

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

  // Text
  // Font size is default = 40
  var textSize_input = document.getElementById("text-size");
  var textSize = textSize_input.value;

  textSize_input.onchange = function() {
    textSize = this.value;
    this.previousSibling.previousSibling.innerHTML = this.value;
  }

  $('#add-text').click(function(){

    // Get font
    var font_menu = document.getElementById("font_name");
    var font = font_menu.options[font_menu.selectedIndex].text;

    // Check font color
    var textColor = document.getElementById("text-color").value;

    // Check to see if font should be Bolded, Italicized, or Underlined
    var textBold = 'normal';
    if (document.getElementById("bold_text").checked) {
      textBold = 'bold';
    }
    var textItalicize = '';
    if (document.getElementById("italic_text").checked) {
      textItalicize = "italic";
    }
    var textUnderline = '';
    if (document.getElementById("underline_text").checked) {
      textUnderline = 'underline';
    }

    var inputText = document.getElementById("input-text").value;
    canvas.add(new fabric.Text(inputText, { 
      fontSize: textSize,
      fill: textColor,
      fontWeight: textBold,
      fontStyle: textItalicize,
      textDecoration: textUnderline,
      fontFamily: font,
      left: 100, 
      top: 100 
    }));
    canvas.renderAll();
    updateFirebase(Whiteboard.firebase, canvas);

    // Clear Text input for future use
    document.getElementById("input-text").value = '';
  });
});


function initializeHammer(canvas) {
  var zoomwrapper = document.getElementById("zoomwrapper");

    Hammer(zoomwrapper).on("dragright", function() {
        if(Whiteboard.zoomMode) panTouch(canvas, 5, 0);
    });

    Hammer(zoomwrapper).on("dragleft", function() {
        if(Whiteboard.zoomMode) panTouch(canvas, -5, 0);
    });

    Hammer(zoomwrapper).on("dragdown", function() {
        if(Whiteboard.zoomMode) panTouch(canvas, 0, 5);
    });

    Hammer(zoomwrapper).on("dragup", function() {
        if(Whiteboard.zoomMode) panTouch(canvas, 0, -5);
    });

    Hammer(zoomwrapper).on("pinchout", function() {
       if(Whiteboard.zoomMode) pinchZoomIn(canvas, .98);
       console.log("pinch in");
    });

    Hammer(zoomwrapper).on("pinchin", function() {
        if(Whiteboard.zoomMode) pinchZoomOut(canvas, .98);
        console.log("pinch out");
    });

}

function zoomMode(canvas) {
  Whiteboard.zoomMode = true;
  canvas.isDrawingMode = false;
  canvas.selection = false;
  var objects = canvas.getObjects();

  canvas.forEachObject(function(o) {
    o.selectable = false;
  });

  //canvas.off('object:selected');

  initializeHammer(canvas);

}


function initCanvas(firebase, canvas) {
  firebase.once('value', function(data) {
    canvas.loadFromJSON(data.val());
    backToZoom(canvas);
    canvas.renderAll();
  });
}

function updateCanvas(snapshot, canvas) {
    canvas.loadFromJSON(snapshot.val());
    backToZoom(canvas);
    //if(Whiteboard.zoomFlag) {
    panTouchWithoutRender(canvas, Whiteboard.xOffset, Whiteboard.yOffset);
  
     // Whiteboard.zoomFlag = false;
 //  }
    canvas.renderAll();
}


function updateFirebase(firebase, canvas) {
    scaleToDefaultView(canvas);
    var canvasData = JSON.stringify(canvas);
    firebase.set(canvasData);
}

function removePathFill(canvasData) {
  var path;
  for(path in canvasData.objects ) {
    canvasData.objects[path].fill = false;
  }
  return canvasData;
}

function clearAndUpdate(firebase, canvas) {
  canvas.clear();
  updateFirebase(firebase, canvas);
}

function clear(canvas){
  canvas.clear();
}

function pinchZoomOut(canvas, factor) {
  var objects = canvas.getObjects();
      for (var i in objects) {
          var scaleX = objects[i].scaleX;
          var scaleY = objects[i].scaleY;
          var left = objects[i].left;
          var top = objects[i].top;
          
          var tempScaleX = scaleX * factor;
          var tempScaleY = scaleY * factor;
          var tempLeft = left * factor;
          var tempTop = top * factor;
          
          objects[i].scaleX = tempScaleX;
          objects[i].scaleY = tempScaleY;
          objects[i].left = tempLeft;
          objects[i].top = tempTop;
          
          objects[i].setCoords();
      }

  canvas.renderAll();
  Whiteboard.canvasScale *= factor;
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

function pinchZoomIn(canvas, factor) {
var objects = canvas.getObjects();
      for (var i in objects) {
          var scaleX = objects[i].scaleX;
          var scaleY = objects[i].scaleY;
          var left = objects[i].left;
          var top = objects[i].top;
          
          var tempScaleX = scaleX / factor;
          var tempScaleY = scaleY / factor;
          var tempLeft = left / factor;
          var tempTop = top / factor;
          
          objects[i].scaleX = tempScaleX;
          objects[i].scaleY = tempScaleY;
          objects[i].left = tempLeft;
          objects[i].top = tempTop;
          
          objects[i].setCoords();
      }

  canvas.renderAll();
  Whiteboard.canvasScale /= factor;

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

function scaleToDefaultView(canvas) {
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
    }

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

function panTouch(canvas, xOffset, yOffset) {
  var objects = canvas.getObjects();

 // xOffset /= Whiteboard.canvasScale;
  //yOffset /= Whiteboard.canvasScale;

  for (var i in objects) {
  
      var left = objects[i].left;
      var top = objects[i].top;
  
      var tempLeft = left + xOffset;
      var tempTop = top + yOffset;

      objects[i].left = tempLeft;
      objects[i].top = tempTop;

      objects[i].setCoords();
  }

    canvas.renderAll();

    Whiteboard.xOffset += xOffset;
    Whiteboard.yOffset += yOffset;
    //Whiteboard.zoomFlag = true;
    //console.log("Current x & y offset: " + Whiteboard.xOffset + " " + Whiteboard.yOffset);
}



function panTouchWithoutRender(canvas, xOffset, yOffset) {
  var objects = canvas.getObjects();

 // xOffset /= Whiteboard.canvasScale;
  //yOffset /= Whiteboard.canvasScale;

  for (var i in objects) {
  
      var left = objects[i].left;
      var top = objects[i].top;
  
      var tempLeft = left + xOffset;
      var tempTop = top + yOffset;

      objects[i].left = tempLeft;
      objects[i].top = tempTop;

      objects[i].setCoords();
  }
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

  canvas.forEachObject(function(o) {
    o.selectable = true;
  });


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

//called on mouse up
function updateOnEvent(eventName, firebase, canvas) {
  canvas.on(eventName, function() {
    //panTouchWithoutRender(canvas, Whiteboard.xOffset * (-1), Whiteboard.yOffset*(-1));
    console.log("Zoomflag: " + Whiteboard.zoomFlag);
    if(!Whiteboard.zoomFlag){ 
      panTouchWithoutRender(canvas, Whiteboard.xOffset * (-1), Whiteboard.yOffset*(-1));
      updateFirebase(firebase, canvas);
    }

    //if(Whiteboard.zoomFlag) {
    //  panTouchWithoutRender(canvas, Whiteboard.xOffset, Whiteboard.yOffset);
    //}
    //canvas.renderAll();
  });
}


// Sets the canvas in select mode
function selectFun() {
  var canvas = Whiteboard.canvas;
  canvas.isDrawingMode = false;
}

// Sets the canvas in drawing mode
function drawFun() {
  var canvas = Whiteboard.canvas;
  canvas.isDrawingMode = true;
}

// Takes a snapshot of the current canvas and begins download as a png image
function imgDownload(canvas) {

  var url = canvas.toDataURL({
    format: 'png',
    multiplier: 1
  });
  var name = Whiteboard.session + '.png';
  $('<a>').attr({href:url, download:name})[0].click();
}
