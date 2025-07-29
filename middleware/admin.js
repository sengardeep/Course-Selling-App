const jwt=require('jsonwebtoken');
const {JWT_ADMIN_SECRET} = require('../config');

function adminMiddleware(req,res,next){
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_ADMIN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden', error: err.message });
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = { adminMiddleware };