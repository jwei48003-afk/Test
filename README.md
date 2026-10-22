# Team Launch Checklist

A lightweight, responsive checklist for coordinating a team launch across planning, content, approvals, and launch day. Progress is saved automatically in the browser using local storage.

## Open locally

No build step or package installation is required.

1. Download or clone this repository.
2. Open `index.html` in any modern web browser.

You can also serve the folder with a local web server if you prefer. For example, with Python installed:

```powershell
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Files

- `index.html` — page structure
- `styles.css` — responsive layout and visual design
- `app.js` — checklist data, interactions, progress tracking, and local persistence
