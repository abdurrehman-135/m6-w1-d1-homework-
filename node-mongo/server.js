const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

require('dotenv').config();

const app = express();
const Inventory = require('./app/models/inventory.model.js');

app.use(cors());
app.use(bodyParser.json());

let server;
let memoryServer;

async function connectToDatabase() {
    const mongoUri = process.env.DATABASE;

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 3000
        });
        console.log('Connected to local MongoDB');
    } catch (error) {
        console.log(`Connection error: ${error.message}`);
        console.log('Falling back to an in-memory MongoDB instance.');

        memoryServer = await MongoMemoryServer.create({
            instance: {
                dbName: 'react-crud'
            }
        });

        await mongoose.connect(memoryServer.getUri());
        console.log('Connected to in-memory MongoDB');
    }

    mongoose.connection.on('error', (err) => {
        console.log(`Connection error: ${err.message}`);
    });
}

async function seedInventoryData() {
    const itemCount = await Inventory.countDocuments();

    if (itemCount > 0) {
        return;
    }

    await Inventory.insertMany([
        { prodname: 'notebook', qty: 50, price: 8, status: 'T' },
        { prodname: 'planner', qty: 75, price: 7, status: 'R' },
        { prodname: 'journal', qty: 25, price: 10, status: 'S' },
        { prodname: 'postcard', qty: 45, price: 3, status: 'S' },
        { prodname: 'paper', qty: 100, price: 5, status: 'R' }
    ]);

    console.log('Seeded sample inventory data');
}

async function startServer() {
    try {
        await connectToDatabase();
        await seedInventoryData();

        require('./app/routes/inventory.router.js')(app);

        const port = process.env.PORT || 8080;
        server = app.listen(port, function () {
            console.log(`App listening at http://localhost:${port}`);
        });

        server.on('error', (err) => {
            console.log(`Server error: ${err.message}`);
        });
    } catch (error) {
        console.log(`Startup error: ${error.message}`);
        process.exit(1);
    }
}

async function shutdown() {
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }

    await mongoose.disconnect();

    if (memoryServer) {
        await memoryServer.stop();
    }
}

process.on('SIGINT', async () => {
    await shutdown();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await shutdown();
    process.exit(0);
});

startServer();
