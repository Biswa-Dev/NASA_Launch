const mongoose = require('mongoose');
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready.');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true, //this determines how mongoose parses that connection string into mongo url
        // useFindAndModify: false, //this disables the outdated way to updat mongo data using this findAndModify func
        // useCreateIndexes: true, //this will use this createIndex func rather than old ensureIndex func
        useUnifiedTopology: true, //this way mongoose will use the updated way of talking to clusters of mongo databases
        // all thses are options in the mongoDB driver that mongoose uses to connect to our database
        // the mongoDB driver is the official API that node uses to talk to databases
    });
}

async function mongnoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongnoDisconnect,
}