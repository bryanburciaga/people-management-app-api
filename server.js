// require dependencies 
const express = require('express')
const mongoose = require('mongoose');
const logeer = require('morgan');
// initialize the express app
const app = express();
// configuring applications settings

require('dotenv').config();
const { PORT = 4000, DATABASE_URL } = process.env;
// esablish connection to mongodb
mongoose.connect(DATABASE_URL);

mongoose.connection
.on('connected', () => console.log('Connected to MongoDB'))
.on('error', (error) => console.log('Problem with MongoDB' + error.message));

// set up our model
const peopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
}, {timestamps: true});

const People = mongoose.model('People', peopleSchema);

// mount middleware

// app.use(express.urlencoded({ extended: false}));
app.use(express.json()); 
// this middlewate inctercepts incoming json request bodies and turns sthem into req.body
app.use(logger('dev'));

// mount our routes
app.get('/', (req, res) => {
    res.send('Welcome to the People Managment App');
});
// tell the app to listen
app.listen(PORT, () => {
    console.log(`Express is listening on port: ${PORT}`);
});