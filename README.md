# HL2RP website + loading screen

Simple one-page website and loading screen for a Garry's Mod HL2RP server. Plain HTML/CSS/JS, no build step.

## Files
- `index.html` - the website (server status, factions, how to join)
- `loading.html` - loading screen for GMod
- `config.js` - all text and settings (name, IP, links, color, factions, tips)
- `assets/` - css, js, icons, background

## Setup
1. Edit `config.js`.
2. Upload the folder to any web host (GitHub Pages, Netlify, your own VPS).
3. For the loading screen add this to `server.cfg`:
   ```
   sv_loadingurl "https://your-domain/loading.html"
   ```

## Live player count
By default the site shows `demoStatus`. To show real numbers, set `statusUrl` to a URL that returns:
```json
{"online": 47, "max": 128, "map": "rp_city17_v3"}
```
