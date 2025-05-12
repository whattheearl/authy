import express from 'express';
import jwks from './routes/jwks.js';
import wellknown from './routes/wellknown.js';
import auth from './routes/auth.js';
import { randomBytes } from 'node:crypto';
import cookieParser from 'cookie-parser';

const app = express();
const secret = randomBytes(64).toString('hex');
console.log(secret);
app.use(cookieParser(secret));

app.use(jwks);
app.use(wellknown);
app.use(auth);

app.listen(3000, () => {
    console.log('http://localhost:3000');
});
