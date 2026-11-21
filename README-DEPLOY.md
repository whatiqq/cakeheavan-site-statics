# Cake Heavan — Static Website (WhatsApp orders)

This folder is a static-hosting version of the Cake Heavan website. It keeps the existing front-end design and supplied images, fonts, video and scripts. The order form validates the details in the browser and prepares a WhatsApp message. The customer must press **Send** in WhatsApp.

## Important differences from the original full-stack project

- The Node.js/Express backend, admin dashboard, SQLite database and server-side image uploads are not included.
- Orders are **not saved** in a website database or admin panel. They reach the shop only if the customer sends the prepared WhatsApp message.
- The cake list and website text are fixed in `js/app.js` boot data embedded in `index.html`. To change them, edit the source and redeploy.
- Cake images are included in `assets/cakes/`.

## Before publishing — verify contact details

The source project supplied these defaults:
- WhatsApp: `919137552633`
- Instagram: `https://www.instagram.com/cakeheaven00/` (the source URL includes an Instagram tracking query)

Confirm the shop owns/uses this WhatsApp number before launch. To change it, edit `whatsapp_number` in the JSON inside `index.html` (`id="boot"`). Instagram can be changed in the same JSON under `instagram_url`.

## Deploy on Cloudflare Pages (free static hosting)

1. Create a **new, separate GitHub repository** for this static version. Keep your original full-stack repository as a backup.
2. Upload the **contents of this folder** to the repository root (so `index.html`, `css/`, `js/`, and `assets/` are at the top level).
3. In Cloudflare Dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and select the new repository.
4. Framework preset: **None**. Build command: leave empty. Build output directory: `.` (repository root).
5. Deploy. Cloudflare will provide a `*.pages.dev` address.
6. Test every section, cake image, video, Instagram link and the order form on desktop and mobile. Test WhatsApp with the shop before sharing the URL.
7. Add the paid domain later under the Pages project **Custom domains** and follow the DNS instructions Cloudflare displays.

No monthly hosting payment is required for a small static site within Cloudflare Pages' free-plan limits. A domain registration is separate and is normally renewed yearly.
