let fs = require('fs')
let jwt = require("jsonwebtoken")
let path = require('path')
let querystring = require('querystring')

let usersDatabase = require('../database/fakeDatabase')
let log = require('../loginHandler/login')


const createSignedJWT = function(req, res) {
    const jti = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const now = new Date()  
    const epochTime = Math.round(now.getTime() / 1000)
    let username;
    try {
        username = req.headers.cookie.split('; ').filter( pair => pair.split('=')[0] === 'username')[0].split('=')[1]
    } catch {
        log.logout(res)
        res.send("Token request invalid")
    }
    let payload = {
        "jti": jti,
        "exp": epochTime + 15,                                           
        "iat": epochTime,
        "scope": "secretpage:read",
        "username": username
    }
    const privateKey = fs.readFileSync( path.join(__dirname, "../public", "certificate", "key.pem"))
    const token = jwt.sign(payload,{"key": privateKey, "passphrase": process.env.PASSPHRASE}, { algorithm: 'RS256' });  // passphrase is the password you use when generating the certificate
    for(let user of usersDatabase) {
        if(payload["username"] === user.username) {
            user.JWT = token
        }
    }
    res.cookie("userToken", token)
    return token
}



module.exports.verifyJWT = function(token, res) {
    const cert = fs.readFileSync('public/certificate/cert.pem', "utf8");  // get public key
    try {
        const checkedToken = jwt.verify(token, cert)
        return checkedToken
    } catch (TokenExpiredError) {
        const query = querystring.stringify({
            "tokenExpired":"true"
        })
        log.logout(res)
        return res.redirect('/login?' + query)
    }
}

module.exports.returnToken = function(req, res) {
    if(log.loggedIn(req)) {
        let token = createSignedJWT(req, res)
        log.clearCookies(req, res)
        return token
    } else {
        res.send('401: Unauthorized')
    }
}