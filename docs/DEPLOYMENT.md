# Deployment Runbook

## Local Verification

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

Open `http://127.0.0.1:3000` or the port printed by Next.js.

## GitHub

1. Create an empty GitHub repository.
2. Add the remote:

```bash
git remote add origin <github-repo-url>
git push -u origin main
```

3. Confirm these files are visible in GitHub:
   - `README.md`
   - `REVIEWER_GUIDE.md`
   - `docs/DESIGN_BRIEF.md`
   - `docs/DEPLOYMENT.md`
   - `USER_GUIDE.md`
   - `test-assets/`

## Vercel Deployment

Vercel is the recommended host because this is a Next.js app with an API route.

1. In Vercel, choose **Add New Project**.
2. Import the GitHub repository.
3. Framework preset: **Next.js**.
4. Build command: `npm run build`.
5. Deploy.
6. Add the Vercel URL to `README.md` and `REVIEWER_GUIDE.md`.

## Environment Variables

No environment variables are required for evaluation mode.

Optional live extraction:

```text
OPENAI_API_KEY=<server-side key>
OPENAI_MODEL=<model name>
```

Without `OPENAI_API_KEY`, the app uses sample evidence mode so reviewers can still test the full workflow.

## Smoke Test After Deploy

1. Open the public URL.
2. Choose **Try demo cases**.
3. Run all packets.
4. Confirm priority lanes appear.
5. Open North Coast Gin and verify the warning issue is shown.
6. Export the CSV summary.
7. Upload one SVG from `test-assets/` and run the selected packet.

## Notes

- Do not commit API keys.
- GitHub Pages is not recommended because this app uses a server API route.
- Cloudflare Pages may work with a Next.js adapter, but Vercel is simpler for this prototype.

