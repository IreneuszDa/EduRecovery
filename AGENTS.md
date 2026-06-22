# AGENTS.md

## Project

This repository is for the Day One Ukraine hackathon MVP:

**EduRecovery Teacher Assistant**

A teacher-first digital assistant that helps educators quickly identify learning gaps caused by disrupted schooling and generate a practical 14-day recovery plan with printable exercises.

## Current Direction

The product must stay aligned with the hackathon track:

> Digital Assistant for Educators

Do not frame the product as a generic student quiz app. The student may answer questions, but the primary user and pitch hero is the educator.

## Core Product Decisions

- Primary user: teacher, NGO educator, volunteer tutor, school support worker.
- MVP subject: mathematics.
- MVP age group: 11-14 years old, roughly grade 6-7.
- MVP language direction: Ukrainian plus English or Polish.
- Diagnostic framing: use "quick screening", not "full diagnostic".
- Main output: Teacher Recovery Brief.
- MVP should work without login, accounts, backend, payments, or school dashboard.

## Core Flow

1. Teacher opens the app.
2. Teacher selects grade, language, daily study time, and classroom constraints.
3. Student completes a 10-question math screening.
4. App scores results by category.
5. App identifies likely learning gaps.
6. App generates a 14-day recovery plan.
7. App creates a printable Teacher Recovery Brief.

## MVP Data Model

The data preparation work should produce:

- 10 math screening questions.
- 5 categories:
  - fractions
  - percentages
  - geometry
  - equations
  - word problems
- 2 questions per category.
- 4 answer options per question.
- one correct answer per question.
- difficulty label per question.
- short explanation per correct answer.
- remediation blocks for each category.
- 14-day plan generation rules.
- teacher recommendations for each likely gap.
- printable exercises for each weak category.

## Writing And Product Tone

- Clear, calm, practical.
- Teacher-first.
- Supportive, not infantilizing.
- Do not overclaim assessment validity.
- Avoid saying the app "diagnoses" students in a clinical or high-stakes sense.
- Prefer "likely learning gap", "quick screening", "restart point", and "recovery plan".

## Ukraine-Relevant Constraints

The product should explicitly support:

- disrupted schooling,
- mixed-level classrooms,
- displaced students,
- Ukrainian-language learning contexts,
- low bandwidth,
- print-first or low-tech teaching,
- educators with limited technical confidence.

## Files To Read First

Start with:

- `docs/product-brief.md`
- `docs/data-preparation-brief.md`
- `docs/demo-scenario.md`
- `prompts/data-preparation-start.md`

The original source/context files remain at repository root:

- `hackathon-context.md`
- `idea-review-edurecovery.md`
- `edurecovery-teacher-assistant.md`

## Quality Bar

For data work:

- Keep content realistic for grade 6-7.
- Make questions unambiguous.
- Make answers easy to score deterministically.
- Keep wording translatable.
- Include teacher-facing explanations.
- Include low-tech classroom adaptations where useful.

For implementation work:

- Prioritize a complete demo flow over breadth.
- No authentication in MVP.
- No unnecessary backend.
- Make the printable report genuinely usable.
- Verify the app before considering the task complete.
