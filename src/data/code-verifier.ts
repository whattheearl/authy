// TODO: use stable store
// TODO  set a max per user (1)?
let codeChallenges = [] as CodeChallenge[];

export interface CodeChallenge {
    code: string;
    code_challenge: string;
    nonce: string;
}

export function addCodeChallenge(codeChallenge: CodeChallenge) {
    codeChallenges.push(codeChallenge);
    return codeChallenge.code;
}

export function removeCodeChallenge(code: string) {
    codeChallenges = codeChallenges.filter((c) => c.code != code);
}

export function getCodeChallenge(code: string) {
    const codeChallange = codeChallenges.filter((c) => c.code == code);
    if (codeChallange.length == 0) {
        return null;
    }
    return codeChallange[0];
}
