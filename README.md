# Superstar Vocal Studio

A portrait-led, Variant 2 star-note-ribbon-branded, five-step daily singing practice app with teacher-led warmups and riffs, Indian melodic exploration, a LoopTube-powered **My Song** looper, and a self-guided cool-down.

The app saves the daily checklist and named My Song phrases in the browser's `localStorage`, on the **same device, browser, and website hostname**. It is not a cloud-synced account.

## Quick start

- Open `index.html` to review the layout (external embedded video services work best from HTTPS).
- To preview on a local web server, run `python3 -m http.server 8000` inside this folder, then open `http://localhost:8000`.
- The site uses **plain HTML, CSS, and JavaScript**. There are no npm dependencies or build command.

## Where to edit

| File | What you can change |
| --- | --- |
| `assets/content.js` | Teacher video IDs, exercise titles and minutes, riff timestamp chapters, and raga video start/end points |
| `index.html` | Page structure, top heading, accessibility labels, footer |
| `assets/styles.css` | Colors, typography, layout, phone styling |
| `assets/app.js` | Screen behavior, LoopTube integration, saved-song logic, timers, and exercise instructions |
| `netlify.toml` | Netlify publish configuration |

The exact exercise paragraphs are currently in the `renderContentOnly()` function in `assets/app.js`. They have been preserved from version 3.

## GitHub and Netlify setup — no command line required

1. Extract the repository ZIP on your Mac. **Keep the hidden `.git` folder**; the repo has an initial commit.
2. In [GitHub Desktop](https://desktop.github.com/), select **File → Add Local Repository** and select the extracted `daily-vocal-studio-repo` folder.
3. Click **Publish repository** and choose whether the repo is private. The site will still be publicly accessible if the Netlify project is public.
4. In the **existing Netlify site**, open **Project configuration → Developer settings → Continuous deployment → Repository → Link repository** and select your GitHub repo. This preserves the site's existing domain.
5. If Netlify asks for build settings, use **production branch `main`**, **no build command**, and **publish directory `.`**. `netlify.toml` already specifies the publish directory.
6. For future updates: edit a file, commit and **Push origin** in GitHub Desktop. Netlify deploys after the push. You can also edit files directly on GitHub and commit to `main`.

**Important when replacing an existing manual Netlify deployment:** keep the same Netlify project and domain if you want the saved phrases in that browser to remain accessible. Moving to another domain loses access to the old site's local browser storage (though it doesn't delete it). The repo does *not* contain saved phrases from a browser.

## My Song limitations

The embedded [LoopTube](https://www.looptube.xyz/) interface supports A/B loops and pitch-preserving playback speed adjustment. LoopTube does not document a way to send its internal draggable A/B marker or speed changes to the parent app. The player controls are handy for experimentation, but to save a phrase you need to type the final **A start**, **B end**, and **speed** in the outside fields, then tap **Save phrase**, or paste a LoopTube share URL containing those values.

The app is an independent practice companion; it is not affiliated with YouTube or LoopTube. Third-party availability and embed policies can change.

## Development / publishing safety

- Do not commit passwords or API keys; this site needs none.
- Store personal recordings elsewhere; this version only saves text and practice settings locally.
- A Git repository records app files, not the child's private listening or practice history.

## Visual identity / alternate names

See [`BRAND_DIRECTION.md`](BRAND_DIRECTION.md) for the approved logo story, source icon art, color palette, and brand assets. Photos are optimized for the web in `assets/photos/`.

**Child photo safety:** If the site is publicly hosted, the images are public even when the GitHub repository is private. Be intentional before sharing the URL or promoting the site.

### Latest logo update

This revision incorporates the chosen Variant 2 symbol into the header, hero, tab favicon, and Apple Home Screen icon. No app-state or song-saving keys were changed.
