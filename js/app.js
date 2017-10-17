var map,
    largeInfowindow,
    bounds;
//EA: I comment in or out depending on whether I'm using the cached version of the model. Geocoder api has 2500 req/day.
var teams = model.teams;

//EA: I place a little delay here on start because when I don't, my data array is not ready in time for render and first load doesn't show anything on List view ('All filter'). Can you please tip me on a more elegant way to handle this? Naturally, I don't have this problem when I'm using the cached_data file.
function start () {
    var menu = document.querySelector('#menu');
    var main = document.querySelector('main');
    var drawer = document.querySelector('#drawer');

    menu.addEventListener('click', function(e) {
    drawer.classList.toggle('open');
    e.stopPropagation();
  });
    main.addEventListener('click', function() {
    drawer.classList.remove('open');
  });
  setTimeout(function() {
    initMap();
  }, 5000);
}

function initMap () {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 56.46249, lng: 3.427734},
    zoom: 6,
    // styles: styles,
    disableDefaultUI: true
  });
  bounds = new google.maps.LatLngBounds();
  largeInfowindow = new google.maps.InfoWindow();
  var centerAll = new google.maps.LatLng({lat: 56.46249, lng: 3.427734});
  var centerSct = new google.maps.LatLng({lat:56.686408, lng: -4.01001});
  var centerDnk = new google.maps.LatLng({lat:55.986092, lng: 9.481201});

//EA: This is to keep my center 'centered' when the window resizes.see (https://stackoverflow.com/questions/18444161/google-maps-responsive-resize)
  google.maps.event.addDomListener(window, "resize", function(){
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });

//EA: I opted to create my view model inside the initMap function
  function aVM(teams){
    var self = this;

    self.showMenu = ko.observable(false);

//EA: This is basically my filter functionality
    self.countrySelect = ['Scotland','Denmark', 'All'];
    self.selectedCountryValue = ko.observable('All');
    self.teamList = ko.observableArray();

//EA: Use the id to match the teams to country, and create a set of markers specific to that country
    self.selectedCountryId = ko.computed(function(){
      var id;
      var x = self.selectedCountryValue();
      if(x === 'Scotland'){
        id = 1161;
      } else if (x ==='Denmark') {
        id = 320;
      } else {
        id = 0;
      }
      setFilterView(self.selectedCountryValue());
      updateList(id);
    });

    self.setClick = function(value){
      populateInfoWindow(value.marker, largeInfowindow);
      value.marker.setAnimation(google.maps.Animation.BOUNCE);
      stopBounce(value.marker);
      bringToCenter(value.marker);
    };

//EA: Country id's are used to update the team list array, which is an observable.
    function updateList(id) {
      if(id !== 0){
        var a = teams.filter(function(item){
        return item.country_id === id;
      });
      self.teamList(a);
      } else {
        self.teamList(teams);
      }
      createMarkers(self.teamList());
    }

//EA: Whenever the user makes a selection using the country filter, the center of the map and the zoom level adjusts to match the selection. However I feel this could be done more elegantly by using methods of LatLng or the Map class maybe. If that's the case can you please tip me on that?
    function setFilterView(selection){
      resetMarkers(self.teamList());
      if(selection === 'All'){
        map.setZoom(4);
        map.setCenter(centerAll);
      } else if (selection === 'Scotland') {
        map.setZoom(6);
        map.setCenter(centerSct);
      } else {
        map.setZoom(6);
        map.setCenter(centerDnk);
      }
    }
  }
  ko.applyBindings(new aVM(teams));
}

//EA: My markers are re-created every time the country filter is changed.
function createMarkers(array) {
    var markerPosition,
        markerTitle,
        theMarker;
    for(var i = 0; i < array.length; i++){
      markerPosition = array[i].venue.locations.geometry.location;
      markerTitle = array[i].name;
      theMarker = new google.maps.Marker({
        position: markerPosition,
        title: markerTitle,
        animation: google.maps.Animation.DROP,
        id: i,
        icon: markerIcon,
      });
      array[i].marker = theMarker;
      array[i].marker.logo = array[i].logo_path;
      array[i].marker.image = array[i].venue.data.image_path;
      array[i].marker.teamID = array[i].id;
      array[i].marker.setMap(map);
      bounds.extend(theMarker.position);
      array[i].marker.addListener('click', avoidJSHint);
  }
}

var avoidJSHint = function(){
  populateInfoWindow(this, largeInfowindow);
  this.setAnimation(google.maps.Animation.BOUNCE);
  stopBounce(this);
  // bringToCenter(marker);
};

function populateInfoWindow(marker, infowindow) {
  var contentString = '<div><h1 align="center">' + marker.title + '</h1></div>' + '<img src="' + marker.logo + '" alt="team_logo" align="middle">';
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + contentString + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}
//EA: Then names of the below functions are self explanatory. I have this weird feeling that what I've achieved with those could have been realized much more elegantly. Any tips in that direction is well appreciated.
function stopBounce(marker) {
  setTimeout(function () {
    marker.setAnimation(null);
  }, 1500);
}

function resetMarkers (array) {
  array.forEach(function(item){
    if(item.marker) {
      item.marker.setMap(null);
    }
  });
}

function bringToCenter (marker){
  map.setCenter(marker.position);
  map.setZoom(15);
}
