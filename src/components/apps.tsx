import { Html } from '@elysiajs/html';
// @ts-ignore
import styles from './apps.css' with { type: 'text' };

export const AppsPage = function (props: { apps: any[] }) {
    console.log(props);
    return (
        <html>
            <body>
                <table>
                    {props.apps.map((a) => (
                        <tr>
                            <td>{a.name}</td>
                            <td>
                                <a href={a.href}>{a.href}</a>
                            </td>
                        </tr>
                    ))}
                </table>
                <form method="POST" action="/signout">
                    <button>signout</button>
                </form>
                <style>{styles}</style>
            </body>
        </html>
    );
};
