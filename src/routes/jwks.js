import express from 'express';
import * as jose from 'jose';

const keyPair = await jose.generateKeyPair('PS256', {
    extractable: true,
});
const publicKey = await jose.exportJWK(keyPair.publicKey);
const key = { kid: 1, ...publicKey };
const route = express.Router();

route.get('/jwks', (_, res) => {
    res.json({ keys: [key] });
});

export default route;
