# Rose Flower Shop

## Overview
A static website for a flower shop in Rethymno, Crete. The site is in Greek with English language toggle support.

## Project Structure
- `/` - Static HTML pages (index.html, about.html, contact.html, gallery.html, services.html)
- `/css` - Stylesheets
- `/js` - JavaScript files for interactivity
- `/lang` - Language files for i18n
- `/server` - Express server with Dropbox gallery API
- `/docs` - Documentation
- `/tools` - Testing scripts

## Running the Application
The server runs on port 5000 using Express to serve static files and the gallery API.

```bash
npx tsx server/index.ts
```

## Dropbox Gallery Integration
The gallery page dynamically loads images from a Dropbox App folder.

### Setup
1. Create a Dropbox app at https://www.dropbox.com/developers/apps
2. Generate an access token
3. Set `DROPBOX_TOKEN` in environment secrets
4. Create category subfolders in your Dropbox App folder and add images

See `docs/README-dropbox-gallery.md` for detailed setup instructions.

### API Endpoint
- `GET /api/gallery` - Returns categorized images from Dropbox

## Technologies
- HTML/CSS with Tailwind CSS (via CDN)
- Vanilla JavaScript
- Node.js/Express server
- TypeScript for server code
- Dropbox API for gallery images

## Environment Variables
| Variable | Description |
|----------|-------------|
| DROPBOX_TOKEN | Dropbox access token for gallery API |
| DROPBOX_ROOT_PATH | (Optional) Root path in Dropbox |
