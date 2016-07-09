/**
 * Created by Tyler on 7/5/2016.
 */
function MapFactory($http){
  var MapFactory = {};

  //Getting markers from arcgis api
  MapFactory.trackMarkers = [];

  MapFactory.getMarkers = function(userQuery){
    return $http
      .get('/trackmarkers', {params: userQuery})
      .then(function(response){
        //Copy arcgis api response to MapFactory
        angular.copy(response.data, MapFactory.trackMarkers);
        //If markers exist, remove all overlays currently on map
        markersArray.length && MapFactory.clearOverlays();
        MapFactory.placeMarkers();
      });
  };

  // variable map is available to many functions in MapFactory
  var map, markersArray = [];
  //Initialize google map and place on view
  MapFactory.initialize = function(latitude, longitude) {
    var centerLatLng = {lat: -41, lng: 173};

    if (!map) {
      map = new google.maps.Map(document.getElementById('map'), {
        center: centerLatLng,
        zoom: 6
      });
    }
  };

  //Clear markers currently displayed on map
  MapFactory.clearOverlays = function(){
    markersArray.forEach(function(item, index, array){
      item.setMap(null);
    });
    //Clears markersArray because the markers are no longer currently displayed
    markersArray = [];
  };

  //Place markers returned by the arcgis query
  MapFactory.placeMarkers = function(){
    //Place all of the trackMarkers on the map
    var currentInfoWindow, introduction,image, nonmatch =0;
    //Create markers and infoWindows
    MapFactory.trackMarkers.forEach(function(item, index, array){
      if(MapFactory.trackMarkers[index].attributes.hasOwnProperty('details')){
        introduction = MapFactory.trackMarkers[index].attributes.details.Introduction;
        image = "http://www.doc.govt.nz/"+MapFactory.trackMarkers[index].attributes.details.IntroductionThumbnail;
        staticLink = MapFactory.trackMarkers[index].attributes.details.StaticLink;
      }else{
        nonmatch++;
      }
      var infoContent = "<h5>"+MapFactory.trackMarkers[index].attributes.Name+"</h5>";
      infoContent += "<div style='display:flex'>";
      infoContent += "<div style='margin-right: 10px'>"
        + "<div>" + introduction + "</div>"
        + "<a href='" + staticLink + "'>See DOC page.</a>"
        + "</div>";
      infoContent += "<img style='float: right' src='"+image+"'/>";
      infoContent += "</div>";
      var infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });
      var marker = new google.maps.Marker({
        position: MapFactory.trackMarkers[index].geometry.paths,
        title: MapFactory.trackMarkers[index].attributes.Name
      });
      //Add click listener to place infoWindows
      marker.addListener('click', function(){
        currentInfoWindow && currentInfoWindow.close();
        currentInfoWindow = infoWindow;
        infoWindow.open(map, marker);
      });
      //Push markers to markersArray to allow them to be cleared before the next query
      markersArray.push(marker);
      //Place markers on the map
      marker.setMap(map);
    });
    console.log(nonmatch);
  };

  return MapFactory;
}

angular
  .module('app')
  .factory('MapFactory', MapFactory);