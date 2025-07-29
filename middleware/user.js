const jwt = require('jsonwebtoken');
const {JWT_USER_PASSWORD}=require('../config');

function userMiddleware(req,res,next){
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_USER_PASSWORD, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.userId = decoded;
        next();
    });
}

module.exports = { userMiddleware };