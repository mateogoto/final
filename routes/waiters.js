const express = require('express');
const router = express.Router();
const Waiter = require('../models/Waiter');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        token = token.split(' ')[1];

        try {
            const decoded = jwt.verify(token, 'tagliatore_secret_key');
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

router.post('/', protect, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const waiterExists = await Waiter.findOne({ email });

        if (waiterExists) {
            return res.status(400).json({ message: 'Waiter already exists' });
        }

        const waiter = await Waiter.create({ name, email, password });
        res.status(201).json(waiter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const waiter = await Waiter.findOne({ email });

        if (waiter && (await waiter.matchPassword(password))) {
            res.status(200).json({
                _id: waiter._id,
                name: waiter.name,
                email: waiter.email,
                token: generateToken(waiter._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const waiters = await Waiter.find({ isDeleted: false });
        res.status(200).json(waiters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const updatedWaiter = await Waiter.findById(req.params.id);

        if (!updatedWaiter) {
            return res.status(404).json({ message: 'Waiter not found' });
        }

        if (name) updatedWaiter.name = name;
        if (email) updatedWaiter.email = email;
        if (password) updatedWaiter.password = await bcrypt.hash(password, 10);

        await updatedWaiter.save();

        res.status(200).json(updatedWaiter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const waiter = await Waiter.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

        if (!waiter) {
            return res.status(404).json({ message: 'Waiter not found' });
        }

        res.status(200).json({ message: 'Waiter deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
