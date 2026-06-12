# Local Test Assets

Use these SVG files to test upload and matching behavior without connecting to a live OCR provider.

## Files

| File | Expected local result | What it exercises |
| --- | --- | --- |
| `old-tom-bourbon.svg` | Clear | Exact match on common distilled spirits fields. |
| `stones-throw-import.svg` | Clear/check | Case and punctuation tolerance for brand, producer, and importer text. |
| `north-coast-gin.svg` | Problem | Government warning prefix uses `Government Warning:` instead of the required all-caps prefix. |
| `blue-harbor-rum.svg` | Check | Application fixture is missing class/type, so the packet needs agent completion. |

## Local Workflow

1. Start the app with `npm run dev`.
2. Open `http://127.0.0.1:3001`.
3. Choose **Add label images**.
4. Select one or more SVG files from this folder.
5. Confirm the application fields.
6. Run the selected packet or the full queue.
7. Review field findings and the extracted text tab.

Without `OPENAI_API_KEY`, the app maps these filenames to deterministic sample evidence. With `OPENAI_API_KEY`, uploaded images are sent to the configured model as data URLs and the deterministic rules still decide the final routing.

