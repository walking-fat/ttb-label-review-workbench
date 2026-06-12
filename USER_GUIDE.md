# User Guide

## Review A Case

1. **Choose labels**: upload label images or choose **Try demo cases**.
2. **Confirm data**: select a packet and confirm the expected application fields.
3. **Run checks**: run the selected packet or the full queue.
4. **Review packet**: read the decision summary and field findings.
5. Resolve **Problem** findings before approval.
6. Confirm **Check** findings visually.
7. Use **Extracted text** only as supporting evidence.

## Outcome Meanings

- **Problem**: A field likely needs correction.
- **Check**: The system found a likely match or ambiguous evidence.
- **Incomplete**: Application data is missing.
- **Clear**: No automated concern was found.

## Batch Review

Use **Run queue** or **Run all packets** to review every queued packet. Priority lanes appear after checks run so reviewers can start with correction items before checking cleared cases.

## Prototype Notes

- This prototype is not connected to COLA or any production Treasury system.
- Demo cases are synthetic and included so reviewers can test clear, problem, check, and incomplete outcomes.
- Uploaded images are processed for the current browser session; the prototype does not include account management or permanent storage.
- If a model API key is not configured, the app uses sample evidence mode so the review workflow remains testable.
