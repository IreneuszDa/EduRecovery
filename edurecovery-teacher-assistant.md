# EduRecovery Teacher Assistant

## One-Liner

EduRecovery Teacher Assistant helps educators quickly identify learning gaps caused by disrupted schooling and generate a practical 14-day recovery plan with printable exercises.

Po polsku:

> EduRecovery pomaga nauczycielom szybko wykryć luki edukacyjne po przerwach w nauce i wygenerować prosty 14-dniowy plan powrotu do materiału wraz z ćwiczeniami do druku.

## Track Fit

Track: **Digital Assistant for Educators**

Challenge:

> How can education institutions use digital tools to improve the quality of the educational process, even when educators have minimal experience with technology?

EduRecovery fits this track because the main user is the educator, not the student. The product gives teachers a guided, low-tech workflow for diagnosing learning gaps and turning them into concrete teaching actions.

## Problem

Many Ukrainian students have learning gaps caused by war, displacement, interrupted schooling, remote learning, infrastructure disruption, and changes between education systems.

Teachers and volunteer educators often face three problems:

- they do not know exactly where a student should restart,
- they do not have time to prepare individualized recovery plans,
- they may have limited confidence using digital tools or AI.

The result is that students are often asked to "catch up" broadly, without a precise starting point or realistic plan.

## Solution

EduRecovery Teacher Assistant lets an educator run a short learning recovery screening and instantly receive:

- likely learning gaps by topic,
- a recommended starting point,
- a 14-day recovery plan,
- printable first exercises,
- a teacher-ready action brief.

The student may answer the screening questions, but the product is designed around the teacher's decision-making process.

## Primary User

- school teacher,
- NGO educator,
- volunteer tutor,
- school support worker,
- education recovery coordinator.

## First MVP Scope

Subject:

- mathematics only.

Age group:

- students aged 11-14,
- roughly grade 6-7.

Languages:

- Ukrainian plus English or Polish.

Diagnostic:

- 10-question quick screening,
- 5 categories,
- 2 questions per category.

Categories:

- fractions,
- percentages,
- geometry,
- equations,
- word problems.

Important framing:

- call it a **quick screening**, not a full diagnostic,
- use confidence language such as "initial signal" or "likely gap".

## Core Demo Flow

1. Teacher opens the app.
2. Teacher selects grade, language, daily study time, and classroom constraints.
3. Teacher chooses mathematics quick screening.
4. Student answers 10 questions.
5. App calculates score by category.
6. App highlights the two weakest areas.
7. App generates a 14-day recovery plan.
8. App creates a printable Teacher Recovery Brief.

## Teacher Controls

The teacher should be able to choose:

- student age or grade,
- language,
- daily available study time,
- normal or disrupted learning mode,
- individual or small-group support,
- low-tech mode if internet, projector, or devices are limited.

## Output: Teacher Recovery Brief

The report should include:

- student profile,
- overall screening result,
- strongest and weakest categories,
- likely learning gaps,
- recommended restart point,
- 14-day recovery plan,
- first exercises to print,
- teacher recommendations,
- optional parent summary.

## Ukraine-Relevant Differentiators

EduRecovery should explicitly support:

- disrupted schooling,
- mixed-level classrooms,
- students moving between countries or school systems,
- low-bandwidth or print-first teaching,
- Ukrainian-language support,
- teachers and volunteers with limited technical confidence.

## Why This Is Better Than A Student App

A student-facing quiz app could be useful, but it is weaker for this hackathon track.

The track asks for digital tools that improve education quality through educators. A teacher-facing assistant has stronger alignment because it helps the educator make better instructional decisions quickly.

The student still participates, but the value is delivered to the educator:

- what gap exists,
- where to restart,
- what to teach next,
- what to print,
- how to explain the recovery path.

## MVP Feature List

Must-have:

- teacher-first landing screen,
- guided setup form,
- 10-question math screening,
- scoring by category,
- gap summary,
- 14-day recovery plan,
- printable Teacher Recovery Brief,
- basic language toggle.

High-impact if time allows:

- low-tech mode,
- mixed-level recommendation,
- confidence labels,
- print-friendly worksheet,
- class grouping suggestion for multiple students,
- AI-generated teacher explanation based on deterministic score.

Avoid in MVP:

- accounts,
- student database,
- full admin dashboard,
- mobile app,
- payment,
- full AI tutor,
- many subjects,
- advanced analytics.

## Suggested Tech Stack

- Vite or Next.js with React,
- static question bank in JSON or TypeScript,
- deterministic scoring logic,
- rule-based plan templates,
- optional AI call for narrative explanation,
- browser print view for report export,
- deploy on Vercel, Netlify, or similar.

## Pitch Narrative

Problem:

> In disrupted education contexts, teachers often know that students are behind, but not exactly where. Recovery starts with knowing where to restart.

Solution:

> EduRecovery gives educators a no-training workflow: run a short screening, identify likely learning gaps, and receive a practical recovery plan and printable materials.

Impact:

> It saves teacher preparation time, supports students affected by interrupted learning, and gives schools or NGOs a simple tool they can pilot immediately.

Closing line:

> Rebuilding Ukraine starts with rebuilding children's access to learning. EduRecovery helps every teacher know where each student should restart.

## Success Criteria For Hackathon Demo

The demo should prove that:

- a teacher can use the app without training,
- the screening identifies specific learning gaps,
- the output is practical, not generic,
- the plan can be printed or used immediately,
- the product is realistic for Ukrainian education recovery contexts.

