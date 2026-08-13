# jev.lv — personal visitcard site

Static site (plain HTML/CSS/JS, no build step) for **jev.lv**, deployed from
**https://github.com/jevlab13/jevcode**.

## 0. Make the repo public

GitHub Pages (free plan) only publishes from **public** repos. Since this repo
has no secrets in it (just a personal website), make it public:

1. Go to https://github.com/jevlab13/jevcode → **Settings** (top tab of the repo, not your account).
2. Scroll to the bottom, red **"Danger Zone"** section.
3. Click **Change visibility → Change to public**.
4. Type the repo name (`jevcode`) to confirm.

## 1. Upload the files (no git install needed)

The easiest way, since this is your first time on GitHub:

1. Go to https://github.com/jevlab13/jevcode
2. Click **Add file** (top right, above the file list) → **Upload files**.
3. Drag in all 6 files from this folder: `index.html`, `style.css`, `script.js`, `i18n.js`, `CNAME`, `README.md`.
4. Scroll down, add a commit message (e.g. "Visitcard hub + languages"), and click **Commit changes**.

If you're updating a site that's already live: doing the same upload again will overwrite the existing files with these new versions (GitHub matches by filename), and the live site updates automatically within a minute or two.

That's it — no terminal required. (If you later want the terminal/git workflow, it's at the bottom of this file under "Optional: using git".)

## 2. Turn on GitHub Pages

1. In the repo, go to **Settings → Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)` → **Save**.
4. Under **Custom domain**, type `jev.lv` and click **Save**. GitHub will confirm the `CNAME` file (already included in your upload) matches.

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

- `index.html` — the visitcard hub (Professional / Private / Sports / Contacts) with a language switcher
- `style.css` — dark "blueprint × squash-court" design system
- `i18n.js` — all text in English, Russian, Latvian, and German, in one editable dictionary
- `script.js` — page routing (no reload when switching sections), language switching, hero line animation, click-to-reveal email (keeps addresses out of the raw HTML so scrapers can't harvest them)
- `CNAME` — tells GitHub Pages to serve this site on `jev.lv`

## Adding a language later

Open `i18n.js`, copy the whole `en: { ... }` block, translate every value, and give it a new key (e.g. `fr:`). Then open `script.js` and add that key to the `LANGS` array near the top. Finally, add one more button in `index.html`'s `.langbar` (copy an existing `<button class="lang-btn" data-lang="...">` line and change the code/label). Re-upload the three files and the new language button appears.

## Editing later

Everything is plain text — open `index.html` in any editor to update copy, or `style.css` to tweak colors/spacing. The simplest way to update the live site: open the file on GitHub, click the pencil (✎) **Edit** icon, make changes, and **Commit changes**. GitHub Pages redeploys automatically within a minute or two.

## Optional: using git (terminal)

If you later set up git locally instead of uploading through the browser:

```bash
git clone https://github.com/jevlab13/jevcode.git
cd jevcode
# copy/edit the site files into this folder
git add .
git commit -m "Update site"
git push
```
