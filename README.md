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
Information windows|Contents of the Information window|Name of the team, Logo of the team|

## What to expect (also see above table):
App starts with stadium marker locations for the football teams of Scottish Premier League and Danish Superliga. The user can select country using the filter on the left pane. The list view, the markers on the map and the map view should update accordingly. The user can also select an individual team by clicking on a team's name from the list on the left or by clicking on a marker on the map. In that case the information window will pop including the selected team's name and its logo. Also the map will zoom to the location of the selected team's home stadium.

## How to run the app?
Easiest way is to download the zip file, extract contents and run the local ```index.html``` file.

**NOTE:** Due API request limits (both google Geocoder, which is 2500/day and the third party), I did most of the development on a cached copy of the model. I submit it using the cached version of the data. In case you run into problems with model.js and app.js pair, simply comment them out in the index.html file and comment in the cached_data and cached_app pair.

##Room to grow
Any feedback on any component is appreciated. I thank you in advance for taking the time to have a look. In case you feel generous enough to write back, I would especially open to following:
- Tips on responsiveness (How to make left had side navigation pane smoother, how to get the map zoom changes smoother for different screen sizes etc.)
-   
