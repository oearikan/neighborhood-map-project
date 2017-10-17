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

//EA: Return of the fetchScotland and fetchDenmark requests contain a venue property which holds the address for the team's stadium. I use this address bits as an input to Google Geocoder API to retrieve marker locaitons (latlngs). However, I need an intermediary function to match the response from the geocoder API to the teams in my fetched list. Since the request is asyncronous, when I simply push the response from the geocoder, the locations end up attaching to wrong teams. I first tried async:false call, which solved the mismatch issue but this turned out to be horrible as I got 15-20 second wait times. Finally I ended using this intermediary fuction. I provide the name of the team as an input to the function which request the marker locations, then use this input as a comparing item to ensure the returned marker in fact belongs the team with the provided name. (You'll probably laugh but I felt so proud of myself after coming up with this solution!! =)
//Still open for sugestions if there is a more elegant way to handle this!
	matchNamesWithLocations: function() {
		var teamName,
				name,
				address,
				city;
		for(var i = 0; i < model.teams.length; i++){
			teamName = model.teams[i].name;
			name = model.teams[i].venue.data.name;
			address = model.teams[i].venue.data.address;
			city = model.teams[i].venue.data.city;
		model.getMarkerLocations(teamName, name, address, city);
		}
	},

//EA:  jQuery's .ajax method permits to bind multiple functions in an array to the successful return of the request. This allows me to populate my teams array, which is basically my model(data) in succesion. See how fetchDenmark method is following the callback call.
	fetchScotland: function() {
		$.ajax({
			url: "https://soccer.sportmonks.com/api/v2.0/teams/season/7953?api_token=NaFzexS4PTnt7nRIK8QErXP7XRjz0y1yUjqWNIBUy2Qm5mvwaHRy1YRNw2hR&include=venue",
			success: [function(resp){
				model.callback(resp);
			}, function(){
				model.fetchDenmark();
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
				model.matchNamesWithLocations();
			}],
			error: function(){
				errorHandlers.errDenmark();
			}
		});
	},

//EA: I use this function to get the lat-lng info for the home venues of the teams that's been fetched before. I want to add locations as a property (key) to my array of team objects and I want the correct lat long be appended to each team. See commentary in model.matchNamesWithLocations(). When the repsonse from geocder api comes, the response is attached to my model only if the team name matches. This way I ensure I don't end up with teams having random marker locations.
	getMarkerLocations: function(a,b,c,d) {
		var geocoderUrl = "https://maps.googleapis.com/maps/api/geocode/json?&address=";
		var googleApiKey = "&key=AIzaSyDlwjpuXkYPyLd6xiHyuwASmB3Ds01P9wc";
		$.ajax({
			url: geocoderUrl + b + ", " + c + ", " + d + googleApiKey,
			success: [function(resp){
				model.teams.forEach(function(team){
					if(team.name === a){
						team.venue.locations = resp.results[0];
					}
				})
			}],
			error: function() {
				errorHandlers.errGeocoder();
			}
		});
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
