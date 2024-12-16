const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, 'tagliatore_secret_key', { expiresIn: '1d' }); 
};

module.exports = generateToken;
