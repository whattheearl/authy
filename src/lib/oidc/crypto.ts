// INFO: only supports HMAC sha-512 
import * as nodeCrypto from "node:crypto";

// TODO: rewrite in web crypto
export const randomBytes = (length: number) => nodeCrypto.randomBytes(length).toString('hex');


