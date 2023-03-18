'use strict';
// React does **not** need 'use strict,' but writing code for a server **does** need it

// console.log('Baby\'s first server!');

// REQUIRE ------

// to create a server, we are bringing in Express
//use require instead of import. This is a javascript module, not React.
const express = require('express');

// we need to bring in our .env file, so we'll use this after we have run 'npm i dotenv'
require('dotenv').config();

// we must include cors if we want to share resources over the web
const cors = require('cors');

const axios = require('axios');


// once we have express we must use it
const app = express();
app.use(cors());

// modules:
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');

// define a PORT & validate env is working
const PORT = process.env.PORT || 3002;
// if my server is running on 3002, I know something is wrong with either my .env file or how I'm importing it.


// ROUTES -----
app.get('/', (request, response) => {
  // console.log('inside app.get /');
  response.send('Hello from my first server!');
});

app.get('/modules/weather', getWeather);
app.get('/modules/movies', getMovies);

// create a 404 error
// must be listed **last** in our route list (because of the * wild card)
app.get('*', (req, res) => {
  res.send('This resource does not exist');
});


// ERRORS -----
// handle all the errors
app.use((error, request, response, next) => {
  // 500 is the code for a server error
  response.status(500).send(error.message);
});


// LISTEN -----
app.listen(PORT, () => console.log(`listening on ${PORT}`));
