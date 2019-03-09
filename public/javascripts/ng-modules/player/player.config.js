(function() {
  'use strict';

  angular
    .module('player')
    .config(playerConfig);

    playerConfig.$inject = ['$mdThemingProvider', '$locationProvider'];

    function playerConfig($mdThemingProvider, $locationProvider) {
      $locationProvider.html5Mode(true);

      $mdThemingProvider
        .theme('default')
        .primaryPalette('amber')
        .accentPalette('orange')
        .warnPalette('red')
        .backgroundPalette('grey')
        .dark();
      
      ////////END playerConfig////////
    }            
})();