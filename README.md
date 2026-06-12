# Label Review Workbench

Standalone take-home prototype for AI-assisted beverage alcohol label review.

The product concept is a **guided evidence packet**. Instead of exposing a dense OCR dashboard, the app helps a compliance agent answer which applications likely need correction, which need human confirmation, and which have no automated concerns.

## Review Entry Point

- Live demo: [https://ttb-label-review-workbench.vercel.app](https://ttb-label-review-workbench.vercel.app)
- 3-minute walkthrough: [REVIEWER_GUIDE.md](./REVIEWER_GUIDE.md)
- User workflow: [USER_GUIDE.md](./USER_GUIDE.md)

The intended review path is the deployed app. Local setup and verification commands are kept in the deployment runbook for source-code review.

## Documentation

| Document | Purpose |
| --- | --- |
| [docs/DESIGN_BRIEF.md](./docs/DESIGN_BRIEF.md) | Product angle, architecture diagram, scope, and trade-offs. |
| [docs/DECISIONS.md](./docs/DECISIONS.md) | Short rationale for the main product and engineering decisions. |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | GitHub/Vercel deployment steps, environment variables, and post-deploy smoke test. |
| [docs/IMPLEMENTATION_LOG.md](./docs/IMPLEMENTATION_LOG.md) | Brief build log explaining how the final direction evolved. |
| [test-assets/README.md](./test-assets/README.md) | Synthetic upload fixtures for testing label matching behavior. |

## What Version 1 Includes

- Four-step guided flow: Choose labels, Confirm data, Run checks, Review packet.
- Empty first screen so users choose upload or demo cases intentionally.
- Multi-label upload, batch verification, priority lanes, and CSV export.
- Editable application packet; edits clear stale findings.
- Field-level findings with extracted label evidence and next action.
- Replaceable server extraction provider with offline sample evidence mode.
- Deterministic TypeScript rules for warning text, alcohol, volume, and fuzzy text matching.
- Unit tests covering normalization and compliance routing.

## Requirement Traceability

| Requirement signal | Implementation |
| --- | --- |
| Simple for mixed technical comfort | Stepper flow, guided intake, priority lanes, decision summary. |
| Batch submissions | Queue review, priority lanes, and CSV export. |
| Matching with judgment | Tolerant text checks; strict numeric and warning checks. |
| Security/firewall concern | Server-side model key only, optional provider, offline demo mode. |
| Human oversight | Findings are decision support, not final approval. |

## Known Limits

- No COLA integration, authentication, database, or retention workflow.
- Live OCR depends on a configured model key and should be replaced by an approved agency-hosted provider for production.
- Warning prominence and boldness remain manual visual checks.
- PDF artwork conversion and asynchronous large-batch processing are outside version 1.
