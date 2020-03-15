let express = require('express')
let fs = require('fs')
let path = require('path')
let jwt = require("jsonwebtoken")
let nunjucks  = require('nunjucks')
let querystring = require('querystring')
const url = require('url')
let usersDatabase = require('./database/fakeDatabase')
 
let app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

nunjucks.configure('public', {
    autoescape: true,
    express: app
});

  
const createSignedJWT = function(req, res) {
    const jti = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const now = new Date()  
    const epochTime = Math.round(now.getTime() / 1000)
    let username;
    try {
        username = req.headers.cookie.split('; ').filter( pair => pair.split('=')[0] === 'username')[0].split('=')[1]
    } catch {
        logout(res)
        res.send("Token request invalid")
    }
    let payload = {
        "jti": jti,
        "exp": epochTime + 20,                                           
        "iat": epochTime,
        "scope": "secretpage:read",
        "username": username
    }
    const privateKey = fs.readFileSync( path.join(__dirname, "public", "certificate", "key.pem"))
    const token = jwt.sign(payload,{"key": privateKey, "passphrase": process.env.PASSPHRASE}, { algorithm: 'RS256' });  // passphrase is the password you use when generating the certificate
    for(let user of usersDatabase) {
        if(payload["username"] === user.username) {
            user.JWT = token
        }
    }
    // console.log(usersDatabase)
    res.cookie("userToken", token)
    return token
}

const verifyJWT = function(token, res) {
    const cert = fs.readFileSync('public/certificate/cert.pem', "utf8");  // get public key
    try {
        const checkedToken = jwt.verify(token, cert)
        return checkedToken
    } catch (TokenExpiredError) {
        const query = querystring.stringify({
            "tokenExpired":"true"
        })
        logout(res)
        return res.redirect('/login?' + query)
    }
}

const clearCookies = function (req, res) {
    res.cookie("username", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
    res.cookie("password", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
}
 
const returnToken = function(req, res) {
    if(loggedIn(req)) {
        let token = createSignedJWT(req, res)
        clearCookies(req, res)
        return token
    } else {
        res.send('401: Unauthorized')
    }
}

const loggedIn = function(req) {
    if(!req.headers.cookie){
        return false
    } else {
        let isLoggedIn = req.headers.cookie.split('; ').filter( keyVal => keyVal.split("=")[0] === "isLoggedIn" && keyVal.split("=")[1] === "true" )
        console.log(typeof isLoggedIn,"isLoggedIn: ", isLoggedIn)
        try {
            return isLoggedIn[0].split("=")[1]
        } catch {
            return false
        }
   
    }
}

const logout = function(req, res) {
    req.cookie("userToken", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
    req.cookie("isLoggedIn", false)
}
 
  
app.get('/', function(req, res) {
    res.send("This is just an entrypoint. Go to /login to log in, or to /signup to signup")
})

app.get('/login', function(req, res) {
    let refresh = 'ignore'
    console.log(Object.values(url.parse(req.url,true).query))
    if(Object.values(url.parse(req.url,true).query).length > 0) {
        refresh = Object.values(url.parse(req.url,true).query) || false
    }
    if(refresh === true) {
        res.cookie("userToken", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
    }
    console.log(refresh)
    res.render("login.html", {title: 'Login Page', numUsers: usersDatabase.length, isLoggedIn: loggedIn(req), refresh: refresh})
})

app.post('/login', function(req, res) {
    if(usersDatabase.filter( (user) => user['username'] === req.body.username ).length === 1 && users.filter( (user) => user['password'] === req.body.password).length === 1) {
        res.cookie("username", req.body.username)
        res.cookie("password", req.body.password)
        res.cookie("isLoggedIn", "true" )
        return res.redirect("/token")
    } else {
        res.send("That was not a valid username/password combination")
    }
})

app.get('/signup', function(req, res) {
    res.render("signup.html", {notSignedUpYet: true, title: 'Signup Page', numUsers: usersDatabase.length, isLoggedIn: loggedIn(req)})
})

app.post('/signup', function(req, res) {
    if(usersDatabase.filter( (user) => user['username'] === req.body.username ).length === 0 && usersDatabase.filter( (user) => user['password'] === req.body.password).length === 0) {
        usersDatabase.push({
            username: req.body.username,
            password: req.body.password
        })
    } if(usersDatabase.filter( (user) => user['username'] === req.body.username).length === 1) {
        res.render("signup.html", {notSignedUpYet: false, newUser: req.body.username, numUsers: usersDatabase.length, isLoggedIn: loggedIn(req)})
    } else {
        res.send("Please try again")
    }
})

app.get('/token', function(req, res) {
    if(loggedIn(req)) {
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
        const token = req.headers.cookie.split('; ').filter( pair => pair.split('=')[0] === 'userToken')[0].split('=')[1]
        if(verifyJWT(token, res)) {
            res.render("secretpage.html", {title: 'Secret Page', numUsers: usersDatabase.length, isLoggedIn: loggedIn(req)})
        }
})
 
 
app.listen(5000, function() {
    console.log("server running on localhost:5000.....")
})