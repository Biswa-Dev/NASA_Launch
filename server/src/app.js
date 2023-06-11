const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const apiV1 = require('./apiVersions/apiV1');

const app = express();

// Middlewares
app.use(cors({
    // origin: 'http://localhost:3000',
    origin: '*',
}));
app.use(morgan('combined'))
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(apiV1);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;