require("dotenv").config();
const keys = require("./keys.js");
const request = require('request');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');

const search = process.argv[2];
const input = process.argv.splice(3).join(' ');

function searchOMDB() {
  let queryUrl = 'http://www.omdbapi.com/?t=' + input + '&y=&plot=short&apikey=trilogy';

  console.log(input)

  request(queryUrl, function (error, response, body) {
    if (!error) {

        let title = `\nTitle: ${JSON.parse(body).Title}`;
        let year = `\nYear Released: ${JSON.parse(body).Year}`;
        let imdb = `\nIMDB Rating: ${JSON.parse(body).imdbRating}`;
        let rotten = `\nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`;
        let country = `\nCountry produced: ${JSON.parse(body).Country}`;
        let lang = `\nLanguage: ${JSON.parse(body).Language}`;
        let plot = `\nPlot: ${JSON.parse(body).Plot}`;
        let actors = `\nActors: ${JSON.parse(body).Actors}`;

      console.log(
        title, year, imdb, rotten, country, lang, plot, actors
        
      )
     
    } else {
    console.log('error: ', error); // Print the error if one occurred
  }
  });
}

function searchSpotify() {
  var spotify = new Spotify(keys.spotify);
  /*var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });*/
  console.log(input)

  spotify
    .search({type: 'track', query: input})
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.error('Spotify error occurred: ' + err);
    });
}

function searchTwitter() {
  /*var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });*/
  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: 'nodejs'
  };

  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      console.log(tweets);
    } else {
      console.log("tweet search didn't work. Error: " + error)
    }

  });

}


function searchCat(search, input) {
  switch (search) {
    case 'my-tweets':
      searchTwitter(input);
      break;
    case 'spotify-this-song':
      searchSpotify(input);
      break;
    case 'movie-this':
      searchOMDB(input);
      break;
    default:
      {
        console.log('You must search a my-tweet or spotify-this-song or movie-this');
        break;
      }
  }
}

searchCat(search, input);