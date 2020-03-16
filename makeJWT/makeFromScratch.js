// // // make a JWT from scratch

// let header = {
//     "alg": "RS256",
//     "typ": "JWT",
//     "somethingElse": "randomStuff"
//   }

// // // step 1: convert object to JSON object
// // let headerAsJSON = JSON.stringify(header)
// // // console.log(bodyAsJSON)

// // // step 2: encode in utf-8
// // let utf8Header = Buffer.from(headerAsJSON).toString("utf8")


// // //step 3: encode in base64
// // let base64Header = Buffer.from(utf8Header).toString("base64")
// // console.log(base64Header)


// let payload = {
//     "jti": "9e1y1zw3dl79zwfj",
//     "exp": 1583695306,
//     "iat": 1583695286,
//     "scope": "secretpage:read",
//     "username": "CoolUsr123"
//   }
// // // put it in a function

// const convertToJWT = function (JWTSection) {
//     let sectionAsJSON = JSON.stringify(JWTSection)
//     let utf8Section = Buffer.from(sectionAsJSON).toString("utf8")
//     let base64Section = Buffer.from(utf8Section).toString("base64")
//     let base64UrlSection = base64Section.replace('+', '-').replace('/', '_').replace(/=+$/, '');
//     console.log(base64Section)

//     // return base64Section
//     return base64UrlSection
// }

// console.log(convertToJWT(header))







// const crypto = require('crypto');
// const fs = require('fs')

// const payload = "eyJqdGkiOiI5ZTF5MXp3M2RsNzl6d2ZqIiwiZXhwIjoxNTgzNjk1MzA2LCJpYXQiOjE1ODM2OTUyODYsInNjb3BlIjoic2VjcmV0cGFnZTpyZWFkIiwidXNlcm5hbWUiOiJDb29sVXNyMTIzIn0="
// const header = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsInNvbWV0aGluZ0Vsc2UiOiJyYW5kb21TdHVmZiJ9"
// const privateKey = fs.readFileSync('key.pem')
// const publicKey = fs.readFileSync('cert.pem')


// const combined = header + "." + payload

// const sign = crypto.createSign('SHA256');
// sign.write(combined);
// sign.end();
// const signature = sign.sign(privateKey, 'hex');
// console.log(signature)

// const verify = crypto.createVerify('SHA256');
// verify.write(combined);
// verify.end();
// console.log(verify.verify(publicKey, signature, 'hex'));









const crypto = require('crypto');
const fs = require('fs')


const convertToJWT = function (JWTSection) {
    let sectionAsJSON = JSON.stringify(JWTSection)
    let utf8Section = Buffer.from(sectionAsJSON).toString("utf8")
    let base64Section = Buffer.from(utf8Section).toString("base64")
    let base64UrlSection = base64Section.replace('+', '-').replace('/', '_').replace(/=+$/, '');


    // return base64Section
    return base64UrlSection
}

// const payload = "eyJqdGkiOiI5ZTF5MXp3M2RsNzl6d2ZqIiwiZXhwIjoxNTgzNjk1MzA2LCJpYXQiOjE1ODM2OTUyODYsInNjb3BlIjoic2VjcmV0cGFnZTpyZWFkIiwidXNlcm5hbWUiOiJDb29sVXNyMTIzIn0"
// const header = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsInNvbWV0aGluZ0Vsc2UiOiJyYW5kb21TdHVmZiJ9"
const privateKey = fs.readFileSync('key.pem')
const publicKey = fs.readFileSync('cert.pem')

const header = convertToJWT({alg: "RS256", typ: "JWT"})
const payload = convertToJWT({fake: "fakePayload"})
const combined = header + "." + payload

// const combined = header + "." + payload

const sign = crypto.createSign('SHA256');
sign.write(combined);
sign.end();
const signature = sign.sign(privateKey, 'base64');
console.log(signature)

// const verify = crypto.createVerify('SHA256');
// verify.write(combined);
// verify.end();
// console.log(verify.verify(publicKey, signature, 'base64'));


// encoded.replace('+', '-').replace('/', '_').replace(/=+$/, '');



let signatureSection = convertToJWT(signature)
// console.log(signatureSection)
// const header = convertToJWT({alg: "RSA256", typ: "JWT"})
// const payload = convertToJWT({fake: "fakePayload"})
// combined = header + "." + payload

completeJWT = combined + "." + signatureSection.replace('+', '-').replace('/', '_').replace(/=+$/, '');

console.log(completeJWT)