# Dropbox Gallery Integration (Netlify)

This document describes how to configure the Dropbox gallery integration for Rose Flower Shop when deployed on Netlify.

## Overview

The gallery page dynamically loads images from a Dropbox App folder via a Netlify serverless function. The owner manages images by adding/removing files in Dropbox, and the website automatically displays them.

## Setup

### 1. Create a Dropbox App

1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps).
2. Click "Create app".
3. Choose "Scoped access".
4. Choose "App folder" (recommended) or "Full Dropbox".
5. Name your app (e.g., "Rose-Flower-Shop-Gallery-API").
6. Click "Create app".

### 2. Generate Access Token

1. In your app settings, go to the **Permissions** tab.
2. Enable these permissions:
   - `files.metadata.read`
   - `files.content.read`
3. Click **Submit** to save permissions.
4. Go to the **Settings** tab.
5. Under "OAuth 2", click **Generate** to create an access token.
6. Copy the generated token.

### 3. Configure Netlify Environment Variables

In your Netlify site dashboard, go to **Site settings** > **Environment variables** and add:

| Variable | Description | Required |
|----------|-------------|----------|
| `DROPBOX_TOKEN` | Your Dropbox access token. | Yes |
| `DROPBOX_ROOT_PATH` | Root path in Dropbox (empty for App folder mode). | No |

### 4. Organize Your Images

Create subfolders in your Dropbox App folder for each category:

```
/Apps/Rose-Flower-Shop-Gallery-API/
├── weddings/
│   ├── wedding1.jpg
│   └── wedding2.jpg
├── baptisms/
│   └── baptism1.jpg
├── events/
│   └── event1.jpg
├── bouquets/
│   └── bouquet1.jpg
└── other/
    └── other1.jpg
```

## How It Works

- **Serverless Function**: Located at `netlify/functions/gallery.js`. It lists folders and gets temporary download links (valid for ~4 hours).
- **Caching**: The function caches results in-memory for 5 minutes.
- **Frontend**: `js/gallery-loader.js` fetches from `/.netlify/functions/gallery`.

## Local Development

1. Install dependencies: `npm install`
2. Run Netlify Dev: `netlify dev`

## Security Note

**Never commit your DROPBOX_TOKEN** to version control. Always use environment variables.
