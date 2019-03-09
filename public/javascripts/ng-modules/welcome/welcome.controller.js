(function() {
  'use strict';

  angular
    .module('welcome')
    .controller('WelcomeController', WelcomeController);

    WelcomeController.$inject = ['welcomeService', '$mdDialog'];

    function WelcomeController(welcomeService, $mdDialog) {
      let vm = this;
      vm.roomID = ''
      vm.allRooms = [];

      vm.joinRoom = function () {
        if (vm.roomID) {
          return welcomeService.getRoom(vm.roomID)
            .then(room => {
              if (room) {
                window.location.href = `/rooms/${room._id}/players`;
              } else {
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#welcome')))
                    .clickOutsideToClose(true)
                    .title('Room does not exist')
                    .textContent('The room code you have entered does not exist.')
                    .ariaLabel('Room does not exist Alert')
                    .ok("I'll try again")
                );
              }

              return room;
            });
        }
      }

      vm.createRoom = function () {
        return welcomeService.createRoom()
          .then(room => {
            if (room) {
              window.location.href = `/rooms/${room._id}/skull-lord`;
            } else {
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#welcome')))
                  .clickOutsideToClose(true)
                  .title('Room could not be created')
                  .textContent('A room could not be created')
                  .ariaLabel('Room could not be created Alert')
                  .ok("Bummer")
              );
            }

            return room;
          });
      }

      vm.getAllRooms = function () {
        return welcomeService.getAllRooms()
          .then(rooms => {
            vm.allRooms = rooms;
            return vm.allRooms;
          });
      }

      vm.deleteRoom = function (ev, roomID) {
        $mdDialog.show(
          $mdDialog.prompt()
            .title(`Confirm deletion of Room ${roomID}`)
            .textContent(`To confirm that you want to delete Room ${roomID}, type the Room Code into the prompt below and press Delete.`)
            .placeholder(`Room Code`)
            .ariaLabel(`Confirm deletion of Room ${roomID}`)
            .initialValue(`Don't ruin other people's fun`)
            .targetEvent(ev)
            .required(true)
            .parent(angular.element(document.querySelector(`body`)))
            .ok(`Delete`)
            .cancel(`I've made a huge mistake`)
        ).then(function(result) {
          if (result === roomID) {
            welcomeService.deleteRoom(roomID)
              .then(response => {
                console.log(response);
                return vm.getAllRooms();
              })
          }
        }, function() {})
      }
      ////////END////////
    }
})();