import { Html } from '@elysiajs/html';
// @ts-ignore
import styles from './signin.css' with { type: 'text' };

function RegistrationLink({ enableRegistration }: { enableRegistration: boolean }) {
    if (enableRegistration) return <a href="/register">Register here</a>
    return null;
}

export const SigninPage = function({ enableRegistration }: { enableRegistration: boolean }) {
    return (
        <html>
            <body>
                <form method="POST" action="/signin">
                    <h1>Sign in to Authy</h1>
                    <h2>Please sign in to continue</h2>
                    <label for="username">username</label>
                    <input type="text" id="username" name="username" />
                    <label for="password">password</label>
                    <input type="password" id="password" name="password" />
                    <button>sign in to authy</button>
                    <RegistrationLink enableRegistration={enableRegistration} />
                </form>
                <style>{styles}</style>
            </body>
        </html>
    );
}
