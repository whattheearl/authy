import * as jose from 'jose';

const jwk1 = await jose.generateKeyPair('PS256');
const publicJwks = [await jose.exportJWK(jwk1.publicKey)];
const privateJwks = [jwk1.privateKey];

export const getPublicJwks = async () => {
    console.log('getPublicJwks', publicJwks);
    return publicJwks;
};

export const signJwt = async (data: any) => {
    return await new jose.SignJWT(data)
        .setProtectedHeader({ alg: 'PS256' })
        .setIssuedAt()
        .setIssuer('https://authy.wte.sh')
        .setAudience('https://jeddit.wte.sh')
        .setExpirationTime('1d')
        .sign(privateJwks[0]);
};

export const verifyJwt = async (jwt: string) => {
    const { payload, protectedHeader } = await jose.jwtVerify(
        jwt,
        publicJwks[0],
    );
    return { payload, protectedHeader };
};
