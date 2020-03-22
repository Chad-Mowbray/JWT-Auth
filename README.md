# JSON Web Tokens
// Put the token in the Authorization header

What is a JSON web token?  A JWT (pronounced "jot" for whatever reason) is a very strange looking bit of JSON that is commonly used to keep track of who a user is (authentication) and what they are allowed to do (authorization).

Don't panic just yet, but here is what one looks like:

```bash
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZTF5MXp3M2RsNzl6d2ZqIiwiZXhwIjoxNTgzNjk1MzA2LCJpYXQiOjE1ODM2OTUyODYsInNjb3BlIjoic2VjcmV0cGFnZTpyZWFkIiwidXNlcm5hbWUiOiJDb29sVXNyMTIzIn0.PuFd1Re1vtKrHpRsYdjBl4FGM48lbdM2AgOSJzDEcDmd0qN9UAQVU_86yWma8RL9MEbxPMc5HW1x9YtQYz_VaXsLofOQh6-tehSQOmbLlboB_lfuuGwiyKnTlQF_mPBZ8HTUQlnS5MQzgVx8iE_8CAM3LlFZQ858mBEC9z9i0kXxvS2FfEw4bO-YNZOm01NfEk0SZrG6gY5RofV1vUw2agRsRBHogr9HheRCFrOyvdq_wJrKbNgF6nSXirvIa1iSFNDy9ufmhJTryZDdGgOwdwTREy7_w1RVyypmBM3a5YX2vyFMaQ-_oIdOJpODS-Rp7eujD0jRrEf58PDaKslv1F0zCGG7VMnRMbNujlo29Fg7mou1Rev3cC_Eb_ofYmJJfps9d6WRvdPqrfYvUmF85HtJgdLhr1mC_nF6y9u93cWxhhgjNZc5r_JkYDjIugXc27JAk2UO1Y4Ad3IRVw8rgRCOd2ukUixxTCF-2iS0VYWJexRZEu_SOg4_H6-p3tGT8rfcyXHArTArgpe5hXjduFBQVnq1uE10egJOrExN6tYmy2U4yQwPesEa_7AQaLcEI8QrGgeVi3p1hltTFdFFwNLkFyWqvyKhBeL164YUKsYW4DLefqcSgcGcPMxC5GXJJsJ2lIX60ooARpVCsTUcKPwSqZViTieK8qvs_SUneUs
```

Believe it or not, this blob of characters is actually used to cut down on clutter.  The problem is this:  the HTTP protocol is stateless (like trying to have a conversation with someone with complete amnesia).  Every time your browser makes a new request to a server, it has to send everything (username, password, etc) every single time--to remind the server who it is.  This is not only inefficient, but it can be dangerous too.

The more times you send your information to the server, the greater the chances are that someone will intercept your traffic.  Very risky.  So you want to minimize the exposure of particularly sensitive information (like a password).

We'll see how the JWT helps protect a user's credentials in a little bit, but for now let's take a look inside the JWT.

The first thing to notice is that there are three sections, separated by periods. This might look like encrypted text to you, but it is actually just <i>encoded</i>--in a variety of base64.    

 Well, hold on.  Before we continue, why don't we make this JWT thing a little bit more readable so we can see what we're working with:

