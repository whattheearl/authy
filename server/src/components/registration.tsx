import { Html } from '@elysiajs/html';
// @ts-ignore
import styles from './registration.css' with { type: 'text' };

export const RegistrationPage = function() {
    return (
        <html>
            <body>
                <form method="POST">
                    <h1>Register for an Authy account</h1>
                    <h2>Please enter your information to continue</h2>
                    <label for="username">username</label>
                    <input type="text" id="username" name="username" />
                    <label for="password">password</label>
                    <input type="password" id="password" name="password" />
                    <button>Register your account</button>
                </form>
                <style>{styles}</style>
            </body>
        </html>
    );
}
