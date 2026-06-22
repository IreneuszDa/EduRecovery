# EduRecovery UA

Teacher-first recovery assistant for disrupted Ukrainian learning contexts.

This repository now uses the imported `Uczmy.pl` codebase as a UI/source foundation while keeping the EduRecovery MVP focused on:

- teacher and student role switching without login,
- English and Ukrainian UI,
- 10-question math quick screening,
- likely learning gap scoring,
- 14-day recovery plan,
- printable Teacher Recovery Brief,
- low-tech and print-first classroom support.

## Active App

The public Next.js app is intentionally narrow for the hackathon MVP:

- `app/page.tsx` renders `components/edu-recovery-app.tsx`.
- `lib/education-data.ts` contains the static screening and recovery content.
- `lib/scoring.ts` contains deterministic scoring.
- `public/logo.PNG` is the EduRecovery UA logo.

## Imported Uczmy.pl Code

The Uczmy.pl source has been imported into this repository. Backend-heavy routes that require auth, MongoDB, Google Drive, or mail configuration were moved out of the active Next `app/` router into:

```txt
uczmy-imported/app-routes/
```

Shared Uczmy-style components, assets, models, and utilities remain available in the repo for reuse.

## Development

```bash
npm install
npm run dev
npm run build
```

Open:

```txt
http://localhost:3000
```

## Notes

No `.env.local`, `.git`, `node_modules`, or `.next` artifacts were copied from the reference repo.
