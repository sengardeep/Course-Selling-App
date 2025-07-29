const jwt=require('jsonwebtoken');
const {JWT_ADMIN_SECRET} = require('../config');

function adminMiddleware(req,res,next){
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

module.exports = { adminMiddleware };