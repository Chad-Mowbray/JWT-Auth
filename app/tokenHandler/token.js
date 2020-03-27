
// // Challenge 1: This is the starting version
// //     Username and password are stored in the token
// //     Only Username and password are checked

// let jwt = require("jsonwebtoken")

// let usersDatabase = require('../database/fakeDatabase')
// let loginHandler = require('../loginHandler/login')


// const createSignedJWT = function(req, res) {
//     const jti = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

//     try {
//         username = req.headers.cookie.split('; ').filter( pair => pair.split('=')[0] === 'username')[0].split('=')[1]
//         password = req.headers.cookie.split('; ').filter( pair => pair.split('=')[0] === 'password')[0].split('=')[1]

//     } catch {
//         loginHandler.logout(res)
//         res.send("Token request invalid")
//     }

//     let header = {
//         "typ": "JWT"
//     }
//     let payload = {
//         "jti": jti,
//         "username": username,
//         "password": password
//     }

//     const convertToJWT = function (JWTSection) {
//         let sectionAsJSON = JSON.stringify(JWTSection)
//         let utf8Section = Buffer.from(sectionAsJSON).toString("utf8")
//         let base64Section = Buffer.from(utf8Section).toString("base64")
//         let base64UrlSection = base64Section.replace('+', '-').replace('/', '_').replace(/=+$/, '');
    
//         return base64UrlSection
//     }

//     const token = convertToJWT(header) + "." + convertToJWT(payload) + "." + "noSignatureHere"
//     res.cookie("userToken", token)  

//     return token
// }



// module.exports.verifyJWT = function(data, res) {
//     try {
//         theToken = data["cookie"].split('; ').filter( pair => pair.split('=')[0] === 'userToken')[0].split('=')[1]
//         let tokenPayload = jwt.decode(theToken)
//         let username = tokenPayload["username"]
//         let password = tokenPayload["password"]
//         if (usersDatabase.filter( (user) => user['username'] === username ).length === 1 && users.filter( (user) => user['password'] === password).length === 1) {
//             return theToken
//         } else {
//             return new Error("401: Unauthorized")
//         }
//     } catch (error) {

//         return res.redirect('/login')
//     }
// }

// module.exports.returnToken = function(req, res) {
//     if(loginHandler.loggedIn(req)) {
//         let token = createSignedJWT(req, res)
//         loginHandler.clearCookies(req, res)
//         return token
//     } else {
//         res.send('401: Unauthorized')
//     }
// }











// // Challenge 2, add expiry check

//   let jwt = require("jsonwebtoken")
  
//   let usersDatabase = require('../database/fakeDatabase')
//   let loginHandler = require('../loginHandler/login')
  
  
//   const createSignedJWT = function(req, res) {
//       const jti = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
//       const now = new Date()  
//       const epochTime = Math.round(now.getTime() / 1000)
//       try {
//           username = req.headers.cookie.split('; ').filter( pair => pair.split('=')[0] === 'username')[0].split('=')[1]
//       } catch {
//           loginHandler.logout(res)
//           res.send("Token request invalid")
//       }
//       let header = {
//         "typ": "JWT"
//       }
//       let payload = {
//           "jti": jti,
//           "exp": epochTime + 15,                                           
//           "iat": epochTime,
//           "username": username
//       }

//       const convertToJWT = function (JWTSection) {
//         let sectionAsJSON = JSON.stringify(JWTSection)
//         let utf8Section = Buffer.from(sectionAsJSON).toString("utf8")
//         let base64Section = Buffer.from(utf8Section).toString("base64")
//         let base64UrlSection = base64Section.replace('+', '-').replace('/', '_').replace(/=+$/, '');
    
//         return base64UrlSection
//     }

//     const token = convertToJWT(header) + "." + convertToJWT(payload) + "." + "noSignatureHere"
//     res.cookie("userToken", token)

//     return token
//   }
  
//   module.exports.verifyJWT = function(token, res) {
//     try {
//         theToken = token["cookie"].split('; ').filter( pair => pair.split('=')[0] === 'userToken')[0].split('=')[1]
//         let tokenPayload = jwt.decode(theToken)
//         let username = tokenPayload["username"]
//         const now = new Date()  
//         const epochTime = Math.round(now.getTime() / 1000)
//         if (usersDatabase.filter( (user) => user['username'] === username ).length === 1 )  {
//             if(Number(tokenPayload["exp"]) - epochTime >= 0 ) {
//                 return theToken
//             } else {
//                 return res.redirect('/login')
//             }
//         } else {
//             return res.redirect('/login')
//         }
//     } catch (error) {
//         return res.redirect('/login')
//     }
//   }
  
//   module.exports.returnToken = function(req, res) {
//       if(loginHandler.loggedIn(req)) {
//           let token = createSignedJWT(req, res)
//           loginHandler.clearCookies(req, res)
//           return token
//       } else {
//           res.send('401: Unauthorized')
//       }
//   }
  
  
  
  
  
  
  




// Challenge 3
//     add signature to token
//     run with PASSPHRASE='1234' node server.js 


let fs = require('fs')
let jwt = require("jsonwebtoken")
let path = require('path')
let querystring = require('querystring')

let loginHandler = require('../loginHandler/login')


const createSignedJWT = function(req, res) {
    const jti = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const now = new Date()  
    const epochTime = Math.round(now.getTime() / 1000)
    try {
        username = req.headers.cookie.split('; ').filter( pair => pair.split('=')[0] === 'username')[0].split('=')[1]
    } catch {
        loginHandler.logout(res)
        res.send("Token request invalid")
    }
    let payload = {
        "jti": jti,
        "exp": epochTime + 15,                                           
        "iat": epochTime,
        "username": username
    }
    const privateKey = fs.readFileSync( path.join(__dirname, "../public", "certificate", "key.pem"))
    const token = jwt.sign(payload,{"key": privateKey, "passphrase": process.env.PASSPHRASE}, { algorithm: 'RS256' });  // passphrase is the password you use when generating the certificate
   
    res.cookie("userToken", token) 
    return token
}



module.exports.verifyJWT = function(token, res) {

    const cert = fs.readFileSync('public/certificate/cert.pem', "utf8");  // get public key
    try {
        const theToken = token["cookie"].split('; ').filter( pair => pair.split('=')[0] === 'userToken')[0].split('=')[1]
        const checkedToken = jwt.verify(theToken, cert)
        return checkedToken
    } catch (TokenExpiredError) {
        const query = querystring.stringify({
            "tokenExpired":"true"
        })
        loginHandler.logout(res)
        return res.redirect('/login?' + query)
    }
}


module.exports.returnToken = function(req, res) {
    if(loginHandler.loggedIn(req)) {
        let token = createSignedJWT(req, res)
        loginHandler.clearCookies(req, res)
        return token
    } else {
        res.send('401: Unauthorized')
    }
}

