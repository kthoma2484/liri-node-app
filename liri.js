require("dotenv").config();
const fs = require('fs')
const keys = require("./keys.js");
const request = require('request');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');

// assign arguments
const search = process.argv[2];
let input = process.argv.splice(3).join(' ');

// Runs search term and input on OMDB api
function searchOMDB() {
  if (input == '') {
    input = "Mr. Nobody";
  }

  //console.log(input)
  //console.log('searching omdb only')

  let queryUrl = 'http://www.omdbapi.com/?t=' + input + '&y=&plot=short&apikey=trilogy';

  request(queryUrl, function (error, response, body) {
    if (!error) {

      // assign variables for each response field to displayed in console log
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

// Runs search term and input on Spotify using request npm
function searchSpotify(input) {

  //console.log(input)
  //console.log('searching spotify only')

  var spotify = new Spotify(keys.spotify);

  if (input == '') {
    spotify
      .search({
        type: 'track',
        query: 'the sign'
      })

      .then(function (data) {

        // console.log(JSON.stringify(data.tracks.items[0].album.name));

        let artist = `\nArtist: ${JSON.stringify(data.tracks.items[5].artists[0].name)}`;
        let songName = `\nSong Name: ${JSON.stringify(data.tracks.items[5].name)}`;
        let preview = `\nSong Preview: ${JSON.stringify(data.tracks.items[5].album.artists[0].external_urls.spotify)}`;
        let album = `\nAlbum: ${JSON.stringify(data.tracks.items[5].album.name)}`

        console.log(artist, songName, preview, album);

      })
      .catch(function (err) {
        console.error('Spotify error occurred: ' + err);
      });
  } else {
    spotify
      .search({
        type: 'track',
        query: input
      })

      .then(function (data) {

        //console.log(JSON.stringify(data.tracks.items[0]));

        let artist = `\nArtist: ${JSON.stringify(data.tracks.items[0].artists[0].name)}`;
        let songName = `\nSong Name: ${JSON.stringify(data.tracks.items[0].name)}`;
        let preview = `\nSong Preview: ${JSON.stringify(data.tracks.items[0].album.artists[0].external_urls.spotify)}`;
        let album = `\nAlbum: ${JSON.stringify(data.tracks.items[0].album.name)}`

        console.log(artist, songName, preview, album);
      })
      .catch(function (err) {
        console.error('Spotify error occurred: ' + err);
      });
  }
}

// Runs search for last 20 tweets using request
function searchTwitter() {

  var client = new Twitter(keys.twitter);
  
  //console.log('searching twitter only')
  
  client.get('search/tweets', {
    q: 'kthoma1984',
    count: 21
  }, function (error, tweets, response) {
    console.log("searching tweets only")
    if (!error) {
      //console.log(tweets);
      //console.log(response);

      for (let i = 0; i < 21; i++) {
        let tweetCreated = `\nCreated: ${tweets.statuses[i].created_at}`;
        let myTweet = `\nTweet: ${tweets.statuses[i].text}`;

        console.log(tweetCreated, myTweet);
      }
    } else {
      console.log(JSON.stringify(error));
    }

  });

}

// Runs search on what ever is in random text file
function doWhatItSays () {
 
  // Gets text from random text file
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    let result = data.split(',');

    let input = result[1];

    //searches specifically for a spong using spotify search 
    searchSpotify(input);
  });

};

// adds each search to the log text file
function logSearch() {
    if (input === "") {
      fs.appendFile("log.txt", `\n${search}`, function(err) {
        if (err) {
          return console.log(err);
        };
      });
    } else {
      fs.appendFile("log.txt", `\n${search}, '${input}'`, function(err) {
        if (err) {
          return console.log(err);
        };
      });
    };
}

// depending on the search term used, this function will run a specific search 
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
    case 'do-what-it-says':
      doWhatItSays(input);
      break;
    default:
      {
        console.log('You must search a my-tweet or spotify-this-song or movie-this');
        break;
      }
  }
  logSearch();
}

searchCat(search, input);