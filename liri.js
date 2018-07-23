require("dotenv").config();
const keys = require("./keys.js");
const request = require('request');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');

const search = process.argv[2];
const input = process.argv.splice(3).join(' ');

function searchOMDB() {
  let queryUrl = 'http://www.omdbapi.com/?t=' + input + '&y=&plot=short&apikey=trilogy';

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

      console.log(title, year, imdb, rotten, country, lang, plot, actors) 
    } else {
    console.log('error: ', error); // Print the error if one occurred
  }
  });
}

function searchSpotify() {

  console.log(input)
  console.log('searching spotify only')
  var spotify = new Spotify(keys.spotify);

  spotify
  .search({type: 'track', query: input})
    .then(function (data) {
      let song = JSON.stringify(data.tracks.items[0]);
          
      /*let artist = `\nArtist: ${JSON.parse(song.artists.name)}`;
      let songName = `\nSong Name: ${JSON.parse(song.name)}`;
      let preview = `\nSong Preview: ${JSON.parse(song.album.artists.external_urls.spotify)}`;
      let album = `\nAlbum: ${JSON.parse(song.album.name)}`;*/
      
      console.log(JSON.stringify(data.tracks.items[0]));
    })
    .catch(function (err) {
      console.error('Spotify error occurred: ' + err);
    });
}

function searchTwitter() {

  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: 'nodejs'
  };

  client.get('status', params, function (error, tweets, response) {
    console.log("searching tweets only")
    if (!error) {
      console.log(tweets);
    } else {
      console.log("tweet search didn't work. Error: ")
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