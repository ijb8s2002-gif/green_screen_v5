# Green Screen v5 — setup & upload guide (round 1)

This is the brand-new Green Screen. It starts empty, keeps nothing from the old app, and saves to the cloud automatically. The old app at `/green_screen_v4/` keeps working exactly as before.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The page that loads the app |
| `app.js` | All the app logic, including cloud sync |
| `styles.css` | The look: Sand / Moss / Stone themes |
| `sw.js` | Lets the app open offline and know when there's an update |
| `manifest.json` | Name, colors and icons for installing the app on a phone or computer |
| `icons/` | App icon in every size, plus the browser-tab icon |
| `SETUP.md` | This guide (optional to upload) |

## 1. Create the new repo (one time)
1. Go to github.com → the **+** in the top right → **New repository**.
2. Name: `green_screen_v5`.
3. Set it to **Public**. GitHub Pages on a free account needs a public repo; your old one is public too.
4. Leave everything else unchecked and click **Create repository**.

## 2. Upload the files
1. Unzip `green-screen-v5-round1.zip` on your computer.
2. In the new repo, click **uploading an existing file**, or **Add file → Upload files**.
3. Open the unzipped folder, select **everything inside it** (including the `icons` folder) and drag it onto the GitHub page. Drag the contents, not the outer folder itself.
4. Check that `icons/` appears in the upload list with 6 files.
5. Scroll down, type a message like `Round 1`, and click **Commit changes**.

## 3. Turn on GitHub Pages (one time)
1. In the repo: **Settings → Pages** (left side).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)** → **Save**.
4. Wait 1–2 minutes and refresh that page. It will show your address:
   **https://ijb8s2002-gif.github.io/green_screen_v5/**

## 4. First check (2 minutes)
1. Open the address on your computer.
2. Look at the bottom of the sidebar. Within a few seconds the status should read **Saved**, with a green dot.
3. Click **New project**, type a client name, and press Enter. You land on the new project page.
4. Open the same address on your phone. The project should be there.
5. Check off a step on your phone and watch it check off on your computer within a second or two, with no refresh.

If the status says **Sync problem**, hover over it (or open Settings → Data & backup) to see the reason, then see *Troubleshooting* below.

## 5. Install it like an app (optional, each device)
- **iPhone / iPad (Safari):** Share button → **Add to Home Screen** → Add.
- **Android (Chrome):** ⋮ menu → **Install app** (or *Add to Home screen*).
- **Computer (Chrome / Edge):** the install icon at the right end of the address bar → **Install**.

The new app shows the sprout icon on green. Your old app keeps its dark "G" icon, so you can tell them apart. Delete the old one whenever you're ready.

## 6. Uploading a new round or a fix later
1. In the repo: **Add file → Upload files**.
2. Drag in the new files. Same names replace the old ones, which is what you want.
3. Commit.
4. Within a minute or two, any open copy of the app shows **"New version available · Reload."** Click **Reload**. Your data is never affected by an update.

## Good to know
- **Saving is automatic.** There's no save or push button. Every change is saved the moment you make it.
- **Offline is fine.** Changes made without signal are kept on the device and sent when you're back online. The status shows **Offline** meanwhile.
- **Undo everything:** each change shows a toast with **Undo**, and **Ctrl+Z / ⌘Z** works too.
- **Try things without touching your real data:** add `?local` to the address, e.g. `…/green_screen_v5/?local`. The status shows **This device**, and nothing goes to the cloud.
- **Backup:** Settings → Data & backup → **Download backup** saves a dated copy of everything.
- **Starting over after testing:** in the Firebase console, open **Firestore Database** and delete the `gs5_projects` collection. That wipes v5's projects only; the old app's `greenscreen` data is untouched. Delete `gs5_meta` too if you want the workflow, designers and crews reset to the defaults.

## Troubleshooting
- **Status stuck on "Saving…" or showing "Sync problem: … unauthorized domain":** Firebase console → **Authentication → Settings → Authorized domains** must include `ijb8s2002-gif.github.io`. It should already be there from the old app.
- **"Sync problem: … admin-restricted-operation":** Firebase console → **Authentication → Sign-in method** → make sure **Anonymous** is enabled. It should be, since the old app uses it.
- **"Missing or insufficient permissions":** your Firestore rules need to allow signed-in users. The rules you sent already do, so this shouldn't happen unless they change.
- **The page looks old after an upload:** close and reopen the app, or click Reload on the update banner.

## What round 1 includes
- **Data and automatic sync:** one record per project, live across devices, works offline, sync status in the sidebar.
- **Sidebar:** collapsible and remembered per device, recently edited projects (pop-outs when collapsed), Due Soon count.
- **Themes:** Sand, Moss and Stone, plus a Motion on/off switch (Settings).
- **New project form:** client name, address, designer, PO#, starting stage; duplicate check; Enter to create; lands on the new project page.
- **Projects page:** a file cabinet by designer, 10 folders per drawer, 4 sorts, search, PO# editable on the folder, folder-open animation, and archive/delete with Undo.
- **Project page:**
  - Designer, address, PO# and name edited right in the header; Archive and Delete buttons.
  - The stage bar ("open to this stage") with the cascade animations, the Completed stages fold and Complete/Reopen stage.
  - Every step has a checkbox, target-date menu, priority tile with the raise-priority suggestion, and status menu; click a step to see its detail and add a note.
  - Project-only steps you add yourself, with move up/down and delete.
  - The "Archive?" prompt after Project Install.
- **Settings (partial):** appearance, sync status and Download backup.

**Coming next.** Round 2: Dashboard, Tasklist, Due Soon, Workflow. Round 3: Operations with the ops email builder, Archived with the 14-day cleanout, the rest of Settings (designers, crew leaders, Restore).
