// require dependencies 
const express = require('express')
const mongoose = require('mongoose');
const logger = require('morgan');
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
    image: {type: String,
            default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'},
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

// Full CRUD ROUTES

//INDEX
app.get('/api/people', async (req, res) => {
    try {
        res.status(200).json(await People.find({}))
    } catch (error) {
        console.log(error);
        res.status(400).json({'error': 'bad request'});
    }
});

// CREATE Route
app.post('/api/people', async (req, res) => {
    try {
        res.status(201).json(await People.create(req.body));
    } catch (error) {
        console.log(error);
        res.status(400).json({'error': 'bad request'});
    }
});

// UPDATE Route
app.put('/api/people/:id', async (req, res) => {
    try {
        res.status(200).json(await People.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ));     
    } catch (error) {
        console.log(error);
        res.status(400).json({'error': 'bad request'});
    }
});

// DELETE route
app.delete('/api/people/:id', async (req, res) => {
    try {
        res.status(200).json(await People.findByIdAndDelete(
            req.params.id
        ));
    } catch (error) {
        console.log(error);
        res.status(400).json({'error': 'bad request'});
    }
});

// tell the app to listen
app.listen(PORT, () => {
    console.log(`Express is listening on port: ${PORT}`);
});