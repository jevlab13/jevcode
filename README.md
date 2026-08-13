# jev.lv — personal visitcard site

Static site (plain HTML/CSS/JS, no build step) for **jev.lv**.

## 1. Push to your `jevlab` repo

From this folder, run:

```bash
git init
git add .
git commit -m "Initial visitcard site"
git branch -M main
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/jevlab.git
git push -u origin main
```

> Replace `<YOUR-GITHUB-USERNAME>` with your actual GitHub username.
> If the repo already has a commit (e.g. an auto-created README), pull first:
> `git pull origin main --allow-unrelated-histories` before pushing.

## 2. Turn on GitHub Pages

1. On GitHub, open the `jevlab` repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)` → **Save**.
4. Under **Custom domain**, enter `jev.lv` and save. This writes/confirms the `CNAME` file (already included here).

## 3. Point your domain at GitHub Pages (DNS)

`jev.lv` is an **apex/root domain**, so at your domain registrar/DNS provider, create four **A** records for `@` (root) pointing to GitHub Pages' IPs:

| Type | Host | Value |
|------|------|-------------------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Optional but recommended — if you also want `www.jev.lv` to work, add:

| Type | Host | Value |
|------|------|----------------------|
| CNAME | www | `<YOUR-GITHUB-USERNAME>.github.io` |

DNS changes can take anywhere from a few minutes to ~24 hours to propagate.

## 4. Enforce HTTPS

Once GitHub shows the domain as verified (Settings → Pages), tick **Enforce HTTPS**. It may be greyed out for a bit right after DNS propagates — that's normal, just check back later.

## Files

- `index.html` — page content (About/Career, Squash, Connect chapters)
- `style.css` — dark "blueprint × squash-court" design system
- `script.js` — scroll reveals, hero line animation, click-to-reveal email (keeps your address out of the raw HTML so scrapers can't harvest it)
- `CNAME` — tells GitHub Pages to serve this site on `jev.lv`

## Editing later

Everything is plain text — open `index.html` in any editor to update copy, or `style.css` to tweak colors/spacing. No build tools required; just commit and push, and GitHub Pages redeploys automatically within a minute or two.
