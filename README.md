# Art Adventure: My Own View

A 3D browser game for primary school art classes, built around a three-layer creative sequence: idea, making, reflection. Students play on a tablet or laptop, and their teacher sees the whole class gallery on a second page.

## Files

| File | What it is |
|---|---|
| `index.html` | The student game. Deploy this as the site homepage |
| `teacher.html` | Read-only class gallery for the teacher |
| `apps-script/Code.gs` | Google Apps Script that writes submissions into a spreadsheet |
| `README_zh-TW.md` | Chinese version of this document |

## The three layers

**Idea layer.** Before any tool appears, students pick one thing they want to say: something I love, a place I like, how I feel today, something I imagine, someone important, something that bothers me. This choice stays visible in the corner for the rest of the session, and the drawing station repeats it back to them. Separating idea from technique is the core move: it guarantees every student starts with content of their own, so the tools become a way to reach an idea rather than a test of ability.

**Making layer.** Three easels on Rainbow Island. The colour mixing lab treats all three primary pairs as correct, because they are. The shape workshop accepts any of four shapes. The drawing canvas accepts anything, including a blank one. There is no timer and no score, and the counter reads artworks made rather than points earned.

**Reflection layer.** One tap-sized question follows each station, plus a closing question at the gallery.

| When | Question |
|---|---|
| After mixing | Which colour do you like better? |
| After shapes | Why did you pick that shape? |
| After drawing | How much of this came from your idea? |
| At the gallery | Which one is most like you? |

Questions are tap-to-answer rather than typed, since typing in a second language would filter out exactly the students the game is for. Only the gallery title is free text.

### Reflection is not the only data

The game also logs behaviour without asking: how many times a mix was reset, how many times the canvas was cleared, how many strokes were drawn, how long each station took, and how often a student walked away from an easel and came back. Self-report and behaviour can then be compared, which is more informative than either alone. A student who says the drawing came entirely from their idea but cleared the canvas five times is telling you something the question alone would miss.

## Saving

Progress is stored in the browser using `localStorage`, so a student can close the tab and continue later on the same device. Two consequences worth planning for:

- **Shared tablets need the switch button.** Storage is tied to the browser, not the person. The done screen has a `Next student` button that clears the session. Show students where it is.
- **Preview environments block storage.** If the file is opened inside a sandboxed preview rather than a real deployment, saving silently turns off and the start screen says so. On GitHub Pages it works normally.

Students are identified by class code and seat number, for example `4A-17`. No names are collected anywhere in the system.

## Setting up the teacher view

**1. Create the spreadsheet and script**

- Make a new Google Sheet
- Extensions, then Apps Script
- Delete the placeholder code, paste in `apps-script/Code.gs`, and save
- Deploy, New deployment, Web app. Execute as **Me**, access **Anyone**
- Copy the `/exec` URL it gives you

**2. Connect the game**

Open `index.html`, find this line near the start of the script block, and paste the URL between the quotes:

```js
const APPS_SCRIPT_URL = '';
```

Leaving it empty is a valid setup. The game still works and still saves locally, it just does not send anything.

**3. Publish the sheet for reading**

In the sheet: File, Share, Publish to web. Choose the `Responses` sheet and the CSV format, then publish. Copy that link.

**4. Open the gallery**

Open `teacher.html`, paste the CSV link into the box, and load. The link is remembered on that computer. The page shows class totals, what students chose to say, which artwork felt most like them, and one card per student with their drawing.

## Deploying to GitHub Pages

1. Create a Public repository
2. Upload `index.html`, `teacher.html`, and the `apps-script` folder to the root
3. Settings, Pages, source `Deploy from a branch`, branch `main`, folder `/ (root)`
4. Student link: `https://<username>.github.io/<repo>/`
5. Teacher link: `https://<username>.github.io/<repo>/teacher.html`

Keep the teacher link off the student handout. It is read-only, but there is no reason to hand it out.

### If the screen is blank

Three.js loads from `cdnjs.cloudflare.com`. If a school network blocks external CDNs, nothing renders. Download `three.min.js`, add it to the repository, and change the script tag to `<script src="./three.min.js"></script>`.

## Known limits

- Drawings are stored as small PNG thumbnails, 160 by 110 pixels. A spreadsheet cell holds 50,000 characters, and any image over that is dropped rather than truncated, so the teacher card shows a placeholder instead
- Submissions are sent once. If the network is down, the work stays on the tablet and the student sees a message saying so, but there is no automatic retry
- The teacher page reads the sheet and never writes to it, so there is no way to reply to a student from it

## Possible next steps

- Peer comments restricted to the sentence frame "I can see..." rather than "You should..."
- A composition station, matching the fourth panel on the project poster
- An AI assistance path with a visible label showing how much help was used

## Licence

Three.js is MIT licensed. The code in this project is free to use and modify for teaching purposes.
