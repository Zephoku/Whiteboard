var Whiteboard = {
  canvas: null,
  firebase: new Firebase('https://cs117whiteboard.firebaseio.com/Whiteboard'),
  session: 'Whiteboard',
  //constant scaling factor for zooming in/out
  SCALE_FACTOR: 0.5,
  //keeps track of current scale of canvas
  canvasScale: 1,

  xOffset: 0,
  yOffset: 0,
  hammertime: null,

  zoomMode: false,
  zoomFlag: false

};
