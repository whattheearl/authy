import express from 'express';
import cookieParser from 'cookie-parser';
import { randomBytes } from 'node:crypto';

const router = express.Router();

router.get('/auth/sc', (req, res) => {
    res.cookie('poo', 'poo', { signed: true });
    res.send();
});

router.get('/auth/gc', (req, res) => {
    // Cookies that have not been signed
    console.dir(req.cookies, { depth: null });

    // Cookies that have been signed
    console.dir(req.signedCookies, { depth: null });
    console.log(req.cookies);
    res.json(req.signedCookies);
});

router.get('/auth/dc', (req, res) => {
    res.clearCookie('poo');
    res.send();
});

export default router;
