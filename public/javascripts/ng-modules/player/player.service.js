(function() {
  'use strict';

  angular
    .module('player')
    .factory('playerService', playerService);

    playerService.$inject = ['$http'];

    function playerService($http) {
      return {
        getRoomPlayers,
        getPlayerDetails,
        checkPIN
      }

      function getRoomPlayers(room) {
        return $http.get(`/api/rooms/${room}/players`)
          .then(getRoomPlayersComplete)
          .catch(getRoomPlayersFailed);

          function getRoomPlayersComplete(response) {
            return response.data;
          }

          function getRoomPlayersFailed(err) {
            console.error(err);
          }
      }

      function getPlayerDetails(player) {
        return $http.get(`/api/players/${player}`)
          .then(getPlayerDetailsComplete)
          .catch(getPlayerDetailsFailed);

          function getPlayerDetailsComplete(response) {
            return response.data;
          }

          function getPlayerDetailsFailed(err) {
            console.error(err);
          }
      }

      function checkPIN(room, pin) {
        return $http.get(`/api/rooms/${room}/checkPIN`, { params: { pin } })
          .then(checkPINComplete)
          .catch(checkPINFailed);

          function checkPINComplete(response) {
            return response.data;
          }

          function checkPINFailed(err) {
            console.error(err);
          }
      }
      ////////END playerService////////
    }            
})();