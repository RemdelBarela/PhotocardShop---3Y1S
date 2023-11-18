const express = require('express');
const app = express();
const cookie = require('cookie-parser')
const cors = require('cors')

const auth = require('./routes/auth')
const products = require('./routes/photos');

<<<<<<< HEAD
=======
// const photos = require('./routes/product');
>>>>>>> fb72baa71cd7cd99ffe6c10f58835e8fb5fae311
// const order = require('./routes/order')

app.use(cors())
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));

app.use(cookie());

app.use('/api/v1', auth);
app.use('/api/v1', photos);

<<<<<<< HEAD
=======
// app.use('/api/v1', photos);
>>>>>>> fb72baa71cd7cd99ffe6c10f58835e8fb5fae311
// app.use('/api/v1', order);

module.exports = app