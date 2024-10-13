export interface User {
    id: number;
    username: string;
    password: string;
}

const users = [
    {
        id: 0,
        username: 'testtesttest',
        password: '$argon2id$v=19$m=65536,t=2,p=1$Z++ialgF0ZiTq7EvcDlUwBxecRhhZzX57T4wUmC0+TE$EUR2PAk1Hf+bOWhRLlBceJYHk2EV39VnMgyaGRKX4Ec' //testtesttest
    }
] as User[]

export const getUsers = () => {
    return users;
}

export const addUser = async (user: Partial<User>) => {
    users.push({
        id: user.id ?? users.length,
        username: user.username ?? '',
        password: user.password ?? '', 
    });
}

export const getUserByUsername = (username: string) => {
    const filtered = users.filter(u => u.username == username);
    if (filtered.length == 0) return null;
    return filtered[0];
}
