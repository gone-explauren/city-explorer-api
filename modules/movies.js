'use-strict';

const axios = require('axios');
let cache = require('./cache.js');

async function getMovies(req, res) {
  // try {
  //   let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&language=en-US&include_adult=false&query=${req.query.search}`;
  //   // console.log(url);
  //   // console.log(req.query.search);

  //   let resultsFromAPI = await axios.get(url);
  //   console.log(resultsFromAPI.data);

  //   let movieData = resultsFromAPI.data.results.map(movie => new Movie(movie));
  //   // console.log(movieData);

  //   res.send(movieData);


  // } catch (error) {
  //   //console.log(error.message);
  //   // next is built into express and acts as a console.log
  //   next(error);
  // }

  let searchCity = req.query.searchQuery
  const key = 'movies';
  let params = {
    api_key: process.env.MOVIES_API_KEY,
    query: searchCity
  };

  let url = `https://api.themoviedb.org/3/search/movie`;

  if (cache[key] && Date.now() - cache[key].timestamp < 50000) {

    //send cache data
    // console.log('Cache hit');
    res.status(200).send(cache['movies'])

  } else {

    // console.log('Cache miss');
    await axios.get(url, { params })

      .then(resultsFromApi => resultsFromApi.data.results.map(item => new Movie(item)))
      // .then(console.log('results from api: ', resultsFromApi))
      .then(dataToSend => res.status(200).send(dataToSend))
      .catch(err => console.error(err));
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
