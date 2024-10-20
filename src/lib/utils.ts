import * as nodeCrypto from 'node:crypto';

export const randomBytes = (length: number) =>
    nodeCrypto.randomBytes(length).toString('hex');


