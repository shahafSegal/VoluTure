const jwt = require('jsonwebtoken')
const jwtSecret = "voltur"

const generateToken = (payload) =>{
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });
    return token;
}

const verifyToken = (token) =>{
    const payload = jwt.verify(token,jwtSecret);
    return payload;
};



module.exports = { generateToken, verifyToken }