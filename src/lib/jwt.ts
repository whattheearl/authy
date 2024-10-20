import { addJwks, createJwksTable, getJwks } from '$data/jwks';
import * as jose from 'jose';

export const seedJWKs = async () => {
    createJwksTable();
    const jwks = getJwks();
    if (jwks.length == 0) {
        const keyPair = await jose.generateKeyPair('PS256', {
            extractable: true,
        });
        const private_key = await jose.exportJWK(keyPair.privateKey);
        const public_key = await jose.exportJWK(keyPair.publicKey);
        console.log({ private_key, public_key });
        addJwks(JSON.stringify(private_key), JSON.stringify(public_key));
    }
};

export const getPublicKeys = () => {
    const jwks = getJwks();
    const keys = jwks.map((keyPair) => ({
        kid: keyPair.id,
        ...JSON.parse(keyPair.public_key),
    }));
    return keys;
};

export const getPrivateKey = async () => {
    try {
        const jwks = getJwks();
        if (jwks.length == 0) {
            return null;
        }

        const keyTxt = jwks.map((j) => j.private_key)[0];
        console.log({ keyTxt });
        const keyObj = JSON.parse(keyTxt);
        console.log({ keyObj });
        const privateKey = await jose.importJWK(keyObj, 'PS256');
        return privateKey;
    } catch (err) {
        console.error('unable to retrive private key');
    }
};

export const signJwt = async (data: any) => {
    try {
        const key = await getPrivateKey();
        if (!key) {
            console.log('no key found', { key });
            throw new Error('Unable to find privateKey');
        }

        return await new jose.SignJWT(data)
            .setProtectedHeader({ alg: 'PS256' })
            .setIssuedAt()
            .setIssuer('https://authy.wte.sh')
            .setAudience('https://jeddit.wte.sh')
            .setExpirationTime('1d')
            .sign(key);
    } catch (err) {
        console.error('unable to sign');
        console.error(err);
    }
};

export const verifyJwt = async (jwt: string, publicKey: any) => {
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey);
    return { payload, protectedHeader };
};
