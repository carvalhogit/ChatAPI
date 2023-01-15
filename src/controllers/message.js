const express = require('express');
const router = new express.Router();
const MessageModel = require('../models/message');

//PRIVATE ROUTES
router.get('/chat/', checkToken, async (req, res) => {
    try {
        //check if user exists
        const message = await MessageModel.find({});
        res.status(200).json(message);

    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/chat', checkToken, async (req, res) => {
    try {
        const {user_id, content, date, time} = req.body;

        const message = new MessageModel({user_id, content, date, time});
        await message.save();
        res.status(201).json({message: 'Message is delivered with success.'});
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.status(500).send(err);
    }
});
// CHECK USER TOKEN
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'Access denied'});
    }

    try {
        const SECRET_KEY = process.env.JWT_SECRET;

        jwt.verify(token, SECRET_KEY);

        next();
    } catch (err) {
        return res.status(400).json({message: 'Invalid TOKEN'});
    }
}