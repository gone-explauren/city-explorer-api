'use strict';
// React does **not** need 'use strict,' but writing code for a server **does** need it

// console.log('Baby\'s first server!');

// to create a server, we are bringing in Express
const express = require('express');

// we need to bring in our .env file, so we'll use this after we have run 'npm i dotenv'
require('dotenv').config();

// we must include cors if we want to share resources over the web
const cors = require('cors');

const axios = require('axios');


// once we have express we must use it
const app = express();
app.use(cors());

// define a PORT & validate env is working
const PORT = process.env.PORT || 3002;
// if my server is running on 3002, I know something is wrong with either my .env file or how I'm importing it.

app.get('/', (request, response) => {
  // console.log('inside app.get /');
  response.send('Hello from my first server!');
});


// example request: http://localhost:3001/weather?search=Seattle
app.get('/weather', async (request, response, next) => {
  try {
    // console.log('hi friend :P');
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=3&lat=${request.query.lat}&lon=${request.query.lon}`;
    // console.log(url);

    let resultsFromAPI = await axios.get(url);
    // console.log(resultsFromAPI.data);

    let forecastData = resultsFromAPI.data.data.map(forecast => new Forecast(forecast));
    // console.log(forecastData);

    response.send(forecastData);

  } catch (error) {
    // next is built into express and acts as a console.log
    next(error);
  }
});

app.get('/movies', async (req, res, next) => {
  try {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&language=en-US&include_adult=false&query=${req.query.movie}`;
    // console.log(url);

    let resultsFromAPI = await axios.get(url);
    // console.log(resultsFromAPI.data);

    let movieData = resultsFromAPI.data.data.map(movie => new Movie(movie));
    // console.log(movieData);

    res.send(movieData);

  } catch (error) {
    // next is built into express and acts as a console.log
    next(error);
  }
});

// create a 404 error
// must be listed **last** in our route list (because of the * wild card)
app.get('*', (req, res) => {
  res.send('This resource does not exist');
});


// CLASSES
class Forecast {
  constructor(forecastData) {

    this.date = forecastData.datetime;
    this.description = `Low of ${forecastData.low_temp}, high of ${forecastData.max_temp} with ${forecastData.weather.description.toLowerCase()}`;

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


// ERRORS
// handle all the errors
app.use((error, request, response, next) => {
  // 500 is the code for a server error
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
