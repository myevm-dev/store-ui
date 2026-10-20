# Slick Store UI preview

This standalone version preserves the purple Slick Store design from `myevm-dev/store-ui`: its hero, featured carousel, expandable categories, chain selector, app details, search, browsing history, and infinite scrolling.

## Run locally or in Codespaces

Use Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000, or open port 3000 in the Codespaces Ports tab. No `.env` file, API host, API keys, wallet project ID, or authentication secrets are required.

If npm previously stopped with `ENOTEMPTY`, stop the dev server and any other npm install, then reinstall generated dependencies:

```bash
rm -rf node_modules
npm ci
npm run dev
```

Keep `package-lock.json`. It pins the tested dependencies.

## Preview behavior

- Sixteen fictional sample apps and their artwork are bundled locally.
- Search, category/subcategory filters, All Chains/Ethereum/Polygon/zkEVM filters, featured listings, infinite scrolling, and detail pages use the local catalog.
- Browsing history is saved only in this browser's local storage.
- Wallet connection, sign-in, review submissions, downloads, claiming, and app updates are disabled or removed. No transactions or submissions are made.
- Sample apps have no live destinations or invented review scores.
- The share link uses the current browser URL, including Codespaces URLs.
- Fonts and sample artwork are local. Browsing the catalog does not need a backend.

Edit `src/data/demo-apps.json` to change the sample catalog. The local query transport is in `src/api/demo.js`.

## Checks and production preview

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

GitHub Actions runs a clean install and these checks on pull requests. Next.js writes its production output to `build/`.

Original Slick Store layout and assets are retained from this repository. This branch is a UI demonstration, without live marketplace services.
