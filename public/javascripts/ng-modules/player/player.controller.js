(function() {
  'use strict';

  angular
    .module('player')
    .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['playerService', '$mdDialog', '$location'];

    function PlayerController(playerService, $mdDialog, $location) {
      let vm = this;
      let urlPath = $location.path().split('/');
      vm.room = urlPath[urlPath.indexOf('rooms') + 1];
      vm.playerList = [];

      activate();

      function activate() {
        playerService.getRoomPlayers(vm.room)
        .then(response => {
          let playerArray = response.players.map(player => {
            return playerService.getPlayerDetails(player);
          });
          return Promise.all(playerArray);
        })
        .then(playerDetails => vm.playerList = playerDetails)
        .catch(err => console.error(err));
      }

      vm.selectPlayer = function(playerID) {
        window.location.href = `/rooms/${vm.room}/player/${playerID}`;
      }

      vm.createPlayer = function() {
        console.log('Creating New Player');
      }

      vm.testSkullLord = function(ev) {
        $mdDialog.show(
          $mdDialog.prompt()
            .title(`Enter SKULL PIN for Room ${vm.room}`)
            .textContent(`Enter the SKULL PIN for Room ${vm.room} to conjure the SKULL LORD`)
            .placeholder(`PIN`)
            .ariaLabel(`Enter SKULL PIN for Room ${vm.room}`)
            .targetEvent(ev)
            .required(true)
            .parent(angular.element(document.querySelector(`body`)))
            .ok(`Confirm`)
            .cancel(`Cancel`)
        )
        .then(pin => {
          playerService.checkPIN(vm.room, pin)
          .then(response => {
            if (response.pin_match) {
              window.location.href = `/rooms/${vm.room}/skull-lord`;
            } else {
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector(`body`)))
                  .clickOutsideToClose(true)
                  .title(`Wrong PIN`)
                  .textContent(`The SKULL PIN you entered for Room ${vm.room} is incorrect.`)
                  .ariaLabel(`Wrong PIN`)
                  .ok("I'll try again")
              );
            }
          })
          .catch(err => console.error(err));
        }, function() {});

      }
      ////////END PlayerController////////
    }            
})();