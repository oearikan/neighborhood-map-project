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
}

var mapActions = {
//EA: This is to clear the existing map on first load
  clearMap: function() {
    mapActions.startMap();
  },

  startMap: function() {
    largeInfowindow = new google.maps.InfoWindow();
    for (var i = 0; i < model.teams.length; i++){
      model.teams[i].marker.setMap(map)
    }
  },

  populateInfoWindow: function(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }
}


// function createMarkers() {
//   var position,
//       title,
//       marker;
//   var largeInfowindow = new google.maps.InfoWindow();
//   for (var i = 0; i < locations.length; i++){
//     position = locations[i].geometry.location;
//     title = teams[i].name;
//     marker = new google.maps.Marker({
//         map:map,
//         position: position,
//         title: title,
//         animation: google.maps.Animation.DROP,
//         id: i,
//         icon: markerIcon
//       });
//     markers.push(marker);
//     marker.addListener('click', function() {
//       populateInfoWindow(this, largeInfowindow);
//     });
//  }
// }
// 
// function populateInfoWindow(marker, infowindow) {
//   // Check to make sure the infowindow is not already opened on this marker.
//   if (infowindow.marker != marker) {
//     infowindow.marker = marker;
//     infowindow.setContent('<div>' + marker.title + '</div>');
//     infowindow.open(map, marker);
//     // Make sure the marker property is cleared if the infowindow is closed.
//     infowindow.addListener('closeclick',function(){
//       infowindow.setMarker = null;
//     });
//   }
// }
//
// //EA: The handling of the list and filters with KO
// function AppViewModel() {
//   var self = this;
//   self.teamList = teams;
//   self.countrySelect = ['Scotland','Denmark', 'All'];
//   self.selectedCountryValue = ko.observable('All');
//   console.log(self.selectedCountryValue());
//   self.selectedCountryId = ko.computed(function(){
//     var id;
//     if(self.selectedCountryValue() === 'Scotland'){
//       id = 1161;
//     } else if (self.selectedCountryValue()==='Denmark') {
//       id = 320;
//     } else {
//       id = 0;
//     }
//     return id;
//   });
//   self.displayedTeamList = ko.computed(function(){
//     var list = [];
//     for(var i = 0; i < self.teamList.length; i++){
//       if(self.selectedCountryId() === self.teamList[i].country_id) {
//         list.push(self.teamList[i].name);
//       } else if (self.selectedCountryId() === 0) {
//         list.push(self.teamList[i].name);
//       }
//     }
//     return list;
//   });
// }
//
// ko.applyBindings(new AppViewModel());
