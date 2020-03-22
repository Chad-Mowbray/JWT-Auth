let jwt = require('jsonwebtoken')


let token = "eyJ0eXAiOiJKV1QifQ.eyJqdGkiOiJxcWxianl5enMzeDZvNjF6IiwidXNlcm5hbWUiOiJhIiwicGFzc3dvcmQiOiJhIn0.S"
// let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
let x = jwt.decode(token)

console.log(x)