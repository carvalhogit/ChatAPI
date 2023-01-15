const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.opbay1g.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", true);

const connectToDatabase = async () => {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },(error) => {
        if (error) return console.log(error);
        return console.log('Connected to database');
    });
};

module.exports = connectToDatabase;