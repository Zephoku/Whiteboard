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
  firebaseObjects.on('child_added', function(snapshot) {
    fab = snapshot.val();
    fab2 = new fabric.Path("", snapshot.val());
    canvas.add(new fabric.Path("", snapshot.val()));

  });

  canvas.on("mouse:up", function () {
    var canvasData = canvas.toJSON();
    fab3 = canvasData;
    firebase.update(canvasData);
  });

  

});
