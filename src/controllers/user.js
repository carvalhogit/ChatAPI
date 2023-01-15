const express = require('express');
const router = new express.Router();
const UserModel = require('../models/user');

// Create user and login routes

router.post('/auth/register', async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;

        validateRegister(res, firstName, lastName, email, password);
        
        //check if user exists
        const userExists = await UserModel.findOne({email: email});

        if (userExists) {
            return res.status(422).json({message: 'User already exists'});
        }

        // create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // create user
        const user = new UserModel({firstName: firstName, lastName: lastName, email: email, password: passwordHash  });
        
        await user.save();
        res.status(201).json({message: 'User created with success'});
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.status(400).send(err);
    }
});


router.post('/auth/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        
        // validate
        validateRegister(email, password);

        const user = await UserModel.findOne({email: email});

        if (!user) {
            return res.status(422).json({message: 'User not exists'});
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        
        if (!checkPassword) {
            return res.status(422).json({message: 'Password incorrect'});
        }

        // TOKEN 

        const SECRET_KEY = process.env.JWT_SECRET;
        
        const TOKEN = jwt.sign(
            {
                id: user._id,
            }, SECRET_KEY);

        res.statu(200).json({message: 'Success auth.', token: TOKEN});
    } catch (err) {
        res.status(400).send(err);
    }
});

//PRIVATE ROUTES
router.get('/user/:id', checkToken, async (req, res) => {
    try {
        const id = req.params.id;

        //check if user exists
        const user = await UserModel.findById(id, '-password');

        if (!user) {
            return res.status(404).json({message: 'User not exists'});
        }
        res.status(201).json(user);
        
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/user/:id', checkToken, async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new: true});

        if (!user) {
            return res.status(404).json({message: 'User not exists'});
        }

        res.status(201).json(user);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.status(404).send(err);
    }
});

router.put('/user/:id', checkToken, async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        
        if (!user) {
            return res.status(404).json({message: 'User not exists'});
        }

        res.status(201).json(user);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        res.status(500).send(err);
    }
});

router.delete('/user/:id', checkToken, async (req, res) => {
    try {
        const user = await UserModel.findByIdAndRemove(req.params.id);

        if (!user) {
            return res.status(404).json({message: 'User not exists'});
        }

        res.status(201).json(user);
    } catch {
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
// validate register data
function validateRegister (res, firstName, lastName, email, password) {
    if (!firstName || !lastName || !email || !password) {
        return res.status(422).json({msg: 'Invalid data'});
    }
}

