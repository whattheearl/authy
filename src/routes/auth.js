import express from 'express';
import client from '../lib/clients.js';

const router = express.Router();

router.get('/authorize', (req, res) => {
    const response_type = req.query.response_type;
    const client_id = req.query.client_id;
    const redirect_uri = req.query.redirect_uri;
    const scope = req.query.scope;
    const code_challenge = req.query.code_challenge;
    const nonce = req.query.nonce;
    const state = req.query.state;
    if (client_id !== client.client_id) {
        res.statusMessage = `client ${client_id} does not exist.`;
        res.sendStatus(404);
        return;
    }

    if (redirect_uri !== client.redirect_uri) {
        res.statusMessage = `redirect_uri ${redirect_uri} does not match.`;
        res.statusCode = 400;
        res.send();
        return;
    }

    if (

    res.cookie('poo', { test: 'hi' }, { signed: true });
    res.send();
});

router.get('/auth/gc', (req, res) => {
    console.dir(req.cookies, { depth: null });
    console.dir(req.signedCookies, { depth: null });
    console.log(req.cookies);
    res.json(req.signedCookies);
});

router.get('/auth/dc', (req, res) => {
    res.clearCookie('poo');
    res.send();
});

export default router;
