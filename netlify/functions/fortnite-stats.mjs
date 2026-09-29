// DropZone FN secure stats adapter.
//
// This function deliberately keeps provider credentials server-side.
// It expects an authorized Fortnite player-stats provider to be configured
// with environment variables in Netlify:
//   FORTNITE_STATS_API_URL  - provider endpoint, e.g. https://provider.example/api/player
//   FORTNITE_STATS_API_KEY  - secret key (if the provider requires one)
//   FORTNITE_STATS_API_KEY_HEADER - optional header name (default: Authorization)
//
// The provider should return JSON containing either:
// { stats: { wins, kd, wr, matches, raw: {...} } }
// or a direct stats object with those four numeric fields.
//
// The browser never receives the API key.

export default async (request) => {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  };

  const url = new URL(request.url);
  const username = (url.searchParams.get('username') || '').trim();
  if (!username) {
    return new Response(JSON.stringify({ message: 'Missing Fortnite username.' }), { status: 400, headers });
  }

  const providerUrl = process.env.FORTNITE_STATS_API_URL;
  if (!providerUrl) {
    return new Response(JSON.stringify({
      message: 'No authorized Fortnite stats provider is configured yet.',
      code: 'PROVIDER_NOT_CONFIGURED'
    }), { status: 503, headers });
  }

  const key = process.env.FORTNITE_STATS_API_KEY || '';
  const keyHeader = process.env.FORTNITE_STATS_API_KEY_HEADER || 'Authorization';
  const target = new URL(providerUrl);
  target.searchParams.set('username', username);

  const requestHeaders = { accept: 'application/json' };
  if (key) requestHeaders[keyHeader] = keyHeader.toLowerCase() === 'authorization' ? `Bearer ${key}` : key;

  try {
    const response = await fetch(target, { method: 'GET', headers: requestHeaders });
    const text = await response.text();
    let data = {};
    try { data = JSON.parse(text); } catch {}

    if (!response.ok) {
      return new Response(JSON.stringify({
        message: data.message || `Authorized stats provider returned ${response.status}.`,
        code: 'PROVIDER_ERROR'
      }), { status: 502, headers });
    }

    const stats = data.stats || data;
    const required = ['wins', 'kd', 'wr', 'matches'];
    const valid = required.every(k => Number.isFinite(Number(stats?.[k])));
    if (!valid) {
      return new Response(JSON.stringify({
        message: 'The authorized provider returned data, but it did not include the required wins, kd, wr, and matches fields.',
        code: 'INVALID_PROVIDER_RESPONSE'
      }), { status: 502, headers });
    }

    return new Response(JSON.stringify({
      provider: 'authorized',
      stats: {
        wins: Number(stats.wins),
        kd: Number(stats.kd),
        wr: Number(stats.wr),
        matches: Number(stats.matches),
        raw: stats.raw || stats.additional || {}
      }
    }), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Could not reach the authorized stats provider.', code: 'UPSTREAM_ERROR' }), { status: 502, headers });
  }
};
