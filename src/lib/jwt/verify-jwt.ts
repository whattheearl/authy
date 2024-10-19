import * as jose from 'jose';

export const verifyJwt = async (jwt: string, publicKey: any) => {
    const { payload, protectedHeader } = await jose.jwtVerify(
        jwt,
        publicKey
    );
    return { payload, protectedHeader };
};
