// INFO: only supports HMAC sha-512 
import * as nodeCrypto from "node:crypto";

// TODO: rewrite in web crypto
export const randomBytes = (length: number) => nodeCrypto.randomBytes(length).toString('hex');

export async function generateKey() {
  let key = await crypto.subtle.generateKey(
    {
      name: "HMAC",
      hash: { name: "SHA-256" },
    },
    true,
    ["sign", "verify"],
  );

  console.debug(key);
  return key;
}

export async function exportCryptoKeyToJwk(key: CryptoKey) {
  const exported = await crypto.subtle.exportKey(
    "jwk",
    key
  );
  console.debug('exporting key:', exported);
  return exported;
}

export async function importCryptoKeyFromJwk(jwk: JsonWebKey) {
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  console.debug(key);
  return key;
}

export function encodeData(data: Object) {
  const str = JSON.stringify(data);
  const enc = new TextEncoder();
  const encoded = enc.encode(str);
  return encoded;
}

export async function signMessage(data: Object, key: CryptoKey) {
  const encoded = encodeData(data);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoded
  );
  return signature;
}

export async function verifyMessage(data: Object, signature: ArrayBuffer, key: CryptoKey) {
  const encoded = encodeData(data);
  let result = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoded
  );

  return result;
}

