export const discoveryDoc = {
    "issuer": "http://localhost:5000",
    "authorization_endpoint": "http://localhost:5000/authorization_endpoint",
    "device_authorization_endpoint": "",
    "token_endpoint": "http://localhost:5000/token_endpoint",
    "userinfo_endpoint": "http://localhost:5000/userinfo_endpoint",
    "revocation_endpoint": "",
    "jwks_uri": "http://localhost:5000/jwks_uri",
    "response_types_supported": [
        "code",
        "token",
        "id_token",
        "code token",
        "code id_token",
        "token id_token",
        "code token id_token",
        "none"
    ],
    "subject_types_supported": [
        "public"
    ],
    "id_token_signing_alg_values_supported": [
        "RS256"
    ],
    "scopes_supported": [
        "openid",
        "email",
        "profile"
    ],
    "token_endpoint_auth_methods_supported": [
        "client_secret_basic"
    ],
    "claims_supported": [
        "aud",
        "email",
        "email_verified",
        "exp",
        "family_name",
        "given_name",
        "iat",
        "iss",
        "name",
        "picture",
        "sub"
    ],
    "code_challenge_methods_supported": [
        "plain",
        "S256"
    ],
    "grant_types_supported": [
        "authorization_code",
        "refresh_token",
    ]
}
