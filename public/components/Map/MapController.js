/**
 * Created by Tyler on 7/5/2016.
 */
function MapController(uiGmapGoogleMapApi, MapFactory){
  var ctrl = this;
  ctrl.message = 'Loading';
  ctrl.userQuery = {text: 'water'};
  ctrl.getMarkers = function(){
    MapFactory.getMarkers(ctrl.userQuery);
  };
  
  MapFactory.getMarkers(ctrl.userQuery)
    .then(function(){
      ctrl.message = false;
    });
  
  ctrl.tracks = MapFactory.trackMarkers;
  
  ctrl.map = { center: { latitude: -41, longitude: 173 }, zoom: 6 };
  ctrl.markers = {
    coords: {
      latitude: 45,
      longitude: -73
    }
  };

  
  uiGmapGoogleMapApi.then(function(maps){

  });
}

angular
  .module('app')
  .controller('MapController', MapController);