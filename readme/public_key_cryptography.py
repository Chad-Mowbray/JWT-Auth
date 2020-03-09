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
   











# import random

# # https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange
# # http://billatnapier.com/security02.aspx

# # both g and p should be primes
# # s is the shared secret, known only to alice and bob

# # both of these are public
# g = 3  
# p = 23


# alice_private = random.randint(1,100)  # only Alice knows this
# alice = pow(g, alice_private) % p

# bob_private = random.randint(1,100)  # only Bob knows this
# bob = pow(g, bob_private) % p


# print(f"alice: {alice}, bob: {bob}")


# s_alice = pow(bob, alice_private) % p
# s_bob = pow(alice, bob_private) % p

# print(f"s_alice = {s_alice}, s_bob = {s_bob}")