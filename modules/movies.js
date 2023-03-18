'use-strict';

const axios = require('axios');
let cache = require('./cache.js');

// async function getMovies(req,res,next) {
//   try {
//     let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&language=en-US&include_adult=false&query=${req.query.movie}`;
//     // console.log(url);

//     let resultsFromAPI = await axios.get(url);
//     // console.log(resultsFromAPI.data);

//     let movieData = resultsFromAPI.data.data.map(movie => new Movie(movie));
//     // console.log(movieData);

//     res.send(movieData);

//   } catch (error) {
//     // next is built into express and acts as a console.log
//     next(error);
//   }
// }

// can't say I fully understand cache but I hope this works
async function getMovies(req, next) {
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
    this.released = movieData.release_date;
    this.img = `https://api.themoviedb.org${movieData.poster_path}`;
    this.synopsis = movieData.overview;
  }
}

module.exports = { getMovies };