```javascript
let JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZTF5MXp3M2RsNzl6d2ZqIiwiZXhwIjoxNTgzNjk1MzA2LCJpYXQiOjE1ODM2OTUyODYsInNjb3BlIjoic2VjcmV0cGFnZTpyZWFkIiwidXNlcm5hbWUiOiJDb29sVXNyMTIzIn0.PuFd1Re1vtKrHpRsYdjBl4FGM48lbdM2AgOSJzDEcDmd0qN9UAQVU_86yWma8RL9MEbxPMc5HW1x9YtQYz_VaXsLofOQh6-tehSQOmbLlboB_lfuuGwiyKnTlQF_mPBZ8HTUQlnS5MQzgVx8iE_8CAM3LlFZQ858mBEC9z9i0kXxvS2FfEw4bO-YNZOm01NfEk0SZrG6gY5RofV1vUw2agRsRBHogr9HheRCFrOyvdq_wJrKbNgF6nSXirvIa1iSFNDy9ufmhJTryZDdGgOwdwTREy7_w1RVyypmBM3a5YX2vyFMaQ-_oIdOJpODS-Rp7eujD0jRrEf58PDaKslv1F0zCGG7VMnRMbNujlo29Fg7mou1Rev3cC_Eb_ofYmJJfps9d6WRvdPqrfYvUmF85HtJgdLhr1mC_nF6y9u93cWxhhgjNZc5r_JkYDjIugXc27JAk2UO1Y4Ad3IRVw8rgRCOd2ukUixxTCF-2iS0VYWJexRZEu_SOg4_H6-p3tGT8rfcyXHArTArgpe5hXjduFBQVnq1uE10egJOrExN6tYmy2U4yQwPesEa_7AQaLcEI8QrGgeVi3p1hltTFdFFwNLkFyWqvyKhBeL164YUKsYW4DLefqcSgcGcPMxC5GXJJsJ2lIX60ooARpVCsTUcKPwSqZViTieK8qvs_SUneUs"

let buff = Buffer.from(JWT, 'base64');  
let text = buff.toString('utf-8');

console.log(text); 
```

```javascript
{"alg":"RS256","typ":"JWT"}{"jti":"9e1y1zw3dl79zwfj","exp":1583695306,"iat":1583695286,"scope":"secretpage:read","username":"CoolUsr123"}�WuE�o��ǥv0e�Q���[t̀���1gt��TT�βZf�D�L�O1�G[\}b���Z^��|�!��^�$���n���*t�@_�<|5�t�1
�� ���y���v��&��6z�%���$�4<����%:�d7F���4D˿��rʙ�3v�a}��SC��!Ӊ����{z���4k�|<6��[�L�n�2tLlۣ�����Qz��
                                                                                                 ��ؘ�_��]�dot��}�Ԙ_9�`t�k�`��^���wqla�e�k��2.�w6�$�C�c�܄U���D#����_��-ab^�D�􎃏���w�d���2\p+L
��a^7n��n]���z����N2CްF��-�
Ɓ�bޝa���tQp4��j�ȨAx�z�
���
   ���Ġpg3�rI���!~����P�MG
?�eX��⼪�?II�R
```
Admittedly, it's still not perfect, but the base64 decoding has revealed some useful information for us. At least now we can see <i>something</i>.  Let's fix the formatting a little bit:

```javascript
{
  "alg": "RS256",
  "typ": "JWT"
}
// and
{
  "jti": "9e1y1zw3dl79zwfj",
  "exp": 1583695306,
  "iat": 1583695286,
  "scope": "secretpage:read",
  "username": "CoolUsr123"
}
// and then it's just a bunch of garbage...for now
```
That's better.  It's starting to look more like JSON and less like a cat napping on a keyboard.

In JWT lingo, these key/value pairs are called "claims".  These "claims" are what tell an application what it needs to know about a user.  Some of them seem pretty cryptic even after decoding (any guesses for "jti"?).  That's because the JWT was invented, in part, to save space.

#### Roll Your Own
Now that you've seen what a JWT looks like, and have done some reverse engineering, let's go a head and build up our own JWT from scratch.  It's actually not that hard.

