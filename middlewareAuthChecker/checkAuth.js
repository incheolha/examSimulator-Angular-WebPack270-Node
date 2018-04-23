
const jwt = require('jsonwebtoken');
const saltKey = require('./saltkey');

module.exports = (req, res, next) => {
    console.log('this is a entry point');
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, saltKey);
        console.log("this is a decoded point", decoded);
        req.userData = decoded;
        next();
    } catch(error) {
        console.log('this is a failed points');
            
        return res.status(401).json({
            
            message: 'Auth failed'
        });
    }
     
};
