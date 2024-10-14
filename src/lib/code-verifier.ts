import { randomBytes } from './oidc';

let codeChallenges = [] as CodeChallenge[];

export interface CodeChallenge {
    key: string;
    code_challenge: string;
    nonce: string;
}

export function addCodeChallenge(codeChallenge: CodeChallenge) {
    codeChallenges.push(codeChallenge);
    return codeChallenge.key;
}

export function removeCodeChallenge(key: string) {
    codeChallenges = codeChallenges.filter((c) => c.key != key);
}

export function getCodeChallenge(key: string) {
    const codeChallange = codeChallenges.filter((c) => c.key == key);
    if (codeChallange.length == 0) {
        return null;
    }
    return codeChallange[0];
}
