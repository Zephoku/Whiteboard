var whiteboardApp = angular.module('whiteboardApp', ['firebase']);

whiteboardApp.controller('whiteboardCtrl', function($scope, $firebase, $window) {
  var SCREEN_RATIO = $window.innerHeight/$window.innerWidth;
  // Initalize Screen Dimensions
  $scope.canvasHeight =  $window.innerHeight - 80;
  $scope.canvasWidth = $window.innerWidth; 

  // Update Screen Dimensions
  $window.onresize = function () {
    Whiteboard.canvas.setHeight(SCREEN_RATIO * $window.innerWidth - 80);
    Whiteboard.canvas.setWidth($window.innerWidth);
  };

});
