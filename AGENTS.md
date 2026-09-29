# AGENTS.md

- The site was uploaded by the owner and is deployed exactly as provided. Don't restyle or restructure it unless asked.
- `index.html` is the whole frontend (inline CSS/JS, no bundler). `netlify.toml` publishes the repo root (`publish = "."`), and there's no build command.
- Functions live in `netlify/functions/`:
  - `fortnite-stats.mjs`: server-side adapter for an authorized stats provider (`FORTNITE_STATS_API_URL`, `FORTNITE_STATS_API_KEY`, `FORTNITE_STATS_API_KEY_HEADER`). Keep secrets server-side.
  - `fortnite-player.js`: returns a Fortnite Tracker profile URL for a username.
  - `tracker.js`: a simple status endpoint.
- Daily progress history is stored in the user's browser (localStorage), not on the server.
