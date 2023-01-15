const express = require('express');

const {resolve} = require('path');
require('dotenv').config({ path: resolve(__dirname, '../.env') });

const connectToDatabase = require('./database/connect');
connectToDatabase();

const UserModel = require('../models/user');

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, (err) => {
    if (err) return console.log(`Error: ${err}`);

    console.log(`Server listening on port ${port}`);
});