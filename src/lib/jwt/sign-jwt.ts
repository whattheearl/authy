import * as jose from 'jose';

export const signJwt = async (data: any, privateKey: any) => {
    return await new jose.SignJWT(data)
        .setProtectedHeader({ alg: 'PS256' })
        .setIssuedAt()
        .setIssuer('https://authy.wte.sh')
        .setAudience('https://jeddit.wte.sh')
        .setExpirationTime('1d')
        .sign(privateKey);
};


