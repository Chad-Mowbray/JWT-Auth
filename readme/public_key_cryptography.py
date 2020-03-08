import random

# https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange
# http://billatnapier.com/security02.aspx

# both g and p should be primes
# s is the shared secret, known only to alice and bob

g = 3
p = 23

alice_private = random.randint(1,100)  # only Alice know this
alice = pow(g, alice_private) % p

bob_private = random.randint(1,100)
bob = pow(g, bob_private) % p


print(f"alice: {alice}, bob: {bob}")


s_alice = pow(bob, alice_private) % p
s_bob = pow(alice, bob_private) % p

print(f"s_alice = {s_alice}, s_bob = {s_bob}")