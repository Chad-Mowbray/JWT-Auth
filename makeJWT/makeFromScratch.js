// // make a JWT from scratch

let header = {
    "alg": "RS256",
    "typ": "JWT",
  }

let payload = {
    "jti": "9e1y1zw3dl79zwfj",
    "exp": 1583695306,
    "iat": 1583695286,
    "scope": "secretpage:read",
    "username": "CoolUsr123"
  }

// // step 1: convert object to JSON object
let headerAsJSON = JSON.stringify(header)
console.log(headerAsJSON)

// // step 2: encode in utf-8
let utf8Header = Buffer.from(headerAsJSON).toString("utf8")


// //step 3: encode in base64
let base64Header = Buffer.from(utf8Header).toString("base64")
console.log(base64Header)



// // put it in a function

const convertToJWT = function (JWTSection) {
    let sectionAsJSON = JSON.stringify(JWTSection)
    let utf8Section = Buffer.from(sectionAsJSON).toString("utf8")
    let base64Section = Buffer.from(utf8Section).toString("base64")
    let base64UrlSection = base64Section.replace('+', '-').replace('/', '_').replace(/=+$/, '');

    return base64UrlSection
}

console.log(convertToJWT(payload))





// Sign JWT using jsonwebtoken module
const jwt = require('jsonwebtoken')
const fs = require('fs')

const privateKey = fs.readFileSync('key.pem')
const publicKey = fs.readFileSync('cert.pem')

const signedToken = jwt.sign(payload, privateKey, {"algorithm": "RS256"});

console.log(signedToken)













