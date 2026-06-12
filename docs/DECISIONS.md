# Decisions

## Use A Guided Evidence Packet

The UI is organized around a selected review packet and the agent's next action. This is intentionally different from a dense OCR dashboard.

## Use A Stepper Instead Of Tabs

Tabs make the app feel like several equal dashboards. A stepper is better for first-time users because the work has a natural order: choose labels, confirm data, run checks, review results. Users can still go backward without losing state.

## Use Standards-Informed Visual Design Without Mimicking A Public Site

The interface keeps public-sector usability cues: high contrast, clear focus states, restrained color, plain-language labels, and squared controls. It avoids copying the visual identity or wording of public reference submissions by using a lighter workbench shell and assignment-specific copy.

## Keep Prototype Caveats Out Of The Primary Workflow

The app should feel like a usable review tool. Detailed caveats about COLA integration, storage, identity, model provider, and production deployment belong in the README/runbook. The UI keeps practical review context and marks synthetic demo cases as evaluation mode.

## Keep AI As A Provider Boundary

The extraction layer is replaceable. Version 1 can run with local sample evidence, while the API route can call a model when an approved key/service is available.

## Deterministic Rule Engine

AI reads evidence; TypeScript rules route the case. This makes warning checks, numeric checks, and fuzzy text comparisons easier to test and explain.

## Componentized POC

This is still a time-boxed prototype, but it is structured like a small production app: domain logic, server provider, fixtures, utilities, and components are separate.
