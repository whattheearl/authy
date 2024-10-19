import { addJWKs, getJWKs } from '$data/jwks';
import * as jose from 'jose';

export const seedJWKs = async () => {
    const jwks = getJWKs();
    if (jwks.length == 0) {
        const keyPair = await jose.generateKeyPair('PS256');
        const private_key = await jose.exportJWK(keyPair.privateKey);
        const public_key = await jose.exportJWK(keyPair.publicKey);
        addJWKs(JSON.stringify(private_key), JSON.stringify(public_key))
    }
}

export const getPublicKeys = () => {
    const jwks = getJWKs();
    return jwks.filter(j => j.public_key);
}

export const getPrivateKey = async () => {
    const jwks = getJWKs();
    if (jwks.length == 0) {
        return null;
    }

    const keyTxt = jwks.map(j => j.private_key)[0];
    const keyObj = JSON.parse(keyTxt);
    const privateKey = await jose.importJWK(keyObj);
    return privateKey;
}

export const signJwt = async (data: any) => {
    const key = await getPrivateKey();
    if (!key) {
        throw new Error("Unable to find privateKey");
    }

    return await new jose.SignJWT(data)
        .setProtectedHeader({ alg: 'PS256' })
        .setIssuedAt()
        .setIssuer('https://authy.wte.sh')
        .setAudience('https://jeddit.wte.sh')
        .setExpirationTime('1d')
        .sign(key);
};

export const verifyJwt = async (jwt: string, publicKey: any) => {
    const { payload, protectedHeader } = await jose.jwtVerify(
        jwt,
        publicKey
    );
    return { payload, protectedHeader };
};
