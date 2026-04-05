const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('./app/models/inventory.model.js');

// Configuring the database
require('dotenv').config();
const mongoose = require('mongoose');


// Connecting to the database
mongoose.connect(process.env.DATABASE);

mongoose.connection
.on('open', () => {
    console.log('Mongoose connection open');
})
.on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
});


require('./app/routes/inventory.router.js')(app);
// Create a Server
const port = process.env.PORT || 8080;
const server = app.listen(port, function () {
    console.log(`App listening at http://localhost:${port}`);
});

server.on('error', (err) => {
    console.log(`Server error: ${err.message}`);
});
