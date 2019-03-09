(function() {
  'use strict';

  angular
    .module('welcome')
    .config(welcomeConfig);

    welcomeConfig.$inject = ['$mdThemingProvider'];

    function welcomeConfig($mdThemingProvider) {
      $mdThemingProvider
        .theme('default')
        .primaryPalette('amber')
        .accentPalette('orange')
        .warnPalette('red')
        .backgroundPalette('grey')
        .dark();
      
      ////////END welcomeConfig////////
    }            
})();