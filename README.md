# JSON Web Tokens
// Put the token in the Authorization header

What is a JSON web token?  A JWT (pronounced "jot" for whatever reason) is a very strange looking bit of JSON that is commonly used to keep track of who a user is (authentication) and what they are allowed to do (authorization).

Don't panic just yet, but here is what one looks like:

```bash
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZTF5MXp3M2RsNzl6d2ZqIiwiZXhwIjoxNTgzNjk1MzA2LCJpYXQiOjE1ODM2OTUyODYsInNjb3BlIjoic2VjcmV0cGFnZTpyZWFkIiwidXNlcm5hbWUiOiJDb29sVXNyMTIzIn0.PuFd1Re1vtKrHpRsYdjBl4FGM48lbdM2AgOSJzDEcDmd0qN9UAQVU_86yWma8RL9MEbxPMc5HW1x9YtQYz_VaXsLofOQh6-tehSQOmbLlboB_lfuuGwiyKnTlQF_mPBZ8HTUQlnS5MQzgVx8iE_8CAM3LlFZQ858mBEC9z9i0kXxvS2FfEw4bO-YNZOm01NfEk0SZrG6gY5RofV1vUw2agRsRBHogr9HheRCFrOyvdq_wJrKbNgF6nSXirvIa1iSFNDy9ufmhJTryZDdGgOwdwTREy7_w1RVyypmBM3a5YX2vyFMaQ-_oIdOJpODS-Rp7eujD0jRrEf58PDaKslv1F0zCGG7VMnRMbNujlo29Fg7mou1Rev3cC_Eb_ofYmJJfps9d6WRvdPqrfYvUmF85HtJgdLhr1mC_nF6y9u93cWxhhgjNZc5r_JkYDjIugXc27JAk2UO1Y4Ad3IRVw8rgRCOd2ukUixxTCF-2iS0VYWJexRZEu_SOg4_H6-p3tGT8rfcyXHArTArgpe5hXjduFBQVnq1uE10egJOrExN6tYmy2U4yQwPesEa_7AQaLcEI8QrGgeVi3p1hltTFdFFwNLkFyWqvyKhBeL164YUKsYW4DLefqcSgcGcPMxC5GXJJsJ2lIX60ooARpVCsTUcKPwSqZViTieK8qvs_SUneUs
```

Believe it or not, this blob of characters is actually used to cut down on clutter.  The problem is this:  the HTTP protocol is stateless (like trying to have a conversation with someone with complete amnesia).  Every time your browser makes a new request to a server, it has to send everything (username, password, etc) every single time--to remind the server who it is.  This is not only inefficient, but it can be dangerous too.

The more times you send your information to the server, the greater the chances are that someone will intercept your traffic.  Very risky.  So you want to minimize the exposure of particularly sensitive information (like a password).

We'll see how the JWT helps protect a user's credentials in a little bit, but for now let's take a look inside the JWT

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
Admittedly, it's still not perfect, but the base64 decoding has revealed some useful informatio for us. At least now we can see <i>something</i>.  Let's fix the formatting a little bit:

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

