import Elysia from 'elysia';

const baseUri = 'http://localhost:3000';

export const openidRoute = new Elysia().get(
    '/.well-known/openid-configuration',
    () => {
        return {
            issuer: baseUri,
            authorization_endpoint: `${baseUri}/authorization`,
            token_endpoint: `${baseUri}/token`,
            userinfo_endpoint: `${baseUri}/userinfo`,
            jwks_uri: `${baseUri}/jwks`,
            response_types_supported: ['code token id_token', 'none'],
            subject_types_supported: ['public'],
            id_token_signing_alg_values_supported: ['RS256'],
            scopes_supported: ['openid', 'email', 'profile'],
            token_endpoint_auth_methods_supported: ['client_secret_post'],
            claims_supported: [
                'aud',
                'email',
                'email_verified',
                'exp',
                'family_name',
                'given_name',
                'iat',
                'iss',
                'name',
                'picture',
                'sub',
            ],
            code_challenge_methods_supported: ['S256'],
            grant_types_supported: ['authorization_code', 'refresh_token'],
        };
    },
);
