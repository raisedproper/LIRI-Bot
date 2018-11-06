//Module requirements
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

//Twitter and Spotify info from  keys.js
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

//Arguments to variables
var command = process.argv[2]
var value = process.argv.slice(3).join(" ");

//if/else statement for argument commands 
if (command === 'my-tweets') {
    searchTwitter();
 } else if (command === 'spotify-this-song') {
    searchSpotify(process.argv[3]);
 } else if (command === 'movie-this') {
    searchMovie(value);
 } else if (command === 'do-what-it-says') {
    runFromFile('random.txt');
 } else {
     console.log('Error: Command not recognized.')
 }

 //Twitter function 
 function searchTwitter() {
    var params = {screen_name: 'code_Bae'};
    client.get('statuses/user_timeline', params, function(error, tweets) {
        if (!error) {
            var i = 0;
            console.log('\nHere are your last 20 tweets:\n')
            while (i < tweets.length && i <= 20) {
                console.log("---------------------------");
                console.log(tweets[i].text)
                console.log(tweets[i].created_at);
                console.log();
                console.log("---------------------------");
                i++;
            }
        } else {
            console.log("There was an error:");
            console.log(error);
        }
    });
}

//Spotify function
function searchSpotify(songSearch) {
   spotify.search({type: 'track', query: songSearch, limit: 1}, function(err, data) {
       if(err) {
           console.log('Error occured: ' + err);
       }
       console.log("---------------------------");
       console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name));
       console.log("Song: " + JSON.stringify(data.tracks.items[0].name));
       console.log("Preview URL: " + JSON.stringify(data.tracks.items[0].preview_url));
       console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name));
       console.log("---------------------------");
   });
}

//OMDB function 
function searchMovie(movie) {
    if (movie === undefined) {
        movie = process.argv[3];
    }
    if (movie === undefined) {
        movie = 'Mr. Nobody';
    }
    request('http://www.omdbapi.com/?t='+ value +'&plot=short&apikey=trilogy', function(error, response) {
        if (!error) {
            jsonResponse = JSON.parse(response.body);
           // * Title of the movie.
           console.log("---------------------------");
            console.log('Title: ' + jsonResponse.Title);
            // * Year the movie came out.
            console.log('Year: ' + jsonResponse.Year);
            // * IMDB Rating of the movie.
            console.log('IMDB Rating: ' + jsonResponse.imdbRating); 
            // * Rotten Tomatoes Rating of the movie.
            console.log('Rotten Tomatoes Rating: ' + jsonResponse.tomatoRating);
            // * Country where the movie was produced.
            console.log('Country: ' + jsonResponse.Country);
            // * Language of the movie.
            console.log('Language: ' + jsonResponse.Language);
            // * Plot of the movie.
            console.log('Plot: ' + jsonResponse.Plot);
            // * Actors in the movie.
            console.log('Actors: ' + jsonResponse.Actors);
            console.log("---------------------------");
        } else {
            console.log(error);
        }
    });
}

//function that runs command from random.txt
function runFromFile(filename) {
    fs.readFile(filename, 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            data = data.split(',');
            command = data[0];
            if (command === 'spotify-this-song') {
                searchSpotify(data[1]);
            } else if (command === 'movie-this') {
                searchMovie(data[1]);
            } else if (command === 'my-tweets') {
                searchTwitter();
            } else {
                console.log('Error: Unrecognized command.');
            }
        }
    });
}