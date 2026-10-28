// EDIT THIS FILE to change the daily practice content.
// Use only the 11-character YouTube video ID, not the full URL.
// Example: https://www.youtube.com/watch?v=YCLyAmXtpfY -> YCLyAmXtpfY
// Run chapter start/end values are seconds, as displayed by the video player.
// Changes to these values deploy automatically through Netlify after a Git push.
window.DAILY_VOCAL_CONTENT = {
  // Working title only. Change these three lines when you choose the final name.
  studio: {
    name: 'Superstar Vocal Studio',
    headline: 'Your voice.<br><em>Your spotlight.</em>',
    message: 'Five small steps to grow your voice, explore new sounds, and sing what you love.'
  },
  steps: [
    {name: 'Warm up', short: 'Warm up', minutes: 5, teacher: 'Jacobs Vocal Academy', id: 'YCLyAmXtpfY'},
    {name: 'Patterns & runs', short: 'Patterns', minutes: 6, teacher: 'Aussie Vocal Coach', id: 'ZeFgJURQjts'},
    {name: 'Raga exploration', short: 'Raga', minutes: 5, teacher: 'Bidisha Ghosh', id: '4Tkx2CEnCus'},
    {name: 'My song', short: 'My song', minutes: 7, teacher: 'Choose a phrase'},
    {name: 'Warm down', short: 'Warm down', minutes: 2, teacher: 'Gentle, self-guided'}
  ],
  warmup: {start: 0, end: 0, label: '5 Minute Vocal Warm Up · Jacobs Vocal Academy'},
  runChapters: [
    {name: 'Pattern 1 · slow', start: 44, end: 121},
    {name: 'Pattern 2 · slow', start: 173, end: 253},
    {name: 'Pattern 3 · slow', start: 310, end: 397},
    {name: 'Pattern 1 · fast (optional)', start: 121, end: 173}
  ],
  raga: {start: 110, end: 419, label: 'Raag Bhoopali · Simple alap section (1:50–6:59)'}
};
