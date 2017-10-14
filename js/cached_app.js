var map;
var largeInfowindow;
var centerAll,
    centerSct,
    centerDnk;

//I use this initial map just to avoid blank screen if the data loading process takes a while. Once it's done I call my mapActions.startMap method to overtake.
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 56.46249, lng: 3.427734},
    zoom: 6,
    // styles: styles,
    disableDefaultUI: true
  });
  largeInfowindow = new google.maps.InfoWindow();
  centerAll = new google.maps.LatLng({lat: 56.46249, lng: 3.427734});
  centerSct = new google.maps.LatLng({lat:56.686408, lng: -4.01001});
  centerDnk = new google.maps.LatLng({lat:55.986092, lng: 9.481201});


  function aVM() {
    var self = this;

    self.countrySelect = ['Scotland','Denmark', 'All'];
    self.selectedCountryValue = ko.observable('All');
    self.teamList = ko.observableArray([]);

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
    }

    function setFilterView(x) {
      resetMarkers(self.teamList());
        if(x==='All'){
          map.setCenter(centerAll)
          map.setZoom(6)
        } else if (x==='Scotland') {
          map.setCenter(centerSct)
          map.setZoom(7)
        } else {
          map.setCenter(centerDnk)
          map.setZoom(8)
        }
      }

    function updateList(x) {
      if(!(x===0)){var a = teams.filter(function(item){
        return item.country_id === x;
      });
      self.teamList(a);
      } else {
        self.teamList(teams);
      }
      createMarkers(self.teamList());
    }
}

  ko.applyBindings(new aVM());
}

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
      array[i].marker.setMap(map)
      array[i].marker.addListener('click', function(){
        populateInfoWindow(this, largeInfowindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        stopBounce(this);
        bringToCenter(this);
      });
  }
}

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

function bringToCenter (marker){
  map.setCenter(marker.position)
  map.setZoom(15)
}

function stopBounce(marker) {
  setTimeout(function () {
    marker.setAnimation(null);
  }, 1500);
}

function resetMarkers (array) {
  array.forEach(function(item){
    if(item.marker) {item.marker.setMap(null)}
  });
}
