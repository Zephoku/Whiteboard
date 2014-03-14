var firebase = new Firebase('https://cs117whiteboard.firebaseio.com');
var canvasData = canvas.toJSON();
firebase.set(canvasData);

dataRef.on('value', function(snapshot) {
    canvas.loadFromJSON(snapshot);
});
