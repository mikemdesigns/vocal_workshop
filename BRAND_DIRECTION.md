# Vocal Studio — brand direction / working names

**Status:** Final name selected: **Superstar Vocal Studio**. Logo direction: **Variant 2**, a music note inside an ascending star outline crossed by an emerald vocal ribbon.

## Photo-led palette

| Name | Hex | Use | Origin |
| --- | --- | --- | --- |
| Velvet Burgundy | `#61041C` | Header, cover, star icon | Arch in photograph |
| Stage Emerald | `#053C31` | Primary buttons, progress | Green gown |
| Midnight Pine | `#05251E` | Dark green support | Gown shadows |
| Garnet Rose | `#7A2334` | Accent, highlights | Arch's lighter facets |
| Warm Bronze | `#C4865D` | Small decorative accents | Warm highlights |
| Champagne | `#F8F3E9` | Page background | Complementary neutral (not sampled) |

Warm Bronze is **not** used as small text on light surfaces; contrast would be insufficient. Deep emerald handles important interaction contrast. All photographs are copies resized for web; the user's full-resolution originals remain outside the repository.

## Former name directions (for reference)

1. **Superstar Vocal Studio** — exuberant, kid-facing, feels personal; slightly more performance-oriented. (working title)
2. **The Spotlight Studio** — elegant and photo-led; works beyond singing if she later expands into acting or performance.
3. **Her Voice Studio** — personal, strong, mature without feeling adult; puts ownership and growth first.
4. **Starbound Vocal Studio** — aspirational, dynamic, youthful; distinctive but more playful.
5. **Encore Voice Studio** — polished, music-first, stages and practice; less obviously personalized.
6. **The Voice Atelier** — luxurious/editorial; possibly too formal for an eleven-year-old.
7. **Shine Voice Lab** — approachable, experimentation-friendly, but less distinctive.

**Recommendation:** Test the working title **Superstar Vocal Studio** alongside **The Spotlight Studio** and **Her Voice Studio** with the singer. The hero line *Your voice. Your spotlight.* works for all three.

## Changing the working title

Edit `assets/content.js` at the top:

```
studio: {
  name: 'Superstar Vocal Studio',
  headline: 'Your voice.<br><em>Your spotlight.</em>',
  message: 'Five small steps to grow your voice, explore new sounds, and sing what you love.'
}
```

The title automatically updates in the header, footer and browser tab. `headline` supports trusted HTML markup in this repo file only.

## Privacy note

The website includes two **recognizable photographs of a child** in `assets/photos/`. Publishing through Netlify generally makes those photos publicly accessible to anyone with the address, even with a private GitHub repository. Make that choice deliberately; privacy requires access controls, not merely disabling indexing. Consider keeping the photos out of the public deployment if the site will be shared broadly. The app includes a `noindex` instruction to search engines by default, but it does **not** create access restrictions.


## Approved logo — chosen Variant 2

The logo combines **a five-point star** (confidence), **a musical note** (daily vocal training), and **an ascending emerald ribbon** (the ongoing work of growing a voice). The mark was lifted from the approved concept board rather than being replaced by a generic star. Its warm bronze/cream contrast against deep burgundy connects it to the singer's portrait, while the emerald sweep echoes the gown. The final home-screen crop is kept large and recognizable without additional symbols.

- `assets/brand/superstar-logo.png`: selected illustrated logo, used in the app header and welcome area.
- `assets/brand/app-icon-512.png`: standalone 512px app icon.
- `assets/brand/favicon-64.png`: compact browser-tab raster icon.
- `apple-touch-icon.png`: Apple home-screen icon.
- `icon.svg`: simplified, flat SVG fallback inspired by the selected mark (not a pixel-identical vector trace).

The approved artwork is a crop from the generated concept presentation; it is **raster artwork**, not an editable master SVG. For any large-format printing, recreate the final mark as a clean vector and check details at small sizes.
