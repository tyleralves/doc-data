/**
 * Created by Tyler on 7/5/2016.
 */
function MapController(MapFactory){
  var ctrl = this;
  ctrl.message = 'Loading';
  ctrl.userQuery = {text: 'water'};
  ctrl.getMarkers = function(){
    ctrl.message = 'Loading';
    MapFactory.getMarkers(ctrl.userQuery)
      .then(function(){
      ctrl.message = false;
    });
  };
  
  
  MapFactory.getMarkers(ctrl.userQuery)
    .then(function(){
      ctrl.message = false;
    });
  MapFactory.initialize();
  
}

angular
  .module('app')
  .controller('MapController', MapController);