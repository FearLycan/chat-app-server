const jwt = require("jsonwebtoken");

const {TOKEN_KEY} = process.env;

const verifyToken = (req, res, next) => {

    if(!req.headers['authorization']){
        return res.status(403).json({
            status: 'error',
            message: 'A token is required for authentication'
        });
    }

    let token = req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'A token is required for authentication'
        });
    }
    try {
        req.user = jwt.verify(token, TOKEN_KEY);
    } catch (err) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid Token'
        });
    }
    return next();
};

module.exports = verifyToken;