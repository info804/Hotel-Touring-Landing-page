# Touring Concierge — backend Worker

Tiny Cloudflare Worker that powers the website chat assistant. It's the only place
the AI API key lives. The website widget sends guest messages here; the Worker adds
the hotel knowledge (`/assets/concierge/knowledge.md`) + guardrails and calls the AI.

## One-time setup (free)

1. **Get a free Google AI Studio key** → https://aistudio.google.com/apikey
2. **Install Wrangler & log in** (needs Node.js):
   ```
   npm install -g wrangler
   wrangler login
   ```
3. **From this folder**, store the key as a secret and deploy:
   ```
   cd concierge-worker
   wrangler secret put GEMINI_API_KEY      # paste the key when prompted
   wrangler deploy
   ```
4. Copy the deployed URL (e.g. `https://touring-concierge.<you>.workers.dev`) and put
   it — with `/chat` is not needed, the widget posts to the root — into `index.html`:
   set `WORKER_URL` in the concierge widget script to that URL.

## Test locally

```
wrangler dev        # serves on http://localhost:8787
```
Temporarily set `WORKER_URL` in the widget to `http://localhost:8787` (note: the
Worker only accepts requests from the real site origin by default — for local testing
add `http://localhost:8080` to `ALLOWED_ORIGINS` in `worker.js`, then revert).

## Upgrade to Claude later (better quality/reliability, ~$5/mo)

```
wrangler secret put ANTHROPIC_API_KEY     # from console.anthropic.com
```
Then set `PROVIDER = "claude"` in `wrangler.toml` and `wrangler deploy`. Nothing else changes.

## Updating what the bot knows

Edit `../assets/concierge/knowledge.md`, commit to GitHub. The Worker re-reads it within
~5 minutes — no redeploy needed.

## Optional: auto-deploy from GitHub
Connect this repo in the Cloudflare dashboard (Workers → your worker → Settings → Builds)
so `wrangler deploy` runs automatically on every push.
