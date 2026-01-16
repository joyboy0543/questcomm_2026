# QuestComm — Case Stations Update

This drop-in mini-project shows the four updated stations you asked for:

- **Cipher Desk**: Caesar-shift decoder tied to a **scrambled jewel image** that auto-sorts when the decoded word matches.
- **Logic Board**: Replaced with a clean **Mastermind** code-breaking game.
- **Field Network**: New **Planarity** (untangle) puzzle. Drag nodes until no edges cross.
- **Pattern Lab**: **Simon** memory game; reach level 8 to clear.

## How to run
Open `index.html` directly in a browser. No build tools or servers are required.

## Swap in your case data
Edit `modules/cipher.js`:

```js
const encodedWord = 'UFTU';      // the ciphertext shown to players
const targetDecoded = 'TEST';    // the plaintext that solves the station
```

> When `targetDecoded` equals the live decoded value produced by the slider, the jewel grid animates into the correct order.

To replace the placeholder jewel artwork, drop a file at `assets/jewel.jpg` or edit `style.css` to point to a different path. The tiles use `background-image:url('assets/jewel.svg')` by default.

## Integrating into your existing repo
- Copy `modules/*.js`, `style.css`, and the updated markup inside the **Cipher Desk**, **Logic Board**, **Field Network**, and **Pattern Lab** sections into your existing pages.
- Keep the element IDs the same or update the `init*` functions if you change them.
- If you already have a router/tab system, only move the corresponding section HTML and call the initializers after DOM load.

## Mobile
Layout collapses the sidebars under 1100px width and stacks the Cipher grid.

## License
All code in this drop is MIT; the placeholder SVG is included and can be replaced with your own asset.
