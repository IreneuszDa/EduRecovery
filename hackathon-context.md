# Day One Ukraine Hackathon Context

## Core Challenge

Track: **Digital Assistant for Educators**

Challenge question:

> How can education institutions use digital tools to improve the quality of the educational process, even when educators have minimal experience with technology?

The MVP should help educators or education institutions improve teaching quality with a tool that is simple enough for low-tech users and realistic to deploy in Ukraine and the broader resilience region.

## Event Snapshot

- **Event:** Day One Ukraine Hackathon
- **Dates:** June 22-23, 2026
- **Format:** 48-hour hackathon
- **Location:** Warsaw, Poland
- **Organizers:** Econverse Foundation with the Centre for International Relations (CSM)
- **Website:** http://www.dayoneukraine.com
- **Context:** Takes place directly before the Ukraine Recovery Conference
- **Participants:** Around 150 students and interdisciplinary builders from Europe, especially the Baltic Sea region and Ukraine

## Mission

Build a proof-of-concept that can become a build-ready solution supporting Ukraine's long-term recovery and resilience.

The strongest direction is not a broad "AI for education" concept. The goal should be a sharp MVP that solves one painful workflow for educators with limited technical confidence.

## Evaluation Criteria

1. **Technology Fit**
   - The stack should match the problem and the users' real constraints.
   - Offline or low-bandwidth behavior may be important.
   - The interface should reduce cognitive load, not add another platform teachers must learn.

2. **Problem Solving**
   - The MVP should directly improve the educational process.
   - It should address a specific bottleneck: lesson preparation, assessment, adaptation, feedback, inclusion, recovery learning, or administration.

3. **Feasibility and Deployment**
   - The solution should be buildable within the hackathon.
   - It should be realistic for schools, NGOs, ministries, or training programs to pilot.
   - Low setup cost and easy onboarding matter.

4. **Innovation**
   - The fresh angle should come from workflow design and context sensitivity, not from using AI generically.
   - A strong idea can combine simple tools in a way that fits emergency, displaced, or under-resourced education.

5. **Relevance for Ukraine and the Wider Resilience Region**
   - The solution should account for interrupted schooling, displaced learners, teacher shortages, trauma-aware teaching, mixed-language classrooms, infrastructure disruption, and uneven access to devices or connectivity.

## User Reality Assumptions

- Many educators may have minimal experience with technology.
- Teachers are time-constrained and may be overloaded.
- Schools may face unstable internet, limited devices, and frequent disruption.
- Students may have learning gaps, trauma exposure, displacement history, or mixed language needs.
- Administrators and NGOs need simple evidence that a tool improves outcomes before scaling it.

## Product Principles

- Start from one teacher workflow.
- Make the first useful result happen in under five minutes.
- Prefer guided input over blank prompts.
- Use plain language and low-friction UI.
- Support Ukrainian context explicitly.
- Make outputs editable, printable, and shareable.
- Design for low bandwidth and partial offline use where possible.
- Keep the human educator in control.

## Strong MVP Directions

### 1. Lesson Rescue Assistant

A teacher uploads or types a rough topic, grade, duration, and classroom constraints. The assistant produces a ready-to-teach lesson plan with:

- learning objectives
- simple activity sequence
- blackboard or printable version
- low-tech alternative if internet or projector is unavailable
- adaptation for mixed learning levels
- short assessment questions

Why it fits:

- Very direct value for low-tech educators.
- Easy to demo.
- Strong Ukraine relevance if it includes disrupted-classroom and low-resource modes.

### 2. Learning Gap Quick Diagnostic

A teacher selects subject, grade, and topic. The tool generates a short diagnostic quiz, helps interpret results, and recommends three remediation groups:

- ready to move forward
- needs practice
- needs foundational recovery

Why it fits:

- Addresses interrupted schooling.
- Demonstrates measurable improvement.
- Can be piloted without deep integration.

### 3. Trauma-Aware Classroom Copilot

A lightweight assistant that converts normal lesson activities into trauma-aware versions:

- calmer instructions
- predictable routines
- optional reflection prompts
- conflict-sensitive language
- escalation guidance for non-specialists

Why it fits:

- Highly relevant to Ukraine.
- Innovative if positioned carefully as teacher support, not therapy.
- Needs careful safety framing.

### 4. Multilingual Classroom Bridge

A teacher enters a lesson or handout. The tool produces simplified Ukrainian, English, and optionally Polish versions, plus vocabulary scaffolding and teacher notes.

Why it fits:

- Relevant for displaced learners and host-country classrooms.
- Clear demo.
- Feasible as a narrow document transformation workflow.

### 5. No-Prompt AI Teaching Kiosk

Instead of a chat interface, teachers use large guided buttons:

- Plan a lesson
- Make a quiz
- Simplify this text
- Adapt for younger students
- Create homework
- Translate and explain

Why it fits:

- Directly answers the "minimal experience with technology" part.
- Innovation is in removing prompt-writing as a barrier.
- Can wrap several narrow workflows while still feeling simple.

## Recommended Direction

The strongest hackathon bet is **Lesson Rescue Assistant** with a **No-Prompt AI Teaching Kiosk** interface.

Positioning:

> A low-tech digital assistant that helps Ukrainian educators turn any topic into a ready-to-teach, disruption-resilient lesson in under five minutes.

Core demo flow:

1. Teacher chooses subject, grade, duration, and topic.
2. Teacher selects constraints: no projector, mixed levels, limited internet, displaced learners, short class.
3. Tool generates a practical lesson plan.
4. Teacher clicks "make printable", "make quiz", or "simplify for struggling students".
5. Tool exports a clean handout or copyable plan.

MVP scope:

- One polished workflow: lesson plan generation.
- Two extensions: printable handout and quick quiz.
- One contextual differentiator: low-resource and disrupted-classroom adaptation.

## Possible Tech Stack

- **Frontend:** Next.js or Vite + React
- **UI:** Simple kiosk-style guided form, large buttons, minimal text entry
- **AI layer:** OpenAI API or local mock layer for demo resilience
- **Data:** Static curriculum examples and prompt templates
- **Export:** HTML print view or PDF generation
- **Deployment:** Vercel, Netlify, or local demo

## Demo Narrative

Problem:

Teachers in disrupted or under-resourced education settings often need to prepare effective lessons quickly, but many digital tools assume confidence with technology, stable internet, and time to write complex prompts.

Solution:

Our assistant removes the blank prompt. It asks a few familiar teaching questions, then creates a lesson plan, backup low-tech activity, printable student handout, and quick assessment.

Why now:

Ukraine's recovery requires scalable support for educators dealing with interrupted learning, mixed levels, and infrastructure constraints.

Why this MVP:

It is narrow, usable, and deployable. Schools can pilot it with one subject or grade before scaling.

## Open Questions

- Which grade and subject should the first demo support?
- Should the main interface be in Ukrainian, English, Polish, or bilingual?
- Should we optimize for teachers, school administrators, NGOs, or ministry-level pilot buyers?
- Do we want AI generation live in the demo, or a hybrid with deterministic templates for reliability?
- What evidence of impact can we show in the pitch: time saved, lesson completeness, accessibility, or recovery-learning support?
