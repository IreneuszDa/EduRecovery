# Data Preparation Brief

## Goal

Prepare the educational content and deterministic data needed for the EduRecovery Teacher Assistant MVP.

The output should allow a developer to build the complete demo flow without inventing questions, scoring rules, remediation content, or report copy.

**Crucial Requirement:** All diagnostic data, questions, and recovery blocks MUST map directly to the official Ukrainian Model Curriculum (NUSH) for Mathematics (O.S. Ister) so that recommendations are officially compliant.

## Required Data

### 1. Screening Questions

Create 10 math questions for students aged 11-14, roughly grade 6-7.

Use exactly 5 categories:

- fractions
- percentages
- geometry
- equations
- word problems

Create exactly 2 questions per category.

Each question should include:

- stable question ID,
- category,
- difficulty: easy, medium, or hard,
- question text,
- 4 answer options,
- correct answer ID,
- short explanation,
- curriculum reference (e.g., MATH-5-FRAC),
- teacher note explaining what an incorrect answer may indicate.

### 2. Scoring Rules

Define deterministic rules for:

- total score,
- score by category,
- weakest category detection,
- tie-breaking,
- confidence label.

Suggested confidence labels:

- initial signal,
- likely gap,
- strong gap signal.

Important:

Do not overclaim validity. This is a quick screening, not a complete diagnostic assessment.

### 3. Recovery Plan Blocks

For each category, create remediation blocks that can be used in a 14-day plan.

Each block should include:

- category,
- curriculum expectation missed (official text from the model curriculum),
- learning goal,
- teacher explanation,
- 3-5 suggested activities,
- low-tech adaptation,
- 3 printable exercises,
- mini-check question.

### 4. 14-Day Plan Template

Create a plan-generation logic that uses the two weakest categories.

The plan should include:

- day number,
- focus category,
- learning goal,
- teacher action,
- student task,
- estimated time,
- optional homework or practice.

### 5. Teacher Recovery Brief Copy

Create reusable copy for the final report:

- student summary,
- screening result explanation,
- likely gap explanation,
- recommended restart point,
- teacher recommendations,
- optional parent summary,
- disclaimer that this is a quick screening.

## Tone

- plain,
- practical,
- teacher-facing,
- supportive,
- easy to translate,
- no jargon unless explained.

## Output Format Recommendation

Prepare content in Markdown first, then optionally convert to JSON or TypeScript constants during implementation.

Suggested files:

- `data/questions.md`
- `data/scoring-rules.md`
- `data/recovery-blocks.md`
- `data/teacher-brief-copy.md`
- `data/sample-output.md`

