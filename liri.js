require("dotenv").config();

var request = require("request");
var fs = require("fs");
var Twitter = require("twitter");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var action = process.argv[2];
// var userEntry = process.argv[3];

var nodeArgs = process.argv;

var userEntry = "";

for (var i = 3; i < nodeArgs.length; i++) {
	userEntry = userEntry + " " + nodeArgs[i];
}



liriCall(action, userEntry);

function liriCall(action, userEntry) {


	switch (action){

 	case "myTweets":
 	myTweets();
 	break;

 	case "spotifyThisSong":
 	spotifyThisSong(userEntry);
 	break;

 	case "movieThis":
 	movieThis(userEntry);
 	break;

 	case "doWhatItSays":
 	doWhatItSays();
 	break;
 };

}



function myTweets () {

var client = new Twitter (keys.twitter);
var params = {
 	screen_name: "Joseph_Rivera_9"
 	// count: 20
 };
client.get("statuses/user_timeline", params, function(error, tweets, response) {
 	if (!error && response.statusCode === 200) {
 		console.log("Latest Tweets: ");

 		for(i=0; i< tweets.length; i++){
 			console.log(tweets[i].text);
 			console.log("Posted on " + tweets[i].created_at);
 		}
 	}
 })
};

function spotifyThisSong(userEntry) {
	console.log(userEntry);

	var spotify = new Spotify(keys.spotify);
	// console.log(userEntry);

	if (userEntry == null){
		userEntry = "The Sign";
	}
	// console.log(userEntry);

	spotify.search({type: 'track', query: userEntry}, function(err, data) {
		// console.log(userEntry);
		if (!err) {
		var artistsArray = data.tracks.items[0].album.artists;
		var artistsNames = [];

		for (var i = 0; i < artistsArray.length; i++) {
			artistsNames.push(artistsArray[i].name);
		}

		var artists = artistsNames.join(", ");

		console.log("Artist(s): " + artists);
		console.log("Song: " + data.tracks.items[0].name)
		console.log("Spotify Preview URL: " + data.tracks.items[0].preview_url)
		console.log("Album Name: " + data.tracks.items[0].album.name);	
		}
	});
}



function movieThis(userEntry){
var queryUrl = "http://www.omdbapi.com/?t=" + userEntry + "&y=&plot=short&apikey=trilogy";

request(queryUrl, function(error, response, body) {
	if(!error && response.statusCode === 200) {
		console.log("Title: " + JSON.parse(body).Title);
		console.log("Year Released: " + JSON.parse(body).Year);
		console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		console.log("Country movie was produced: " + JSON.parse(body).Country);
		console.log("Language of movie: " + JSON.parse(body).Language);
		console.log("Plot: " + JSON.parse(body).Plot);
		console.log("Actors: " + JSON.parse(body).Actors);
	}
})
}


function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (!err) {

			data = data.split(",");
			
			for (var i =0; i< data.length; i++) {
				action = data[0];
				userEntry = data[1];
			}
			console.log(action);
			console.log(userEntry);

			liriCall(action, userEntry);
		}
	});
}
