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

No Longer works. Don't delete your saved replies, download your saved replies .json file and don't lose it OR you will have to create new by yourself! :D

This will remove your locally saved replies and reload the default replies from `defaultReplies.js`.

Important: this resets all local changes. If you made custom edits, export a JSON backup before resetting.

## Usage

Cread – click on New button –> feel necessary fields -> click Save to save changes.

Copy – click on a card of required SR and it is saved to buffer -> just cmd/ctrl–v anywhere :)

Edit -> click on edit (pencil) button -> click Save to save changes.

Deactivate (temporary) – edit your SR -> uncheck the box.

Delete (permannt) – edit your SR -> uncheck the box -> click on delete (x) button on top right corner of SR card.

TODO: Import, Export, 

## Updating

Before deleting replies, importing a new JSON file, or updating the extension, use **Export** to save a JSON backup.

## Privacy

Saved replies are stored locally in your browser.

The extension does not send saved replies, ticket content, or user data to any external server.

The extension checks the current tab URL only to enable the Side Panel on allowed help desk pages.
