# Total Cars Switzerland

Portal automotivo suíço em desenvolvimento.

## Local

```bash
npm install
npm run dev
```

## Production checks

Before deploying:

```bash
npm install
npm run build
```

The server routes `/api/diagnostico` and `/api/revista` require `GEMINI_API_KEY`.
Configure it as a server-side Vercel environment variable for Production and Preview.
Never expose it as `NEXT_PUBLIC_GEMINI_API_KEY`.

## Deploy

Production is intended to deploy automatically from the `main` branch on Vercel.
Security headers are defined in `vercel.json`.

## Current architecture

- Next.js App Router
- React 19
- Server-side Gemini integration for automotive diagnostics and magazine generation
- Browser-local diagnostic conversation history
