/**
 * Created by Tyler on 7/5/2016.
 */
function MapFactory($http){
  var MapFactory = {};
  MapFactory.trackMarkers = [];

  MapFactory.getMarkers = function(userQuery){
    console.log(userQuery);
    return $http
      .get('/trackmarkers', {params: userQuery})
      .then(function(response){
        angular.copy(response.data, MapFactory.trackMarkers);
      });
  };

  return MapFactory;
}

angular
  .module('app')
  .factory('MapFactory', MapFactory);