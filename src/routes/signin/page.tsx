import { Html } from '@elysiajs/html'
// @ts-ignore
import styles from './styles.css' with { type: 'text' };

export default function() {
    return(<html>
        <body>
            <form method="POST" action="/">
                <h1>Sign in to Authy</h1>
                <h2>Please sign in to continue</h2>
                <label for="username">username</label>
                <input type="text" id="username" name="username" />
                <label for="password">password</label>
                <input type="password" id="password" name="password" />
                <button>sign in to authy</button>
                <a href="/register">Register here</a>
            </form>
            <style>{styles}</style>
        </body>
    </html>)
}
