# Neighborhood Map Project
-------------------------------------------------------------------------------------------------
## Introduction
I like football! In this project I use components of Google Maps and Sportmonks APIs to display football teams of Scotland Premier League and Denmark Superliga on their home stadium and show the result of their last home game in order to fulfill the requirements of Neighborhood Map project of Udacity FEND - second project of the Advanced Interactive Web Sites module.
## Table of visible elements on page and what they do:
|Element on page|What the user can do with it|What happens|
|---------------|----------------------------|------------|
|Filter|Select a country|Team List updates showing only the selected country|
|Filter|Select a country|Map zoom and center to match the selection|
|Filter|Select a country|Markers update to match the selection|
|Team List|Click on a team name on the list|Map zooms into stadium location|
|Team List|Click on a team name on the list|The marker for the team/stadium bounces|
|Team List|Click on a team name on the list|Information window for selected team appears|
|The map|Zoom in/out, pan left/right/up/down|These controls are disabled|
|Markers|Click on the marker|Clicked marker bounces|
|Markers|Click on the marker|Information window for selected team appears|
|Markers|Click on the marker|Map zooms into selected marker|
Information windows|Close by clicking top right x|Closes|
Information windows|Contents of the Information window|Logo of the team, stadium picture, web page of the club if any, adress, last home result|

## How to run the app?
Easiest way is to download the zip file, extract contents and run the local index.html file.
NOTE: Due API request limits (both google Geocoder, which is 2500/day and the third party), I did most of the development on a cached copy of the model. In case you run into problems with model.js and app.js pair, simply comment them out in the index.html file and comment in the cached_data and cached_app pair.
