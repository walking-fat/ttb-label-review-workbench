# Local Test Assets

Use these SVG files to test upload and matching behavior without connecting to a live OCR provider.

## Files

| File | Expected local result | What it exercises |
| --- | --- | --- |
| `old-tom-bourbon.svg` | Clear | Exact match on common distilled spirits fields. |
| `stones-throw-import.svg` | Clear/check | Case and punctuation tolerance for brand, producer, and importer text. |
| `north-coast-gin.svg` | Problem | Government warning prefix uses `Government Warning:` instead of the required all-caps prefix. |
| `blue-harbor-rum.svg` | Check | Application fixture is missing class/type, so the packet needs agent completion. |

## Upload Workflow

1. Open the deployed app, or start the app locally with the deployment runbook.
2. Choose **Add label images**.
3. Select one or more SVG files from this folder.
4. Confirm the application fields.
5. Run the selected packet or the full queue.
6. Review field findings and the extracted text tab.

Without `OPENAI_API_KEY`, the app maps these filenames to deterministic sample evidence. With `OPENAI_API_KEY`, uploaded images are sent to the configured model as data URLs and the deterministic rules still decide the final routing.
