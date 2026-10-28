# Editing guide

## Change a teacher video

Open `assets/content.js` and find the step you want. In `id`, replace the current 11-character YouTube ID with the new video's ID. For example, the ID of `https://www.youtube.com/watch?v=YCLyAmXtpfY` is `YCLyAmXtpfY`. Adjust the appropriate `label`, start/end timestamps, and practice instructions if necessary.

## Change the riff chapters

Each object inside `runChapters` uses timestamps in **seconds**. For example, `start: 44` means 0:44, and `end: 121` means 2:01. The button labels are editable.

## Change the Indian melodic exploration lesson

Set the YouTube ID in `steps[2]` and update the `raga` clip start/end. Be sure to edit the text of the lesson in `assets/app.js` under `case 2:` if switching traditions. The current instructions specifically name Raag Bhoopali.

## Change the design

Edit the CSS custom properties at the top of `assets/styles.css`: `--navy`, `--cream`, `--peach`, `--green`.

## Editing directly on GitHub

Open a file, use GitHub's pencil/edit control, commit changes to `main`, and Netlify will redeploy. For larger changes, create a branch and pull request to get a deploy preview.

## Browser-stored data

The saved phrases use the `daily-vocal-studio-v3` localStorage key. Do not rename the key lightly: doing so can make a browser's saved phrases appear to vanish without a migration.
