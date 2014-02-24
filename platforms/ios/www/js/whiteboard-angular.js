var whiteboardApp = angular.module('whiteboardApp', ['firebase']);

whiteboardApp.controller('whiteboardCtrl', function($scope, $firebase, $window) {
  var SCREEN_RATIO = $window.innerHeight/$window.innerWidth;
  $scope.canvasHeight =  $window.innerHeight;
  $scope.canvasWidth = $window.innerWidth; 

  $window.onresize = function () {
    Whiteboard.canvas.setHeight(SCREEN_RATIO * $window.innerWidth);
    Whiteboard.canvas.setWidth($window.innerWidth);
  };

});
