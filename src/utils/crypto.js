/*
*   Credits: https://webbjocke.com/javascript-web-encryption-and-hashing-with-the-crypto-api/
*/

// Hex function for ArrayBuffer
/*
function hex (buff) {
  return [].map.call(new Uint8Array(buff), b => ('00' + b.toString(16)).slice(-2)).join('')
}
*/
// Base64 encode
function encode64 (buff) {
  return btoa(new Uint8Array(buff).reduce((s, b) => s + String.fromCharCode(b), ''))
}

// Hash function
function hash (algo, str) {
  return encode64(crypto.subtle.digest(algo, new TextEncoder().encode(str)))
}

// Generate key from password
async function genEncryptionKey (password, salt, mode, length) {
  var algo = {
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: new TextEncoder().encode(salt),
    iterations: 1000
  }
  var derived = { name: mode, length: length }
  var encoded = new TextEncoder().encode(password)
  var key = await crypto.subtle.importKey('raw', encoded, { name: 'PBKDF2' }, false, ['deriveKey'])

  return crypto.subtle.deriveKey(algo, key, derived, false, ['encrypt', 'decrypt'])
}

// Encrypt function
async function encrypt (text, password, salt, mode, length, ivLength) {
  var algo = {
    name: mode,
    length: length,
    iv: crypto.getRandomValues(new Uint8Array(ivLength))
  }
  var key = await genEncryptionKey(password, salt, mode, length)
  var encoded = new TextEncoder().encode(text)

  return {
    cipherText: await crypto.subtle.encrypt(algo, key, encoded),
    iv: algo.iv
  }
}

// Decrypt function
async function decrypt (encrypted, password, salt, mode, length) {
  var algo = {
    name: mode,
    length: length,
    iv: encrypted.iv
  }
  var key = await genEncryptionKey(password, salt, mode, length)
  var decrypted = await crypto.subtle.decrypt(algo, key, encrypted.cipherText)

  return new TextDecoder().decode(decrypted)
}

export { encrypt, decrypt, hash }
