import { encrypt, decrypt } from 'src/utils'

export const setLastPassword = async (ctx, { pw, type }) => {
  let mode = 'AES-GCM',
    length = 256,
    ivLength = 24,
    password = 'f1e6f5bea18388e32b14dd07d203ff892a207396262b282d07d194d860fe5b57',
    salt = 'c216e441cfdae481bdc09a9c83b41f3d82dd56943f9545f7f165573d9c65a8d1'

  let encrypted = await encrypt(pw, password, salt, mode, length, ivLength)
  ctx.commit('setLastCrypt', { encrypted: encrypted, type: type })
}

export const getLastPassword = async (ctx, { type }) => {
  let mode = 'AES-GCM',
    length = 256,
    password = 'f1e6f5bea18388e32b14dd07d203ff892a207396262b282d07d194d860fe5b57',
    salt = 'c216e441cfdae481bdc09a9c83b41f3d82dd56943f9545f7f165573d9c65a8d1'

  let encr = ctx.getters['getLastCrypt'](type)
  let decrypted = ''

  if (encr) {
    // convert from Array to ArrayBuffer/Uint8Array
    let ct = new Uint8Array(encr.cipherText)
    let iv = new Uint8Array(encr.iv)
    let crypt = {
      cipherText: ct.buffer,
      iv: iv
    }
    decrypted = await decrypt(crypt, password, salt, mode, length)
  }
  return decrypted
}
