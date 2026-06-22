# EduRecovery MVP Implementation Guide

This document outlines the steps for a developer to turn the prepared data into a working hackathon MVP.

## 1. Parse and Structure the Data
The data prepared in the `data/` directory is in Markdown format for easy review. To use it in the app:
*   Convert the contents of `questions.md` and `recovery-blocks.md` into static JSON or TypeScript constants (e.g., `src/data/questions.ts`, `src/data/recoveryBlocks.ts`).
*   This avoids needing a backend or database for the MVP.

## 2. Build the UI Components
Using React (Next.js or Vite):
*   **Teacher Setup Form:** Create a landing page with a simple onboarding form to collect student context (grade, language, disrupted learning mode, available time).
*   **Screening Flow:** Build a quiz component that presents the 10 questions one at a time. It should record the chosen answer and track whether it's correct.
*   **Results Dashboard:** Build the final view that displays the "Teacher Recovery Brief," the generated 14-day plan, and printable exercises.

## 3. Implement Scoring and Logic
Translate the logic in `scoring-rules.md` into a deterministic scoring function:
*   Calculate the score for each of the 5 categories (0/2, 1/2, or 2/2).
*   Sort the categories to find the two with the lowest scores (Primary Gap and Secondary Gap).
*   Apply the tie-breaking hierarchy if needed (Fractions > Percentages > Equations > Geometry > Word Problems).
*   Assign confidence labels based on the scores ("Strong gap signal", "Initial signal", "Likely secure").

## 4. Generate the Recovery Plan and Brief
Use the logic from `plan-template.md` and `teacher-brief-copy.md`:
*   Dynamically inject the identified Primary and Secondary gaps into the report text.
*   Fetch the corresponding remediation activities from the converted `recovery-blocks` data.
*   Render the 14-day schedule alternating focus between the Primary and Secondary gaps as defined in the template.

## 5. Optimize for Print
A core feature of the MVP is providing practical, low-tech materials:
*   Ensure the final Results Dashboard/Teacher Recovery Brief uses print-friendly CSS (`@media print`).
*   Hide unnecessary navigation or UI elements when printing.
*   Ensure the exercises and 14-day plan format well on standard A4 paper so the teacher can easily print or save to PDF.

## 6. (Optional) Language Support
If time permits within the hackathon:
*   Implement a simple language toggle (e.g., UI strings in an object mapping keys to English and Ukrainian translations).
*   Since the data was written in plain English, it should be straightforward to translate the constants file.
