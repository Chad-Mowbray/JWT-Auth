 let express = require('express')
let fs = require('fs')
let path = require('path')
let jwt = require("jsonwebtoken")

let users = require('./database/fakeDatabase')
 
let app = express()
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// app.use(bodyParser.json()); 
// app.use(bodyParser.urlencoded({ extended: true })); 
 
 
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
 

console.log(users())
 
 
app.get('/', function(req, res) {
    console.log('GET request to /...')
    res.send("This is just an entrypoint. Go to /login to log in, or to /signup to signup")
})

app.get('/login', function(req, res) {
    console.log('GET request to /login...')
    res.sendFile(path.join(__dirname + '/public/login.html'));
})

app.post('/login', function(req, res) {
    console.log('POST request to /login...')
    usersArr = users()    
    if(usersArr.filter( (user) => user['username'] === req.body.username ).length === 1 && usersArr.filter( (user) => user['password'] === req.body.password).length === 1) {
        console.log('Valid user')
        res.cookie("username", req.body.username)
        res.cookie("password", req.body.password)
        return res.redirect("/token")
    }


    console.log(req.body)
    res.send("You have made a post to /login")
})

app.get('/signup', function(req, res) {
    console.log('GET request to /signup...')


    res.sendFile(path.join(__dirname + '/public/signup.html'));
})

app.get('/token', function(req, res) {

    
    res.send('you should get a token here')
})

app.get('/secretpage', function(req, res) {
    console.log('GET request to /secretpage...')
    res.sendFile(path.join(__dirname + '/public/secretpage.html'));
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