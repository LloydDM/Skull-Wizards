(function() {
  'use strict';

  angular
    .module('welcome')
    .factory('welcomeService', welcomeService);

    welcomeService.$inject = ['$http'];

    function welcomeService($http) {
      return {
        getRoom: getRoom,
        createRoom: createRoom,
        getAllRooms: getAllRooms,
        deleteRoom: deleteRoom
      }

      function getRoom(roomID) {
        return $http.get(`/api/rooms/${roomID}`)
          .then(getRoomComplete)
          .catch(getRoomFailed);

          function getRoomComplete(response) {
            return response.data;
          }

          function getRoomFailed(err) {
            console.error(err);
          }
      }

      function createRoom() {
        return $http.post(`/api/rooms/`)
          .then(createRoomComplete)
          .catch(createRoomFailed);

          function createRoomComplete(response) {
            return response.data;
          }

          function createRoomFailed(err) {
            console.error(err);
          }
      }

      function getAllRooms() {
        return $http.get(`/api/rooms/welcomeList`)
          .then(getAllRoomsComplete)
          .catch(getAllRoomsFailed);

          function getAllRoomsComplete(response) {
            return response.data;
          }

          function getAllRoomsFailed(err) {
            console.error(err);
          }
      }

      function deleteRoom(roomID) {
        return $http.delete(`/api/rooms/${roomID}`)
          .then(deleteRoomComplete)
          .catch(deleteRoomFailed);

          function deleteRoomComplete(response) {
            return response.data;
          }

          function deleteRoomFailed(err) {
            console.error(err);
          }
      }
      ////////END////////
    }
            
})();