let express = require('express')
let nunjucks  = require('nunjucks')
const url = require('url')

let usersDatabase = require('./database/fakeDatabase')
const tkn = require('./tokenHandler/token')
let log = require('./loginHandler/login')

 
let app = express()
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
nunjucks.configure('public', {
    autoescape: true,
    express: app
});
 
  
app.get('/', function(req, res) {
    res.send("This is just an entrypoint. Go to /login to log in, or to /signup to signup")
})

app.get('/login', function(req, res) {
    let refresh = 'ignore'
    if(Object.values(url.parse(req.url,true).query).length > 0) {
        refresh = Object.values(url.parse(req.url,true).query) || false
    }
    if(refresh === true) {
        log.deleteUserTokenCookie(req, res)
    }
    console.log(refresh)
    res.render("login.html", {title: 'Login Page', numUsers: usersDatabase.length, isLoggedIn: log.loggedIn(req), refresh: refresh})
})

app.post('/login', function(req, res) {
    if(usersDatabase.filter( (user) => user['username'] === req.body.username ).length === 1 && users.filter( (user) => user['password'] === req.body.password).length === 1) {
        log.setLoginCookie(req, res)
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
    if(log.loggedIn(req)) {
        const token = tkn.returnToken(req, res) 
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
        if(tkn.verifyJWT(token, res)) {
            res.render("secretpage.html", {title: 'Secret Page', numUsers: usersDatabase.length, isLoggedIn: log.loggedIn(req)})
        }
})
 
 
app.listen(5000, function() {
    console.log("server running on localhost:5000.....")
})