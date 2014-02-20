var canvas;
var fab;
var fab2;
var fab3;
var firebase = new Firebase('https://cs117whiteboard.firebaseio.com');
var firebaseObjects = new Firebase('https://cs117whiteboard.firebaseio.com/objects');

$( document ).ready( function() {
  // Initialize Drawing Canvas
  canvas = this.__canvas = new fabric.Canvas('whiteboard');
  canvas.isDrawingMode = true;

  // Set Pen Options
  canvas.freeDrawingBrush.color = '#000';
  canvas.freeDrawingLineWidth = 10;


  firebase.on('value', function(snapshot) {
    //fab = snapshot.val();
    //fab2 = new fabric.Path([], snapshot.val());
    //console.log(fab2);
    fab2 = snapshot.val().objects;
    canvas.loadFromJSON(snapshot.val());
    canvas.renderAll();
  });

  canvas.on("mouse:up", function () {
    var canvasData = canvas.toJSON();
    canvasData = removePathFill(canvasData);
    firebase.set(canvasData);
  });

  function removePathFill(canvasData) {
    var path;
    for(path in canvasData.objects ) {
      console.log(canvasData.objects[path]);
      canvasData.objects[path].fill = false;
    }
    return canvasData;
  }

  

});
