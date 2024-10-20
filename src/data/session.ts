export interface Session {
    user_id: number;
}

export const importSession = (sessionTxt: string | undefined) => {
    if (!sessionTxt) {
        return null;
    }

    try {
        const session = JSON.parse(sessionTxt) as Session;
        console.log({session})
        if (!Number.isInteger(session.user_id)) {
            return null;
        }
        return session;
    } catch (err) {
        console.log("unable to parse session", sessionTxt);
        return null;
    }
}

export const exportSession = (session: Session) => {
    return JSON.stringify(session);
}
