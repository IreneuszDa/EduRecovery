# Prompt For New Conversation: Data Preparation

We are building a hackathon MVP called **EduRecovery Teacher Assistant** for the Day One Ukraine hackathon track **Digital Assistant for Educators**.

The product is a teacher-first digital assistant, not a generic student quiz app. It helps educators quickly identify likely learning gaps caused by disrupted schooling and generate a practical 14-day recovery plan with printable exercises.

Please read and follow this context:

- `/Users/j/vibe/dayone/AGENTS.md`
- `/Users/j/vibe/dayone/docs/product-brief.md`
- `/Users/j/vibe/dayone/docs/data-preparation-brief.md`
- `/Users/j/vibe/dayone/docs/demo-scenario.md`
- `/Users/j/vibe/dayone/edurecovery-teacher-assistant.md`
- `/Users/j/vibe/dayone/idea-review-edurecovery.md`
- `/Users/j/vibe/dayone/hackathon-context.md`

Your task in this conversation is to prepare the MVP educational data.

Create a structured data pack in Markdown under `/Users/j/vibe/dayone/data/` with these files:

1. `questions.md`
   - 10 math quick-screening questions for students aged 11-14, roughly grade 6-7.
   - exactly 5 categories:
     - fractions
     - percentages
     - geometry
     - equations
     - word problems
   - exactly 2 questions per category.
   - each question must include:
     - ID,
     - category,
     - difficulty,
     - question text,
     - 4 answer options,
     - correct answer,
     - short explanation,
     - teacher note about what a wrong answer may indicate.

2. `scoring-rules.md`
   - deterministic scoring rules,
   - category scores,
   - weakest-category detection,
   - tie-breaking,
   - confidence labels,
   - wording that avoids overclaiming assessment validity.

3. `recovery-blocks.md`
   - remediation blocks for each category,
   - learning goals,
   - teacher explanation,
   - activities,
   - low-tech adaptation,
   - printable exercises,
   - mini-check question.

4. `plan-template.md`
   - 14-day recovery plan logic using the two weakest categories,
   - day-by-day structure,
   - teacher action,
   - student task,
   - estimated time.

5. `teacher-brief-copy.md`
   - reusable report copy for the Teacher Recovery Brief,
   - student summary,
   - screening result explanation,
   - likely gap wording,
   - recommended restart point,
   - teacher recommendations,
   - parent summary,
   - quick-screening disclaimer.

6. `sample-output.md`
   - one complete sample result for the demo scenario:
     - 12-year-old grade 6 student,
     - likely gaps: percentages and word problems,
     - stronger areas: fractions, geometry, equations,
     - 14-day plan,
     - printable teacher brief.

Constraints:

- Keep the content teacher-first.
- Use plain English for the first version.
- Keep wording easy to translate into Ukrainian or Polish later.
- Do not claim this is a full diagnostic assessment.
- Use "quick screening", "likely gap", "restart point", and "recovery plan".
- Make the data practical enough for implementation in a React/Vite MVP.

After creating the files, summarize:

- what data was created,
- any assumptions made,
- what a developer should implement next.

