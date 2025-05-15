import auth from './routes/auth.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwks from './routes/jwks.js';
import process from 'node:process';
import wellknown from './routes/wellknown.js';

const port = process.env.port ?? 3000;
const secret = process.env.cookie_secret ?? 'localdev';

const app = express();
app.use(cookieParser(secret));
app.use(jwks);
app.use(wellknown);
app.use(auth);
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
