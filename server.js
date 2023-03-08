'use strict';
// React does **not** need 'use strict,' but writing code for a server **does** need it

// console.log('Baby\'s first server!');

// to create a server, we are bringing in Express
const express = require('express');

// we need to bring in our .env file, so we'll use this after we have run 'npm i dotenv'
require('dotenv').config();

// we must include cors if we want to share resources over the web
const cors = require('cors');

let weatherData = require('./weather.json');


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
app.get('/weather', (request, response, next) => {
  try {
    let cityRequested = request.query.search;
    // console.log(request.query);

    let cityObject = weatherData.find(data => data.city_name === cityRequested);
    // console.log(weatherObject);

    let forecastData = cityObject.data.map(forecast => new Forecast(forecast));
    // console.log(forecastData);

    response.send(forecastData);

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


// ERRORS
// handle all the errors
app.use((error, request, response, next) => {
  // 500 is the code for a server error
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
