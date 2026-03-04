export async function onRequestGet(context) {
    const { env } = context;

    const accounts = [];
    if (env.CF_API_TOKEN) accounts.push({ id: 0, name: 'Default Account' });

    // Scan for additional tokens (CF_API_TOKEN1, CF_API_TOKEN2, etc.)
    let i = 1;
    while (env[`CF_API_TOKEN${i}`]) {
        accounts.push({ id: i, name: `Account ${i}` });
        i++;
    }

    return new Response(JSON.stringify({ accounts }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
