# Salus Fitness Gym — Website

A complete, production-ready, responsive website for Salus Fitness Gym (Kothapet, Hyderabad).

## What's inside
- `index.html` — the full one-page site: Hero, About, Stats, Programs, Membership, Trainers,
  Transformation (before/after slider), Gallery (filter + lightbox), Testimonials (carousel),
  Google Review banner, Timings, Fitness Calculators (BMI / Calorie / Workout Timer), FAQ, Blog,
  Newsletter, Contact (form + Google Maps + WhatsApp + Call) and Footer.
- `privacy.html` — Privacy Policy page.
- `terms.html` — Terms & Conditions page.
- `styles.css` — all design/styling (dark luxury theme, glassmorphism, glow buttons, animations).
- `script.js` — all interactivity (no build step, plain JavaScript).
- `robots.txt`, `sitemap.xml` — basic SEO files.

## How to use it
1. Unzip the folder.
2. Open `index.html` directly in any browser — everything works with no build step or server required.
3. To publish it, upload all files (keeping the same folder structure) to any static host:
   Netlify, Vercel, GitHub Pages, Hostinger, GoDaddy, or your existing hosting via FTP.

## Notes & things you'll likely want to personalize
- **Images**: currently pulled live from Unsplash (stock photography) via CDN links so the site
  looks complete out of the box. Swap these `<img src="https://images.unsplash.com/...">` links
  for real photos of your gym, trainers and members for the best result — just replace the `src`
  with your own image paths (e.g. `assets/your-photo.jpg`).
- **Google Maps**: the embed uses your address directly. If you'd like the exact pinned location
  from your Google Maps link, open your Maps listing → Share → Embed a map → copy that `<iframe>`
  `src` into the `.map-embed iframe` in `index.html`.
- **WhatsApp/Call buttons**: wired to `+91 76740 14383` — update the `tel:` and `wa.me` links in
  `index.html` if the number changes.
- **Contact form**: front-end validation only (no backend). To actually receive submissions,
  connect it to a form service (e.g. Formspree, EmailJS, Google Forms) or your own backend —
  the JS in `script.js` (`#contact-form` handler) is the place to add that request.
- **Domain**: replace `https://salusfitnessgym.com/` in the meta tags, structured data,
  `sitemap.xml` and `robots.txt` with your real domain once you have one.

## Tech used
HTML5, CSS3 (custom, no framework lock-in), vanilla JavaScript, Google Fonts (Poppins +
Montserrat), Font Awesome icons — all loaded via CDN, so there's nothing to install.
