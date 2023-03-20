'use-strict';

const axios = require('axios');
let cache = require('./cache.js');

async function getMovies(req,res,next) {
  try {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&language=en-US&include_adult=false&query=${req.query.search}`;
    // console.log(url);
    // console.log(req.query.search);

    let resultsFromAPI = await axios.get(url);
    console.log(resultsFromAPI.data);

    let movieData = resultsFromAPI.data.results.map(movie => new Movie(movie));
    // console.log(movieData);

    res.send(movieData);


  } catch (error) {
    //console.log(error.message);
    // next is built into express and acts as a console.log
    next(error);
  }

  try {
    let key = 'movie-' + req.query.searchQuery;
    if (cache[key] && Date.now() - cache[key].timestamp < 50000) {
      console.log('Cache hit');
    } else {
      console.log('Cache miss');
      let movies = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          query: req.query.searchQuery,
          api_key: process.env.MOVIE_API_KEY
        }
      });
      let allMovies = movies.data.results.map(movie => new Movie(movie));
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = allMovies;
    }
    return cache[key];
  } catch (err) {
    Promise.resolve().then(() => {
      throw new Error(err.message);
    }).catch(next);
  }
}

class Movie {
  constructor(movieData) {
    this.title = movieData.title;
    this.release_date = movieData.release_date;
    this.poster_path = `https://api.themoviedb.org${movieData.poster_path}`;
    this.overview = movieData.overview;
  }
}

module.exports = getMovies;
