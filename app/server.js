let express = require('express')
let fs = require('fs')
let path = require('path')
let jwt = require("jsonwebtoken")
var nunjucks  = require('nunjucks');
let usersDatabase = require('./database/fakeDatabase')
 
let app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

nunjucks.configure('public', {
    autoescape: true,
    express: app
});

  
const createSignedJWT = function(req, res) {
    const jti = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date()  
    const epochTime = Math.round(now.getTime() / 1000)
    const username = req.headers.cookie.split('; ').filter( pair => pair.split('=')[0] === 'username')[0].split('=')[1]

    let payload = {
        "jti": jti,
        "exp": epochTime + 60,                                           
        "iat": epochTime,
        "scope": "secretpage:read",
        "username": username
    }
    // console.log("PAYLOAD: ", payload)
 
    let privateKey = fs.readFileSync( path.join(__dirname, "public", "certificate", "key.pem"))
    let token = jwt.sign(payload,{"key": privateKey, "passphrase": "1234"}, { algorithm: 'RS256' });  // passphrase is the password you use when generating the certificate
    
    for(let user of usersDatabase) {
        if(payload["username"] === user.username) {
            user.JWT = token
        }
    }
    console.log(usersDatabase)

    res.cookie("userToken", token)
    return token
}

const verifyJWT = function(token) {
    console.log("token in verifyJWT: ", token)
    var cert = fs.readFileSync('public/certificate/cert.pem', "utf8");  // get public key
    console.log("cert in verifyJWT: ", cert)

    let checkedToken = jwt.verify(token, cert)
    return checkedToken
}

// Delete all cookies

function clearCookies(req, res) {
    // console.log('in clearCookies')
    res.cookie("username", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
    res.cookie("password", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
}
 
const returnToken = function(req, res) {
    // console.log("in returnToken")
    // console.log(loggedIn(req))
    if(loggedIn(req)) {
        // console.log('in returnToken, in if')
        // console.log('about to clear cookies')
        // clearCookies(req, res)
        let token = createSignedJWT(req, res)
        clearCookies(req, res)
        return token
        // res.send(token)
    } else {
        res.send('401: Unauthorized')
    }
}

const loggedIn = function(req) {
    // console.log(req.headers.cookie)
    if(!req.headers.cookie){
        return false
    } else {
        let isLoggedIn = req.headers.cookie.split('; ').filter( keyVal => keyVal.split("=")[1] === "true" )
        // console.log("in loggedIn.  Logged in? : ")
        return isLoggedIn ? true : false
    }
}
 
  
app.get('/', function(req, res) {
    // console.log('GET request to /...')
    res.send("This is just an entrypoint. Go to /login to log in, or to /signup to signup")
})

app.get('/login', function(req, res) {
    // console.log('GET request to /login...')
    // console.log(loggedIn(req))
    res.render("login.html", {title: 'Login Page', numUsers: usersDatabase.length, isloggedIn: loggedIn(req)})
})

app.post('/login', function(req, res) {
    // console.log('POST request to /login...')
    if(usersDatabase.filter( (user) => user['username'] === req.body.username ).length === 1 && users.filter( (user) => user['password'] === req.body.password).length === 1) {
        // console.log('Valid user')
        res.cookie("username", req.body.username)
        res.cookie("password", req.body.password)
        // res.cookie("loggedIn", "true")
        return res.redirect("/token")
    } else {
        // console.log(req.body)
        res.send("That was not a valid username/password combination")
    }

})

app.get('/signup', function(req, res) {
    // console.log('GET request to /signup...')
    res.render("signup.html", {notSignedUpYet: true, title: 'Signup Page', numUsers: usersDatabase.length, isLoggedIn: loggedIn(req)})
})

app.post('/signup', function(req, res) {
    if(usersDatabase.filter( (user) => user['username'] === req.body.username ).length === 0 && usersDatabase.filter( (user) => user['password'] === req.body.password).length === 0) {
        usersDatabase.push({
            username: req.body.username,
            password: req.body.password
        })
        // console.log(usersDatabase)
    } if(usersDatabase.filter( (user) => user['username'] === req.body.username).length === 1) {
        res.render("signup.html", {notSignedUpYet: false, newUser: req.body.username, numUsers: usersDatabase.length, isLoggedIn: loggedIn(req)})
    } else {
        res.send("Please try again")
    }
})

app.get('/token', function(req, res) {
    if(loggedIn(req)) {
        // console.log('Logged in at /token')
        const token = returnToken(req, res) 
        if(token.length > 1) {
            res.send('You should have a token now')
        } else {
            res.send("There was a problem with your token")
        }
    } else {
        res.send('Invalid credentials')
    }
})

app.get('/secretpage', function(req, res) {
    // console.log('GET request to /secretpage...')
    // console.log(req.headers.cookie)
    const token = req.headers.cookie.split('; ').filter( pair => pair.split('=')[0] === 'userToken')[0].split('=')[1]

    console.log("TOKEN in /secretpage", token)
    if(verifyJWT(token)) {
        res.render("secretpage.html", {title: 'Secret Page', numUsers: usersDatabase.length, isLoggedIn: loggedIn(req)})

    } else {
        res.send('You are not authorized to see /secretpage')
    }

})
 
// app.post('/publickey', function(req, res) {
//     returnPublicCert(req, res)
// })
 
// app.post('/token', function(req, res) {
//     returnToken(req, res)
// })
 
app.listen(5000, function() {
    console.log("server running.....")
})