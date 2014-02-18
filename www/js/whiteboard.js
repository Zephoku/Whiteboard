var canvas;
$( document ).ready( function() {
  // Initialize Drawing Canvas
  canvas = new fabric.Canvas('whiteboard');
  canvas.isDrawingMode = true;

  // Set Pen Options
  canvas.freeDrawingBrush.color = '#000';
  canvas.freeDrawingLineWidth = 10;
});


function clearFun() {
	canvas.clear();
}
