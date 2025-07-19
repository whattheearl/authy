import * as jose from 'jose';
import { getPrivateJwk } from '../db/jwks';

export const signJwt = async (data: any) => {
    try {
        const key = await getPrivateJwk();
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
