# Reviewer Guide

This prototype is a guided workbench for checking label artwork against application data. It is decision support only; the compliance agent remains the final reviewer.

## 3-Minute Demo

1. Open the deployed app URL listed in `README.md`.
2. Choose **Try demo cases**.
3. Confirm the first packet's application fields.
4. Go to **Run checks** and choose **Run all packets**.
5. Review the priority lanes:
   - **Problem**: correction likely needed.
   - **Check**: human confirmation needed.
   - **Incomplete**: application data is missing.
   - **Clear**: no automated concern found.
6. Open **North Coast Gin** to see strict warning capitalization detection.
7. Open **Stone's Throw** to see tolerant text matching.
8. Export the CSV summary.

## Upload Test

Use files in `test-assets/` with **Add label images** if you are reviewing the source repository. Without an API key, those filenames map to deterministic sample evidence so the workflow is testable offline.

## What To Notice

- The UI starts empty so reviewers choose upload or demo cases intentionally.
- AI/model extraction is isolated behind `/api/review`.
- TypeScript rules decide routing for repeatable, explainable behavior.
- Numeric values and the government warning are strict; names and addresses allow controlled tolerance.
- Priority lanes appear only after verification, not before.
