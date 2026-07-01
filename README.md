# Phi Gamma Delta — University of Utah

Official website for the FIJI chapter at the University of Utah. Static HTML/CSS/JS, no build step.

## Pages
- `index.html` — Home
- `about.html` — About (history, mission, national legacy, leadership)
- `rush.html` — Rush + Contact
- `philanthropy.html` — Philanthropy (Alzheimer's Association partnership)
- `built-to-lead.html` — Built to Lead leadership program + advisor console
- `members.html` — Gated member portal (initiate checklist, contacts, resources)
- `404.html` — Not-found page

## Shared assets
- `assets/css/styles.css` — base design system
- `assets/css/app.css` — interactive components (portal, tabs, admin)
- `assets/js/main.js` — all behavior
- `assets/img/`, `assets/video/` — media

## Member portal / advisor login
Username `UtahPhiGam`, password `Utes1848!` (client-side gate only — not real security).

## Local preview
```
python3 -m http.server 8000
```
Then open http://localhost:8000
