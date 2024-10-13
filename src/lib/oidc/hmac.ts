export class SignHMAC {
    header = { alg: 'HS256', typ: 'JWT' };
    body = {};

    constructor(body: Object) {
        this.body = { ...this.body, ...body };
        return this;
    }

    setIssuedAt() {
        this.body = { ...this.body, iat: Date.now() };
        return this;
    }

    setExpirationTime(exp: number) {
        this.body = { ...this.body, exp };
        return this;
    }

    async sign(key: CryptoKey) {
        const encHeader = Buffer.from(JSON.stringify(this.header)).toString(
            'base64url',
        );
        const encBody = Buffer.from(JSON.stringify(this.body)).toString(
            'base64url',
        );
        const data = `${encHeader}.${encBody}`;
        console.log('sign data:', data);
        const enc = new TextEncoder();
        const encoded = enc.encode(data);
        console.log('sign encoded:', encoded);
        const signature = await crypto.subtle.sign('HMAC', key, encoded);
        console.log({ signature });
        const encSignature = Buffer.from(signature).toString('base64url');
        console.log({ encSignature });
        return `${encHeader}.${encBody}.${encSignature}`;
    }
}

export async function generateHMACKey() {
    let key = await crypto.subtle.generateKey(
        {
            name: 'HMAC',
            hash: { name: 'SHA-256' },
        },
        true,
        ['sign', 'verify'],
    );

    console.debug(key);
    return key;
}

export async function exportHMAC(key: CryptoKey) {
    const exported = await crypto.subtle.exportKey('jwk', key);
    console.debug('exporting key:', exported);
    return exported as JsonWebKey;
}

export async function importHMAC(jwk: JsonWebKey) {
    const key = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
    );
    console.debug(key);
    return key;
}

export async function verifyHMAC(jwt: string, key: CryptoKey) {
    if (!jwt) return false;

    const parts = jwt.split('.');
    if (parts.length != 3) return false;

    const enc = new TextEncoder();
    const data = enc.encode(`${parts[0]}.${parts[1]}`);
    const signature = Buffer.from(parts[2], 'base64url');

    console.debug('data:', data.toString());
    console.debug('signature:', signature.toString());
    let isVerified = await crypto.subtle.verify('HMAC', key, signature, data);
    console.debug('isVerified:', isVerified);
    return isVerified;
}
