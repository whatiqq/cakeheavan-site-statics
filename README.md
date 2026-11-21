# Website assets: what to replace to change the look

| Folder | What is in it | How to change it |
|---|---|---|
| `cakes/` | The 24 launch cake photos (`a01.webp` … `b18.webp`), transparent background, about 560 px | **Easiest: use the admin dashboard** (Cakes > Replace photo). To change the starter photos by file instead, overwrite the same file name, keep the name and the `.webp` type. Some of these also appear as decoration (see below). |
| `images/final-cake.webp` | The finished cherry cake shown at the end of the scroll animation | Replace with another transparent WebP/PNG-as-WebP, about 860 px wide. Keep the file name. |
| `video/hero.mp4` + `hero-poster.jpg` | The looping cake video in the homepage hero (silent, 1280x704, 1.5 MB) | Replace with a new MP4 (H.264, no audio, under 3 MB, similar 16:9 shape) and replace the poster JPG with its first frame. |
| `logo/cake-heaven-logo.svg` | Logo (text-based SVG; needs the fonts in `fonts/` to look exactly like the site header) | Edit in any vector editor. The header logo itself is built in `index.html` (`.brand`) and `css/styles.css`. |
| `icons/` | `favicon.svg`, `whatsapp.svg`, `instagram.svg` | Replace the favicon to change the browser-tab icon. The page uses inline copies of the other two. |
| `fonts/` | Fraunces (headings) and Figtree (body), self-hosted, with licences | Both are open-source (SIL OFL). Swap by editing the `@font-face` rules at the top of `css/styles.css`. |

## Photos that are decoration (not in the dashboard)

These cakes are placed on the page as decoration, so they are edited as files, not in the dashboard:

- Story section: `cakes/a03.webp` (large) and `cakes/b04.webp` (circle)
- WhatsApp section: `cakes/b13.webp` (left) and `cakes/a04.webp` (right)
- Final section: `cakes/b17.webp`, `a06.webp`, `b14.webp`, `b09.webp`, `b05.webp`

Photos you upload in the dashboard are stored in the data folder (`DATA_DIR/uploads`), not in this folder, and are automatically resized to 1000 px and converted to WebP.

## Photo tips

- Cut-out photos (transparent background) look best, as in the supplied set. A normal photo also works.
- Keep the whole cake in frame with some space around it. Photos are shown on a square panel with the cake fitted inside, so nothing is cropped off.
