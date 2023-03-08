# What is a Server?

A server is another computer that you computer makes a request to and recieves a response from.

## Tools to Use to make a Server of Your Computer

* Node:
  * open-source, back-end JavaScript runtime environment
  * allows us to use JavaScript on the back-end, ie a server
  * JavaScript was designed as a front-end language, node allows us to use it in back-end development
* NPM
  * Node Package Manager
  * how we install node packages (someone else's code that is available for us to use)
* Express.js
  * an NPM package used to build a server

## Using Express

Install Express by typing **npm i express** in terminal

* Express needs it's own port number assigned to it
* in .env, I made a variable setting port to 3001 so both the server and the react app (on port 3000) can be run **simultaneously**

Install dotenv: **npm i dotenv**

* dotenv allows express to read the .env syntax
* React has this ability built-in

Install cors: **npm i cors**

* we can't, by default, get data from other sources
* we must install cors to make this available

### Express takes 2 steps: require and use

* ***REQUIRE***

  * in our server we have to use 'require' instead of import
  * here we will list the requirements for our server...

* ***USE***

  * once we require something, we have to use it
  * this is where we assign  the required file a variable
  * React does this *in one step* with import, says we must use it and it assigns it to a variable

* ***ROUTES***

  * we will use these to access our endpoints
  * define our default route ( / , as in /sayHello )
  * app.get() correlates to axios.get()
  * the first arugment is a URL in quote (req)
  * the second is the callback that (res)defines what should happen when a request comes into that url

* ***Listen***

  * what is it listening for?
    * Requests that come in via routes
  * Listen *starts the server*
  * Listen is Express methtod that takes in two arguments:
    * port value
    * call back function

## Queries

* example query string: *<http://localhost:3001/sayHello?firstName=Laurel>*

  * we have access to a value that came in with a request
  * request.query.firstName will find the first name in the query string and allow the server to use it to form a response

* example...

app.get('/sayHello', (request, response) => {
 // console.log(request.query.firstName);
 let firstName = request.query.firstName;
 response.send(`hello ${firstName}`);
});

## Miscellaneous and Maybe Important

* npm i -g nodemon installs nodemon, which allows us to update our server automatically without restarting every time a change is made
 * the -g installs nodemon globally
* npx kill-port 3000 clears port 3000
* ctrl + C stops a command in terminal
