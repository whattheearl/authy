import * as jose from 'jose';

const jwk1 = await jose.generateKeyPair('PS256');
const publicJwks = await jose.exportJWK(jwk1.publicKey);
const privateJwks = jwk1.privateKey;

export const getPublicJwks = () => {
    console.log('getPublicJwks', publicJwks);
    return publicJwks;
};

export const getPrivateJwks = () => {
    return privateJwks;
}
