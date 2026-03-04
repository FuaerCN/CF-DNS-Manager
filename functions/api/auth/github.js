export async function onRequestGet(context) {
    const { env } = context;

    const clientId = env.GITHUB_CLIENT_ID;
    if (!clientId) {
        return new Response(JSON.stringify({ error: 'GitHub OAuth is not configured.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const redirectUri = new URL(context.request.url).origin + '/api/auth/github/callback';

    // Generate a random state for CSRF protection
    const state = crypto.randomUUID();
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user&state=${state}`;

    return new Response(null, {
        status: 302,
        headers: {
            'Location': githubUrl,
            'Set-Cookie': `github_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
        }
    });
}
