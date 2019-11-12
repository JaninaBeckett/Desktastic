/* eslint-env node */

//------------------------------------------------------------------------------
// hello world app is based on node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com

const express = require('express');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
const cfenv = require('cfenv');
const bodyParser = require('body-parser');
const seat = require('./seat.json');

// create a new express server
const app = express();
const floor = 1; // array starts with 0 therefore 1 means floor 2
const seats = 4;

// serve the files out of ./public as our main files
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());


// get the app environment from Cloud Foundry
const appEnv = cfenv.getAppEnv();

app.get('/', (req, res) => {
  res.send('Hello to this website');
});

app.post('/updateSeat', (req, res) => {
  console.log(req.body.id);
  const newFloor = req.body.floor - 1;
  if (newFloor > floor) {
    res.send('no such floor available');
  }
  if (req.body.id > seats) {
    res.send('not so many seats available');
  }
  const index = seat.seats[newFloor].findIndex(item => item.id === req.body.id);
  if (seat.seats[newFloor][index].reserved == true) {
    res.send('this seat is already reserved');
  } else {
    seat.seats[newFloor].splice(index, 1, req.body);
    res.send('Updated selected seat');
  }
});


app.get('/seats', (req, res) => {
  let availableSeats = [];
  for (let i = 0; i < floor + 1; i++) {
    seat.seats[i].forEach((element) => {
      if (element.reserved == false) {
        availableSeats.push(element);
      }
    });
  }

  if (availableSeats == {}) {
    res.send('No available seats');
  } else {
    res.send(availableSeats);
  }
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', () => {
  // print a message when the server starts listening
  console.log(`server starting on ${appEnv.url}`);
});
