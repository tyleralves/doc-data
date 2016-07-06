/**
 * Created by Tyler on 7/5/2016.
 */
function MapFactory($http){
  var MapFactory = {};

  //Getting markers from arcgis api
  MapFactory.trackMarkers = [];

  MapFactory.getMarkers = function(userQuery){
    console.log(userQuery);
    return $http
      .get('/trackmarkers', {params: userQuery})
      .then(function(response){
        angular.copy(response.data, MapFactory.trackMarkers);
        MapFactory.initialize();
      });
  };

  //Initialize google map
  MapFactory.initialize = function(latitude, longitude){
    var centerLatLng = { lat: -41, lng: 173 };

    if(!map){
      var map = new google.maps.Map(document.getElementById('map'), {
        center: centerLatLng,
        zoom: 6
      });
    }
    //Place all of the trackMarkers on the map
    var currentInfoWindow;
    MapFactory.trackMarkers.forEach(function(item, index, array){

      var infoContent = "<h5>"+MapFactory.trackMarkers[index].attributes.Name+"</h5>";
      infoContent += "<span>Description will be joined from: http://www.doc.govt.nz/api/profiles/tracks</span>";
      var infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });
      var marker = new google.maps.Marker({
        position: MapFactory.trackMarkers[index].geometry.paths,
        title: MapFactory.trackMarkers[index].attributes.Name
      });
      marker.addListener('click', function(){
        currentInfoWindow && currentInfoWindow.close();
        currentInfoWindow = infoWindow;
        infoWindow.open(map, marker);
      });
      marker.setMap(map);
    });
  };

  google.maps.event.addDomListener(window,'load', function(){
    MapFactory.initialize();
  });

  return MapFactory;
}

angular
  .module('app')
  .factory('MapFactory', MapFactory);