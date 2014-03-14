var whiteApp = angular.module('whiteParaApp', ['duParallax']);
whiteApp.controller('whiteParaCtrl', function($scope, parallaxHelper){
      $scope.asset1 = parallaxHelper.createAnimator(-0.1, 350, -150);
      $scope.asset2 = parallaxHelper.createAnimator(-0.4, 350, -150);
      $scope.asset3 = parallaxHelper.createAnimator(-0.3, 350, -150);
      $scope.background = parallaxHelper.createAnimator(-0.2, 350, -150);
    }
  );