As you now know, JWTs have three sections (there are other variations, but you don't need to worry about them).  These sections are
1. Header
2. Body
3. Signature

![JWT Structure](readme/JWT_structure.webp)

The first section of the JWT is called the "header".  And like an HTTP header, it gives the recipient metadata about the message's contents.  In this case, the algorithm used to sign the token (more on that later) is RS256, one of the most common. 

Here is how you go from:

```javascript
{
  "alg": "RS256",
  "typ": "JWT"
}
```
to
```bash
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9
```

First we need a regular Javascript object:
```javascript
let header = {
  "alg": "RS256",
  "typ": "JWT",
}
```
Then we convert the object into JSON (this is a JSON Web Token after all)
```javascript
let headerAsJSON = JSON.stringify(header)
```

Then we encode that JSON object into utf8
```javascript
let utf8Header = Buffer.from(headerAsJSON).toString("utf8")
```

If you have been logging these variables, you are probably dissapointed that nothing looks different.  But this next step should be very exciting
```javascript
let base64Header = Buffer.from(utf8Header).toString("base64")
```
In other words: 
```bash
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsInNvbWV0aGluZ0Vsc2UiOiJyYW5kb21TdHVmZiJ9
```
What a beautiful sight!

Now that we've taken care of the header, let's move on to the payload.  The payload is really what we care about.  It is the information that the application needs about a user.  What kind of information do we put in the JWT?

The Internet Engineering Task Force, the people who make all the rules that most people mostly follow on the internet, published a document on JWTs to make sure everyone was on the same page. You can take a peek [here](https://tools.ietf.org/html/rfc7519) if you have a high tolerance for boredom.

>   None of the claims defined below are intended to be mandatory to use or implement in all cases, but rather they provide a starting point for a set of useful, interoperable claims.  Applications using JWTs should define which specific claims they use and when they are required or optional.

Fascinating!  What this means is that, you can basically put whatever you want in a JWT.  Technically.  But the reality is that pretty much everyone pretty much follows the same conventions.  How exactly you structure your JWT, and the claims you include in it, will depend on your application's requirements.


In our particular JWT, the JWT ID (jti) is a unique identifier for our token, like a serial number.  Next we have the token's expiration time in seconds (here is more about [the Epoch](https://en.wikipedia.org/wiki/Unix_time)).  

How long should a token be valid for?  Well that depends on a lot of factors, but typically they range from a few minutes to a few days.  You'll need to choose an appropriate expiration based on your application's needs.

Next we have "scope".  This is where the token bearer's permissions are stored.  It answers the authorization question, "What am I allowed to do?".  In this case, the token bearer is allowed to make GET requests to "secretpage".

I suppose that's enough about the payload for now.  Let's make one!

We start with our payload:

```javascript
let payload = {
  "jti": "9e1y1zw3dl79zwfj",
  "exp": 1583695306,
  "iat": 1583695286,
  "scope": "secretpage:read",
  "username": "CoolUsr123"
}
```
Then we convert the object into JSON (this is a JSON Web Token after all)
```javascript
let headerAsJSON = JSON.s...
```

Woah, hold on, I just had deja vu.  Haven't we done this already?  Instead of rewriting everything for every section, let's create a generalized function that can handle both the header and the payload:

```javascript
const convertToJWT = function (JWTSection) {
    let sectionAsJSON = JSON.stringify(JWTSection)
    let utf8Section = Buffer.from(sectionAsJSON).toString("utf8")
    let base64Section = Buffer.from(utf8Section).toString("base64")

    return base64Section
}

convertToJWT(payload)
```
That should give us:
```bash
eyJqdGkiOiI5ZTF5MXp3M2RsNzl6d2ZqIiwiZXhwIjoxNTgzNjk1MzA2LCJpYXQiOjE1ODM2OTUyODYsInNjb3BlIjoic2VjcmV0cGFnZTpyZWFkIiwidXNlcm5hbWUiOiJDb29sVXNyMTIzIn0=
```

That wasn't so bad.


OK, so far we have the header which contains metadata, and the payload which contains the JWT's content.  What about all that gibberish in the third section?

The truth is that I lied to you earlier.  The JWT is actually both encoded <i>and</i> encrypted. The third section of the JWT is called the "signature" and can be encrypted.  The signature solves an important problem.

Since the header and body are unencrypted (only base64 encoded), anyone could intercept a token and change things, or simply create their own.  There has to be a way to ensure that the contents of the token haven't been tampered with along the way, and that the token was generated by a trusted component.

(Just a friendly heads up.  You might want to refresh your memory about certificates and Public Key Infrastructure (public/private key pairs) that we learned about earlier)

The JWT's signature is there to ensure both of those things.  It works like this: the token's header and payload are concatenated and encrypted with an algorithm that uses the "private key" when the token is generated.  Then, when the token is received, a "public key" that corresponds to the "private key" is used to decrypt the signature and ensure that everything matches.

So the signature allows us to trust the information we find in the payload--that it was created by a trusted component, and that it hasn't been tampered with since.

Now that we know how a JWT signature works, let's implement one.

First we need to generate a public/private key pair

```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

Here is our private key WHICH WE WOULD NEVER EVER SHARE WITH ANYONE:

```bash
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/K34aBHreiUZT
wy8c/Ml6WcL6W2/PoiNSYY5Wff086Fn0VUV6vCuvsBLJPlYyZ7krdcuvxYrcDig8
iV7sZZGN3x87caSZm6wkiKIkQN75eZYm6oDpD3RgpKoYU/THXW/knXUQ16y9gdLy
UUaaZesrVOuVr9VbuyUvD/6fc9/+RcwErVCDsyq1Cq4UadX+du7dnR6jpcwmvdBO
VKHIUzIEpZt2eyMvrO0AB7xgafE89OB44ZTtmzF8BD7yRnQgLkYoUswm1pkZuHuv
obMcvd6eSSeDLvs8t9/DpPl5qcAlOAn4l0VuKOgv5kc0vcD+GUm1Xr3hY0iYBFjP
I0887/RpAgMBAAECggEAb7PkLSOs/9dKhqsoHlH/EETezxcakEJ3TS2/0/4uOKaz
2TbyMDM/e5rwfzKzfyRoaGKeMAjHiKmlDSpfktYOZM2ZHEzdFvyFa5uC0pgtMay/
9eFUjdn/8HCHC0wTXWLVfMocm0jKoLj5H6oqDRG8hkdKmN5zVvRVV9iKuXUlzxbI
kIv/y2/mGFTDfXXTNgOOXqwEyL18hRCbemZylPr+siSXgYldUlghgEsuVeDOiq2o
ojF7qnJAbAReTpUhDozHE5XiCfyrXT+nfT2bdY7ngwfu+ChEQX79c3zDPSdX6/qa
d5veGD/qzlm70tzxcXZfe60sl9UOQ3hvDFhr+SzPAQKBgQD95/FpwONirQXngTjL
jo7HVlADdw58oZMdjyffhPIEpafBkoFzCGc7283hJ1L7TAliK95Hv+Vn4HqZ7Rvl
n5FHYviVJmsY96RdXzgiv02OO+rIT06HVgXpjQlRnnE1h78Os8u+OBi+1lQoYied
JKCWfOeX8i2BILDj+dmWMFAnOQKBgQDAvxkyWMLNT5+5f1P1mBDgqisOR7sYJnwN
cZnoK/HD4rhQmqI9sVZFp8IDwSankXR9TI66L8UJg/lZzmRipnBT5ZTmO55dgTbj
tNQzRgnS7oTrFNzoKDAJbFQGxbDdzy38H31k+4qgORBqHqvgxK6W1dC9iGict8rq
f9sOI+WGsQKBgC4EqcaHBS9POLC6xPZvwgTy6dGW9HM2PZmv5oQmbk7VT1BQI1Ic
BcndjrTuEaYmI9U9Ki5K42MuVkorpVC62PPdRjySF/sQdyPNLDlv/rh2t5jSduMk
fjHUNAos80vGbKRXhefV9vYvllUzZQagKtLblIX/iKvMpwLKt9r2qrBRAoGAYmyz
NyxwPVtdmuHUQ+NlKvR6jA5BEfIFAvBxwUc/a+IIcNCl7I70GRmzTyuAy6zRKXLA
p37hRRypZhyo0l9fmNfxkyf6lJD5MIoUmiI3vgiiw1CiBcMP1KAGwHaO/JVhTA/g
foKcpXi+UxJafqqw5MFGmKJhmTWZXunvOGdIO+ECgYAVTmL2g3DPMd9EvZD23PZD
xwPiYeuQF/UEysO58HRbCJWiVv6gvcO5ZwV4cZVNZR/7EBSvFPiO0Qpizadw6/Pz
X75WHjVFMIRrPREZt2qV4liYuicpmrkW8SyBwWOonsERioTV7+dEkVASizUvrRin
Jy77d/v70z2EjSzXTF15Ww==
-----END PRIVATE KEY-----
```

We're going to need that when we encrypt the signature.  

In order to do this next part we are going to make things a little bit easier on ourselves and use a library that someone else wrote for us.  Often times someone else has already done most of the hard work for us.  Once we install the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) module, we can use it to sign our token.

```bash
npm install jsonwebtoken
```

Then we'll need to add an import ("require") statement at the top of our file:

```javascript
const jwt = require('jsonwebtoken')
```

The documentation tells us that there is a method for signing JWTs: 

```javascript
jwt.sign(payload, secretOrPrivateKey, [options, callback])
```

It's a convention that things in brackets are optional.  So we need a payload (which we already know about), and a private key (which we just made).

```javascript
const jwt = require('jsonwebtoken')

let payload = {
  "jti": "9e1y1zw3dl79zwfj",
  "exp": 1583695306,
  "iat": 1583695286,
  "scope": "secretpage:read",
  "username": "CoolUsr123"
}
const privateKey = fs.readFileSync('key.pem')

const signedToken = jwt.sign(payload, privateKey, {"algorithm": "RS256"});
```

Our token should look like this:

```bash
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZTF5MXp3M2RsNzl6d2ZqIiwiZXhwIjoxNTgzNjk1MzA2LCJpYXQiOjE1ODM2OTUyODYsInNjb3BlIjoic2VjcmV0cGFnZTpyZWFkIiwidXNlcm5hbWUiOiJDb29sVXNyMTIzIn0.OQT9zrDjM3Q4r5DbBJmtQwCctutMBldXog6v_dVgwHVJT4NTw-gvxF2jo7iHbWzm2YJ1rzmDB10kzLY_eB_kiv_2CPZt9c7JpJGix1WpylvCcj_0ft1NxBUi2pD6UPR7RXPcDMLp87_vyOqjytIkGA4Mctxffn5mKRrgNVL4bkJlpBlB62fANNkoPc98QhWBM5R54LdZC3Ew-EEGpG4MaU9ZR5bU-pMTg4rj-sQdBR-NofvkWJya2eh0yMm6WxonHPWJbDqfFMk_-d0wV7d0EyDF_00sgkO2btnRBlNdHcHRsnOmEh97U6T8hthyUkaJDvXCgr_AQVm0lN4XhwL8TQ
```

For convenience, we can paste it into the token debugger at jwt.io, where we see our payload and header.  Finally, we can check our token's signature by pasting in the public key.  If we've done everything correctly we should find that the token signed with the private key can be verified by the corresponding public key.











Now that we know about JWTs and Public Key Cryptography, we are going to combine them to implement an authentication/authorization system for a website.




## Challenges

For today's challenge, you are going to be improving an already-existing codebase.  The first thing you'll want to do is fire it up and kick the tires.  How are things working?  Are there any bugs?  How is the code structured and organized?

After you feel like you know what is happening in the code, start in on the next challenge.

run with:
 PASSPHRASE='1234' node server.js



 ### Challenge 1: What to Put in the Payload?

 The developer who worked on this code before you thought it would be convenient to add the user's credentials to the token's payload.  Maybe that's why he doesn't work here anymore.  You don't want to store things like passwords in a token, because it might not be encrypted.  Plus, the whole point of JWTs is so that you don't have to send a user's credentials in every request.

 Think about what you need, and change your token's payload. 


 You'll then need to modify the function that checks the token's validity accordingly.


### Challenge 2: Check JWT Expiration
  
  Once you get that going, if you haven't already, add a check for the token's expiration.


 ### Challenge 3: Add a Signature

 The token you've got right now is just plain base64 encoded JSON.  Anybody could make their own token and your server wouldn't be the wiser.

 In order trust that the token was actually generated by the server, you should add a signature to your token.  Then you also need to add validity checks that look at the token's signature.



<!-- 
 ### Put the Token in the Authorization Header

 If you've made it this far, congratulate yourself.  But there is more final refinement to make to our server. You might have noticed that we have been storing the token as a cookie in the user's browser.  A cleaner way to do this is to put the token in the [Authorization header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization). -->

