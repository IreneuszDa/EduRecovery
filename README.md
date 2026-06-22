# EduRecovery Teacher Assistant

A teacher-first digital assistant that helps educators quickly identify learning gaps caused by disrupted schooling and generate a practical 14-day recovery plan with printable exercises.

## Overview

EduRecovery is designed to support teachers and volunteer educators who need immediate, low-friction tools to assess students returning to class after interruptions in their education. It specifically targets students aged 11-14 (Grades 5-6) in Mathematics.

The application evaluates students using a quick screening assessment. Rather than providing generic feedback, **all diagnostic outputs and recovery recommendations are mapped directly to the official Ukrainian Model Curriculum (NUSH) for Mathematics (O.S. Ister)**. This ensures that the generated recovery plans are officially compliant and immediately actionable for Ukrainian educators.

## Features

- **Teacher-First Workflow:** Built for the educator, generating a comprehensive "Teacher Recovery Brief".
- **Curriculum-Aligned Assessment:** 10-question math screening directly linked to the official Ukrainian curriculum.
- **Automated Gap Identification:** Identifies specific curriculum expectations the student has missed (e.g., "[MATH-5-PERC] Understands percentage as a hundredth part of a value").
- **14-Day Recovery Plan:** Automatically generates a structured, day-by-day intervention plan.
- **Low-Tech Support:** Provides a print-ready view for offline classroom use.
- **Bilingual Support:** Interface and data support both English and Ukrainian.

## Development

This is a React MVP built with TypeScript and Vite. It runs completely client-side with no backend required for the demo.

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Documentation

For more context on the product and data model, see the `docs/` directory:
- `docs/product-brief.md`
- `docs/data-preparation-brief.md`
- `docs/demo-scenario.md`

## Hackathon Context

This project was built for the Day One Ukraine hackathon under the **Digital Assistant for Educators** track.
