'use strict';
// React does **not** need 'use strict,' but writing code for a server **does** need it

// console.log('Baby\'s first server!');

// for our server, we need to use express
// express takes 2 steps: require and use
// ecpress needs it's own port number assigned to it
// in .env, I made a variable setting port to 3001 so both the server and the react app (on port 3000) can be run simultaneously
// npm i dotenv in terminal
// dotenv allows express to read the .env syntax (React has this ability built-in)

// REQUIRE
// in our server we have to use 'require' instead of import
// here we will list the requirements for our server...
// in terminal: npm i express
// to install express

// to create a server we are bringing in Express
const express = require('express');

// we need to bring in our .env file, so we'll use this after we have run 'npm i dotenv'
require('dotenv').config();

let data = require('./weather.json');

// we must include cors if we want to share resources over the web
const cors = require('cors');

// USE
// once we require something, we have to use it
// this is where we assign  the required file a variable
// react does this in one step with import, it says we must use it and it assigns it to a variable

// once we have express we must use it
const app = express();
app.use(cors());

// define a PORT & validate env is working
const PORT = process.env.PORT || 3002;

// if my server is running on 3002, I know something is wrong with either my .env file or how I'm importing it.

// ROUTES
// we will use these to access our endpoints

// define our default route ( / )
// app.get() correlates to axios.get()
// the first arugment is a URL in quote (req)
// the second is the callback that (res)defines what should happen when a request comes into that url
app.get('/', (request, response) => {
	response.send('Hello from my first server!');
});

// query string: http://localhost:3001/sayHello?firstName=Laurel
app.get('/sayHello', (request, response) => {
	// we have access to a value that came in with a request
	// request.query.firstName will find the first name in the query string and allow the server to use it to form a response
	// console.log(request.query.firstName);
	let firstName = request.query.firstName;
	response.send(`hello ${firstName}`);
});

// example request: http://localhost:3001/pet?species=dog
// species is the req and dog is the res
app.get('/weather', (request, response, next) => {
	try {
		// let speciesRequested = request.query.species;
		// // find the pet in the pet array (from pets.json) whose species equals what the is requested
		// let petObject = data.find(pet => pet.species === speciesRequested);
		// let selectedPet = new Pet(petObject);
		// response.send(selectedPet);
	} catch (error) {
		next(error);
	}
});

// create a 404 error
// must be listed **last** in our route list (because of the * wild card)
app.get('*', (req, res) => {
	res.send('This resource does not exist');
});

// CLASSES
// class Pet {
// 	constructor(PetObject) {
// 		this.name = PetObject.name;
// 		this.breed = PetObject.breed;
// 	}
// }

// ERRORS
// handle all the errors
app.use((error, request, response, next) => {
	response.status(500).send(error.message);
});

// LISTEN
// what is it listening for? requests that come in via routes
// start the server
// listen is Express methtod that takes in two arguments, a port value and a call back function
app.listen(PORT, () => console.log(`listening on ${PORT}`));

// npm i -g nodemon installs nodemon, which allows us to update our server automatically without restarting every time a change is made
// the -g installs nodemon globally

// npx kill-port 3000 clears port 3000
// ctrl + C stops a command in terminal