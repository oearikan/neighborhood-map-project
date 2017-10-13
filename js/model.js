//EA:fetch and parse my model(data) for the app
var model = {
//EA: All relevant data will eventually be stored in this array.
	teams: [],

//EA: Fetching cascade begins with fetching football teams of Scotland.
	init: function(){
		model.fetchScotland();
	},

//EA: I intend to use this function to push the response of the server into my teams array, which is essentially my model (data).
	callback: function(response) {
		for(var i=0; i<response.data.length;i++){
			model.teams.push(response.data[i]);
		}
	},

//EA:  jQuery's .ajax method permits to bind multiple functions in an array to the successful return of the request. This allows me to populate my teams array, which is basically my model(data) in succesion. See how fetchDenmark method is following the callback call.
	fetchScotland: function() {
		$.ajax({
			url: "https://soccer.sportmonks.com/api/v2.0/teams/season/7953?api_token=NaFzexS4PTnt7nRIK8QErXP7XRjz0y1yUjqWNIBUy2Qm5mvwaHRy1YRNw2hR&include=venue",
			success: [function(resp){
				model.callback(resp);
			}, function(){
				return model.fetchDenmark();
			}],
			error: function(){
				errorHandlers.errScotland();
			}
		});
	},

//EA: Fetch the team information for Denmark Superliga teams and push them into my model. Next up, use the part of returned data (namely the properties of venue.data portion of the response) to query the geoCoder API of google, in order to get my marker locations. I call the 'function name here' function to the success state of this ajax call.
	fetchDenmark: function() {
		$.ajax({
			url: "https://soccer.sportmonks.com/api/v2.0/teams/season/6361?api_token=NaFzexS4PTnt7nRIK8QErXP7XRjz0y1yUjqWNIBUy2Qm5mvwaHRy1YRNw2hR&include=venue",
			success: [function(resp){
				model.callback(resp);
			}, function(){
				return model.getMarkerLocations();
			}],
			error: function(){
				errorHandlers.errDenmark();
			}
		});
	},

//EA: I use this function to get the lat-lng info for the home venues of the teams that's been fetched before. I want to add locations as a property (key) to my array of team objects and I want the correct lat long be appended to each team. Therefore I set the 'async' property of the request to false, which is not quite optimal. I'd appreciate if you could suggest an alternative.(When I do the request async, I cannot assure matching locations for the teams)
	getMarkerLocations: function() {
		var geocoderUrl = "https://maps.googleapis.com/maps/api/geocode/json?&address=";
		var googleApiKey = "&key=AIzaSyDlwjpuXkYPyLd6xiHyuwASmB3Ds01P9wc";
		console.log(Date.now());
		for(var i = 0; i < model.teams.length; i++){
			$.ajax({
				url: geocoderUrl + model.teams[i].venue.data.name + ", " + model.teams[i].venue.data.address + ", " + model.teams[i].venue.data.city + googleApiKey,
				async: false,
				success: [function(resp){
					model.teams[i].venue.locations = resp.results[0];
				}],
				error: function() {
					errorHandlers.errGeocoder();
				}
			});
		}
		model.createMarkers();
		console.log(Date.now());
//EA: I log times before and after the looped ajax request to calculate the cost of the 'async: false' and it turns out to be between 3 secs to 15 secs depending on what have you.
	},

//EA: This method appends to my data array (i.e. model.teams) the marker objects.
	createMarkers: function(){
		var markerPosition,
				markerTitle,
				theMarker;
		for(var i = 0; i < model.teams.length; i++){
			markerPosition = model.teams[i].venue.locations.geometry.location;
			markerTitle = model.teams[i].name;
			theMarker = new google.maps.Marker({
	      position: markerPosition,
	      title: markerTitle,
	      animation: google.maps.Animation.DROP,
	      id: i,
	      icon: markerIcon
	    });
			model.teams[i].marker = theMarker;
			model.teams[i].marker.addListener('click', function(){
				mapActions.populateInfoWindow(this, largeInfowindow);
			})
		}
		mapActions.clearMap();
	}
};

//EA: I collect the error alerts in an errorHandlers object and define specific error cases as properties of this object. Then call them where appropriate. This way the user will know which specific part of the app went wrong.
var errorHandlers = {
	errScotland: function() {
		alert("Failed to retrieve Scotland teams. Try refreshing the page, else come back later when service is available.");
	},

	errDenmark: function() {
		alert("Failed to retrieve Denmark teams. Try refreshing the page, else come back later when service is available.");
	},

	errGeocoder: function() {
		alert("Your stadium addresses could not be converted to map locations. This is possibly due to geocoding api being down. Try to refresh, if that doesn't help, come back later.");
	},

	errGoogleMaps: function() {
		alert('Failed to fetch map from Google. Please refresh the page, else check your internet connection.');
	}
};

//This model.init() starts the data fetching cascade
model.init();
