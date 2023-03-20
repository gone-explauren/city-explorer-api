'use-strict';

const axios = require('axios');
let cache = require('./cache.js');


// example request: http://localhost:3001/weather?search=Seattle
async function getWeather(req, res, next) {
  // console.log('hi friend :P');
  try {
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=3&lat=${req.query.lat}&lon=${req.query.lon}`;
    // console.log(url);
    // console.log(req.query.lat, req.query.lon);

    let resultsFromAPI = await axios.get(url);
    // console.log(resultsFromAPI.data);

    let forecastData = resultsFromAPI.data.data.map(forecast => new Forecast(forecast));
    // console.log(forecastData);

    res.send(forecastData);

  } catch (error) {
    // next is built into express and acts as a console.log
    next(error);
  }

  const key = 'weather-' + lat + lon;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url).then(response => parseWeather(response.data));
  }
  return cache[key].data;

}

// can't say I fully understand cache but I hope this works...
function getWeather(lat, lon) {
  const key = 'weather-' + lat + lon;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=3&lat=${lat}&lon=${lon}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url).then(response => parseWeather(response.data));
  }
  return cache[key].data;

}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Forecast(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Forecast {
  constructor(forecastData) {

    this.date = forecastData.datetime;
    this.description = `Low of ${forecastData.low_temp}, high of ${forecastData.max_temp} with ${forecastData.weather.description.toLowerCase()}`;

  }
}

module.exports = getWeather;
