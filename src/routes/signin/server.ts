import html from "@elysiajs/html";
import Elysia, { error, redirect, t } from "elysia";
import page from './page';
import { getUserByUsername } from "../../lib/users";

export const signin = new Elysia({ prefix: '/'})
.use(html())
.get('/', ({ html, cookie: { sess } }) => {
    if (!sess.value) {
        return html(page())
    }

    const session = JSON.parse(sess.value ?? '{}');
    if (!session.username) {
        return html(page())
    }

    return redirect('/apps');
}, {
    cookie: t.Optional(
        t.Cookie({
            sess: t.Optional(t.String()),
        },
        {
            httpOnly: true,
            secure: Bun.env.cookie__secure == 'true',
            secrets: 'dev-secret',
        })
    ),
})
.post('/', async ({ body: { username, password }, cookie: { sess, oauth } }) => {
    console.log(username, password)
    // INFO: validate user and create session
    const user = getUserByUsername(username);
    console.log({user})
    if (!user || !user.password || !user.username) return error(404);
    const isMatch = await Bun.password.verify(password, user.password);
    console.log(isMatch);
    if (!isMatch) return error(404)
    sess.value = JSON.stringify({ username: user.username });

    // INFO: send to app page if no previous oauth
    if (!oauth.value) return redirect('/apps')

    // INFO: construct authorization url and send if previously tried to login
    const oauthParams = JSON.parse(oauth.value) as {
        client_id: string,
        scope: string,
        response_type: string,
        code_challenge: string,
        nonce: string,
        state: string,
        redirect_uri: string,
    }
    const url = new URL('/');
    url.searchParams.set('client_id', oauthParams.client_id);
    url.searchParams.set('scope', oauthParams.scope);
    url.searchParams.set('response_type', oauthParams.response_type);
    url.searchParams.set('code_challenge', oauthParams.code_challenge);
    url.searchParams.set('nonce', oauthParams.nonce);
    url.searchParams.set('state', oauthParams.state);
    url.searchParams.set('redirect_uri', oauthParams.redirect_uri);
    oauth.value = '';
    return redirect(url.toString())
},{
    cookie: t.Optional(
        t.Cookie({
            sess: t.Optional(t.String()),
            oauth: t.Optional(t.String()),
        },
        {
            httpOnly: true,
            secure: Bun.env.cookie__secure == 'true',
            secrets: 'dev-secret',
        })
    ),
    body: t.Object({
        username: t.String(),
        password: t.String(),
    })
})
