# Saved Replies Rescue

A tiny Chrome Side Panel extension for managing local saved replies/templates.

The extension is designed for support agents who need quick access to saved replies while working in HelpScout or similar help desk apps.

By default, the Side Panel is enabled only on HelpScout pages.

You can change the allowed domains (ALLOWED_HOSTS) in `background.js`.

## Installation

1. Open this repository on GitHub.
2. Click **Code**.
3. Click **Download ZIP**.
4. Unzip the downloaded file.
5. Open Chrome.
6. Go to:

   ```text
   chrome://extensions
   ```

7. Enable **Developer mode** in the top-right corner.
8. Click **Load unpacked**.
9. Select the unzipped project folder.

The selected folder must contain `manifest.json`.

## How to open

1. Open HelpScout.
2. Click the **Saved Replies Rescue** extension icon in Chrome.
3. The Side Panel should open on the right.

If the extension does not open, make sure you are on a HelpScout page or update the allowed domains (ALLOWED_HOSTS) in `background.js`.

## Reset to default replies

If you accidentally delete or break saved replies and do not have a JSON backup, you can reset the extension to the default saved replies.

1. Open the Side Panel.
2. Right-click inside the Side Panel.
3. Click **Inspect**.
4. Open the **Console** tab.
5. Run:

   ```js
   localStorage.removeItem("savedReplies");
   location.reload();
   ```

This will remove your locally saved replies and reload the default replies from `defaultReplies.js`.

Important: this resets all local changes. If you made custom edits, export a JSON backup before resetting.

## Usage

TODO

## Updating

Before deleting replies, importing a new JSON file, or updating the extension, use **Export** to save a JSON backup.

## Privacy

Saved replies are stored locally in your browser.

The extension does not send saved replies, ticket content, or user data to any external server.

The extension checks the current tab URL only to enable the Side Panel on allowed help desk pages.
