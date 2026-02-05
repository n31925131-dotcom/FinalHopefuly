# Rose Flower Shop - Static Website

This is a static website for Rose Flower Shop, designed for GitHub Pages.

## Project Structure
```
flower-shop-static/
├── index.html        # Homepage
├── about.html        # About page
├── services.html     # Services page
├── gallery.html      # Gallery page
├── contact.html      # Contact page
├── css/
│   └── main.css      # Custom styles
├── js/
│   ├── main.js           # Shared functionality (menu, etc)
│   ├── language-toggle.js # Translation system
│   ├── gallery.js        # Gallery filtering and lightbox
│   └── contact-form.js   # Contact form handler
└── lang/
    ├── en.json       # English translations
    └── el.json       # Greek translations
```

## How to Deploy on GitHub Pages

1.  **Clone/Upload**: Upload the contents of the `flower-shop-static` folder to your GitHub repository.
2.  **Settings**: Go to your repository Settings > Pages.
3.  **Source**: Select "Deploy from branch" and choose `main` (or `master`) and the root folder `/` (if you uploaded the *contents* to the root) or `/flower-shop-static` if you kept the folder.
    *   *Recommendation*: Push the *contents* of `flower-shop-static` to the root of your repo for `username.github.io/repo/` URL.
4.  **Save**: Click Save. Your site will be live in a few minutes.

## How to Edit Content

### Changing Text
All text is stored in `lang/en.json` (English) and `lang/el.json` (Greek).
1.  Open the JSON file.
2.  Find the key you want to change (e.g., `"heroTitle"`).
3.  Update the text inside the quotes.
    *   *Note*: Keep valid JSON format (quotes around keys and values, commas at end of lines except the last one).

### Changing Images
1.  Replace the image URLs in the HTML files.
2.  Currently, images are loaded from Pexels (placeholders).
3.  To use your own images:
    *   Create an `images` folder.
    *   Put your photos there.
    *   Update HTML `src` tags: `src="images/my-photo.jpg"`.

### Changing Colors/Styles
1.  Basic colors are set in `css/main.css` variables (`--color-rose-600`, etc).
2.  The site uses Tailwind CSS via CDN. You can edit classes directly in the HTML (e.g., change `text-rose-600` to `text-blue-600`).

## Dependencies
*   **Tailwind CSS**: Loaded via CDN (no build step required).
*   **Fonts**: Inter and Playfair Display from Google Fonts.
*   **Icons**: SVG icons embedded directly in HTML (Lucide style).
