const express = require('express');
const app = express();
const cookie = require('cookie-parser')
const cors = require('cors')

const auth = require('./routes/auth')
const photos = require('./routes/photo')
const material = require('./routes/material')
const photocard = require('./routes/photocard')
const order = require('./routes/order')
const review = require('./routes/review')

app.use(cors())
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));

app.use(cookie());

app.use('/api/v1', auth);
app.use('/api/v1', photos);
app.use('/api/v1', material);
app.use('/api/v1', photocard);
app.use('/api/v1', order);
app.use('/api/v1', review);

module.exports = app