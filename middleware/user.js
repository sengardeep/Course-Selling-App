const jwt = require('jsonwebtoken');
const {JWT_USER_SECRET}=require('../config');

function userMiddleware(req,res,next){
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_USER_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = { userMiddleware };