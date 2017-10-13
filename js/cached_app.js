var map;
var largeInfowindow;

//I use this initial map just to avoid blank screen if the data loading process takes a while. Once it's done I call my mapActions.startMap method to overtake.
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 56.46249, lng: 3.427734},
    zoom: 6,
    styles: styles,
    disableDefaultUI: true
  });
  largeInfowindow = new google.maps.InfoWindow();
  createMarkers();
}

function createMarkers() {
    var markerPosition,
        markerTitle,
        theMarker;
    for(var i = 0; i < teams.length; i++){
      markerPosition = teams[i].venue.locations.geometry.location;
      markerTitle = teams[i].name;
      theMarker = new google.maps.Marker({
        position: markerPosition,
        title: markerTitle,
        animation: google.maps.Animation.DROP,
        id: i,
        icon: markerIcon,
      });
      teams[i].marker = theMarker;
      teams[i].marker.logo = teams[i].logo_path;
      teams[i].marker.image = teams[i].venue.data.image_path;
      teams[i].marker.teamID = teams[i].id;
      teams[i].marker.setMap(map);
      teams[i].marker.addListener('click', function(){
        populateInfoWindow(this, largeInfowindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        stopBounce(this);
        // fetchScores(this);
      });
  }
}

function populateInfoWindow(marker, infowindow) {
  var contentString = '<div><h1 align="center">' + marker.title + '</h1></div>' + '<img src="' + marker.logo + '" alt="team_logo">';
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

function stopBounce(marker) {
  setTimeout(function () {
    marker.setAnimation(null);
  }, 1500);
}

// function fetchScores (marker) {
//   $.ajax({
//     url: "https://soccer.sportmonks.com/api/v2.0/teams/" + marker.teamID +  "?api_token=NaFzexS4PTnt7nRIK8QErXP7XRjz0y1yUjqWNIBUy2Qm5mvwaHRy1YRNw2hR&include=localResults",
//     success: [function(resp){
//       console.log(marker.teamID);
//       console.log(resp.data);
//     }],
//     error: function(err){
//       console.log(err);
//     }
//   });
// }

function aVM() {
  var self = this;

  self.countrySelect = ['Scotland','Denmark', 'All'];
  self.selectedCountryValue = ko.observable('All')
  self.selectedCountryId = ko.computed(function(){
    var id;
    if(self.selectedCountryValue() === 'Scotland'){
      id = 1161;
      // self.map.panTo({lat:56.686408, lng: -4.01001})
    } else if (self.selectedCountryValue() ==='Denmark') {
      id = 320;
      // self.map.panTo({lat:55.986092, lng: 9.481201})
    } else {
      id = 0;
      // self.map.panTo({lat: 56.46249, lng: 3.427734})
    }
    return id;
  });
  self.teamList = ko.computed(function(){
    var list = [];
    for(var i = 0; i < teams.length; i++){
      if(self.selectedCountryId() === teams[i].country_id){
        list.push(teams[i].name);
      } else if (self.selectedCountryId() === 0) {
        list.push(teams[i].name);
      }
    }
    return list;
  });
}

ko.applyBindings(new aVM());
