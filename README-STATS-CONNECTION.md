# DropZone FN — Authorized Fortnite Stats Connection

V10 now has a secure server-side adapter at:

`/.netlify/functions/fortnite-stats`

The browser sends only the player's Epic/Fortnite display name. Provider credentials are never placed in `index.html`.

## Netlify environment variables

Configure these in the Netlify site settings:

- `FORTNITE_STATS_API_URL` — the endpoint of an authorized Fortnite player-stat provider.
- `FORTNITE_STATS_API_KEY` — the provider secret, if required.
- `FORTNITE_STATS_API_KEY_HEADER` — optional; defaults to `Authorization`.

The provider endpoint receives `?username=<Epic display name>` and should return JSON like:

```json
{
  "stats": {
    "wins": 42,
    "kd": 3.21,
    "wr": 8.7,
    "matches": 483,
    "raw": {
      "eliminations": 1521,
      "top10s": 88
    }
  }
}
```

## Daily progress behavior

- Every successful authorized refresh saves one snapshot per calendar day.
- Wins, K/D, win rate, and matches are compared with the previous snapshot.
- Each improved metric contributes `+1`, each unchanged metric `0`, and each decreased metric `-1`.
- The daily score and 90-day history are stored locally in the user's browser.

## Important provider limitation

Tracker Network currently documents its public API as supporting selected titles, while its own support posts state that public Fortnite APIs are not available. Do not put a Tracker API key into this project unless Tracker Network has separately authorized Fortnite access for your application.