The Internet Engineering Task Force, the people who make all the rules that most people mostly follow on the internet, published a document on JWTs to make sure everyone was on the same page. You can take a peek [here](https://tools.ietf.org/html/rfc7519) if you have a high tolerance for boredom.

>   None of the claims defined below are intended to be mandatory to use or implement in all cases, but rather they provide a starting point for a set of useful, interoperable claims.  Applications using JWTs should define which specific claims they use and when they are required or optional.

Fascinating!  What this means is that, you can basically put whatever you want in a JWT.  But how exactly you structure your JWT, and the claims you include in it, will depend on your application's requirements.

The first section of the JWT is called the "header".  And like an HTTP header, it gives the recipient metadata about the message's contents.  In this case, the algorithm used to sign the token (more on that later) is RS256, one of the most common.  

![JWT Structure](readme/JWT_structure.webp)

In our particular JWT, the JWT ID (jti) is a unique identifier for our token, like a serial number.  Next we have the token's expiration time (here is more about [the Epoch](https://en.wikipedia.org/wiki/Unix_time)).  The token's period of validity needs to be chosen based on the application's needs.

Next we have "scope".  This is where the token bearer's permissions are stored.  It answers the authorization question, "What am I allowed to do?".  In this case, the token bearer is allowed to make GET requests to "secretpage".

OK, so far we have the header which contains metadata, and the payload which contains the JWT's content.  What about all that gibberish in the third section?

The truth is that I lied to you earlier.  The JWT is actually both enoded <i>and</i> encrypted. The third section of the JWT is called the "signature" and can be encrypted.  The signature solves an important problem.

Since the header and body are unencrypted (only base64 encoded), anyone could intercept a token and change things, or simply create their own.  There has to be a way to ensure that the contents of the token haven't been tampered with along the way, and that the token was generated by a trusted component.

The JWT's signature is there to ensure both of those things.  It works like this: the token's header and payload are concatenated and encrypted with a "private key" when the token is generated.  Then, when the token is received, a "public key" that corresponds to the "private key" is used to decrypt the signature and ensure that everything matches.

So the signature allows us to trust the information we find in the payload--that it was created by a trusted component, and that it hasn't been tampered with since.

At this point, we might ask the obvious question, "How does the receiver of a token know to check the validity of the token's signature?".  To answer this question, we need to learn more about public/private key pairs.

## Public Key Cryptography

We already know about the Ceasar Cipher.  If you want to exchange encrypted letters with someone using a Ceasar Cipher, you both need to have the same secret number.  But if you are the writer, how do you tell your reader what the secret number is?  You can't simply write in in the top corner of the letter, because anyone who intercepts the letter would be able to decode it.  There are some ways around this.  You might have a dead-drop that you both know about, where you can place the secret number.  But then how do you securely communicate about the dead-drop's location...  It seems like an infinite regression.

Fortunately, there is some math thing that solves this problem for us.  In fact, it is the basis of secure communication on the internet--the "S" in HTTPS.  

Through some kind of magic, public key cryptography allows two people to share encrypted information even when the encryptor uses a publicly available key.  It sounds strange, but here is how it goes.

Alice and Bob want to pass secret messages to each other.  Here is what they do:
Alice generates two very large numbers that are mathematically related, but impossible to guess
Alice keeps one of them to herself <b>(private key)</b>, and posts the other one publicly as her pinned Tweet<b>(public key)</b>.

Bob does the same thing.  
Bob generates two very large numbers that are mathematically related, but impossible to guess.
Bob keeps one of them to himself <b>(private key)</b>, and posts the other one publicly as his pinned Tweet <b>(public key)</b>.

When Bob wants to send a message to Alice, he encrypts his message with <i>Alice's</i> <b>(public key)</b>.  Alice then uses her <b>(private key)</b> to decrypt Bob's message.

The same thing happens when Alice wants to send a message to Bob:
When Alice wants to send a message to Bob, she encrypts her message with <i>Bob's</i> <b>(public key)</b>.  Bob then uses his <b>(private key)</b> to decrypt Alice's message.


It sounds crazy, and it involves math that I won't bother trying to figure out, but we can build a very simple model that shows how it works using very small numbers.

We'll use a Ceasar Cipher to show how Alice and Bob can send an receive encrypted messages without knowing the other's private key.  

Here is how the keys are generated:

```python
# public_key_cryptography.py
import random

class Key:
    def __init__(self, public_key_base, public_key_modulus):
        self.public_key_base = public_key_base
        self.public_key_modulus = public_key_modulus
        self.private_key = random.randint(1,100) 

    def generate_public_key(self):
        return pow(self.public_key_base, self.private_key) % self.public_key_modulus

    def generate_shared_secret(self, another):
        return pow(another, self.private_key) % self.public_key_modulus


def return_shared_secret():
    public_key_base = 3  
    public_key_modulus = 23 
    
    alice_private_secret = Key(public_key_base, public_key_modulus)
    bob_private_secret = Key(public_key_base, public_key_modulus)
    shared_secret_alice = alice_private_secret.generate_shared_secret(bob_private_secret.generate_public_key())
    shared_secret_bob = bob_private_secret.generate_shared_secret(alice_private_secret.generate_public_key())

    return {
        "shared_secret_alice": shared_secret_alice,
        "shared_secret_bob": shared_secret_bob
    }
```

Feel free to let your eyes glaze over.  The point is that, through some mathmatical wizardry, both Alice and Bob end up deciding on the same number for the Ceasar Cipher.

If we now run alice_bob_message_exchange.py, we see that an encrypted message can be sent and received, even though both parties have withheld information.

