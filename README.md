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

How do we know what goes where in a JWT?

The Internet Engineering Task Force, the people who make all the rules that most people mostly follow on the internet, published a document on JWTs to make sure everyone was on the same page. You can take a peek [here](https://tools.ietf.org/html/rfc7519) if you have a high tolerance for boredom.

>   None of the claims defined below are intended to be mandatory to use or implement in all cases, but rather they provide a starting point for a set of useful, interoperable claims.  Applications using JWTs should define which specific claims they use and when they are required or optional.

Fascinating!  What this means is that, you can basically put whatever you want in a JWT.  Technically.  But the reality is that pretty much everyone pretty much follows the same conventions.  How exactly you structure your JWT, and the claims you include in it, will depend on your application's requirements.

The first section of the JWT is called the "header".  And like an HTTP header, it gives the recipient metadata about the message's contents.  In this case, the algorithm used to sign the token (more on that later) is RS256, one of the most common.  

![JWT Structure](readme/JWT_structure.webp)

In our particular JWT, the JWT ID (jti) is a unique identifier for our token, like a serial number.  Next we have the token's expiration time in seconds (here is more about [the Epoch](https://en.wikipedia.org/wiki/Unix_time)).  

How long should a token be valid for?  Well that depends on a lot of factors, but typically they range from a few minutes to a few days.  You'll need to choose an appropriate expiration based on your application's needs.

Next we have "scope".  This is where the token bearer's permissions are stored.  It answers the authorization question, "What am I allowed to do?".  In this case, the token bearer is allowed to make GET requests to "secretpage".

OK, so far we have the header which contains metadata, and the payload which contains the JWT's content.  What about all that gibberish in the third section?

The truth is that I lied to you earlier.  The JWT is actually both enoded <i>and</i> encrypted. The third section of the JWT is called the "signature" and can be encrypted.  The signature solves an important problem.

Since the header and body are unencrypted (only base64 encoded), anyone could intercept a token and change things, or simply create their own.  There has to be a way to ensure that the contents of the token haven't been tampered with along the way, and that the token was generated by a trusted component.

(Just a friendly heads up.  You might want to refresh your memory about certificates and Public Key Infrastructure (public/private key pairs) that we learned about earlier)

The JWT's signature is there to ensure both of those things.  It works like this: the token's header and payload are concatenated and encrypted with a "private key" when the token is generated.  Then, when the token is received, a "public key" that corresponds to the "private key" is used to decrypt the signature and ensure that everything matches.

So the signature allows us to trust the information we find in the payload--that it was created by a trusted component, and that it hasn't been tampered with since.

At this point, we might ask the obvious question, "How does the receiver of a token know to check the validity of the token's signature?".  To answer this question, we need to learn more about public/private key pairs.


Now that we know about JWTs and Public Key Cryptography, we are going to combine them to implement an authentication/authorization system for a website.




## Challenges

run with:
 PASSPHRASE='1234' node server.js