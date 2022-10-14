const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

const verifyToken = (req, res, next)=>{
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(403).send("A token is required for authentication");
    }
    // console.log(process.env.SECRET);
    try{
        const decoded = jwt.verify(token, process.env.SECRET);
        // res.json({status: 'Ok',decoded});
    }catch(err){

        return res.status(401).send("Invalid Token");
    }
        return next();
}


module.exports = verifyToken;
