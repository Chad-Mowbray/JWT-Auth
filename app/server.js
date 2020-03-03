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

  
const createSignedJWT = function() {
    let payload = {
        "jti": "1234asdf",
        "exp": 1582709897,                                           
        "nbf": 0,
        "iat": 1581709837,
        "email": "anemail@email.com"
    }
 
    let privateKey = fs.readFileSync( path.join(__dirname, "public", "certificate", "key.pem"))
    let token = jwt.sign(payload,{"key": privateKey, "passphrase": "1234"}, { algorithm: 'RS256' });  // passphrase is the password you use when generating the certificate
 
    return token
}
 
const returnToken = function(req, res) {
 
    if(req.query.client_secret == "1234asdf" && req.query.client_id == "internalService") {
        let token = createSignedJWT()
        res.send(token)
    } else {
        res.send('401: Unauthorized')
    }
}

const loggedIn = function(req) {
    console.log(req.headers.cookie)
    if(!req.headers.cookie){
        return false
    } else {
        let isLoggedIn = req.headers.cookie.split('; ').filter( keyVal => keyVal.split("=")[1] === "true" )
        return isLoggedIn ? true : false
    }
}
 
// console.log(usersDatabase)
 
 
app.get('/', function(req, res) {
    console.log('GET request to /...')
    res.send("This is just an entrypoint. Go to /login to log in, or to /signup to signup")
})

app.get('/login', function(req, res) {
    console.log('GET request to /login...')
    // res.sendFile(path.join(__dirname + '/public/login.html'));
    res.render("login.html", {title: 'Login Page', numUsers: usersDatabase.length, isloggedIn: loggedIn(req)})
})

app.post('/login', function(req, res) {
    console.log('POST request to /login...')
//    let usersArr = users   
   loggedIn(req)


    if(usersDatabase.filter( (user) => user['username'] === req.body.username ).length === 1 && users.filter( (user) => user['password'] === req.body.password).length === 1) {
        console.log('Valid user')
        res.cookie("username", req.body.username)
        res.cookie("password", req.body.password)
        res.cookie("loggedIn", "true")
        return res.redirect("/token")
    } else {
        console.log(req.body)
        res.send("That was not a valid username/password combination")
    }

})

app.get('/signup', function(req, res) {
    console.log('GET request to /signup...')
    // res.sendFile(path.join(__dirname + '/public/signup.html'));
    loggedIn(req)

    res.render("signup.html", {notSignedUpYet: true, title: 'Signup Page', numUsers: usersDatabase.length, isLoggedIn: loggedIn(req)})
})

app.post('/signup', function(req, res) {
    loggedIn(req)


    // let usersArr = users
    if(usersDatabase.filter( (user) => user['username'] === req.body.username ).length === 0 && usersDatabase.filter( (user) => user['password'] === req.body.password).length === 0) {
        usersDatabase.push({
            username: req.body.username,
            email: 'default@email.com',
            password: req.body.password
        })
        console.log(usersDatabase)
    } if(usersDatabase.filter( (user) => user['username'] === req.body.username).length === 1) {
        // res.send(`Congratulations, ${req.body.username}!  You've just created an account`)
        res.render("signup.html", {notSignedUpYet: false, newUser: req.body.username, numUsers: usersDatabase.length, isLoggedIn: loggedIn(req)})
    } else {
        res.send("Please try again")
    }

    // res.sendFile(path.join(__dirname + '/public/signup.html'));
})




app.get('/token', function(req, res) {

    loggedIn(req)

    res.send('you should get a token here')
})

app.get('/secretpage', function(req, res) {
    loggedIn(req)

    console.log('GET request to /secretpage...')
    // res.sendFile(path.join(__dirname + '/public/secretpage.html'));
    res.render("secretpage.html", {title: 'Secret Page', numUsers: usersDatabase.length, isLoggedIn: loggedIn(req)})
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