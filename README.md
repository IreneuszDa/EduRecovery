# EduRecovery UA

Teacher-first recovery assistant for disrupted Ukrainian learning contexts. Built for the **Day One Ukraine Hackathon**.

## Overview

EduRecovery UA is a lightweight, low-tech digital assistant that helps Ukrainian educators identify learning gaps and generate practical recovery plans in under five minutes. Designed specifically for disrupted and under-resourced education settings, it removes the complexity of traditional AI tools by offering a guided, no-prompt interface. 

The MVP focuses on one critical workflow: **Learning Gap Diagnostic & Lesson Recovery**. It is built to directly improve the quality of the educational process, even when educators have minimal experience with technology.

## Hackathon Context & Impact

Our solution directly addresses the hackathon's core evaluation criteria:

- **Problem Solving & Ukraine Relevance:** Schools face unstable internet, frequent disruption, and students with learning gaps. EduRecovery provides immediate, measurable remediation by identifying math gaps and generating a 14-day recovery plan tailored for disrupted classrooms.
- **Technology Fit:** The interface reduces cognitive load. No complex prompt engineering is required. It's designed to be low-friction, bilingual (English and Ukrainian), and accessible.
- **Feasibility & Deployment:** Requires no login for teacher and student role switching. It's built as a simple Next.js application that can be easily piloted in schools without deep IT integration.
- **Innovation:** The innovation lies in workflow design and context sensitivity. We've prioritized a "print-first" and low-tech classroom support model, ensuring teachers can export a clean, printable Teacher Recovery Brief if the internet or projector is unavailable.

## Features

- **Teacher & Student Roles:** Instant switching without complex authentication.
- **Bilingual Interface:** Full support for English and Ukrainian.
- **Quick Diagnostic:** 10-question math screening to rapidly assess student levels.
- **Automated Scoring:** Deterministic scoring to identify likely learning gaps.
- **Actionable Recovery:** Generates a structured 14-day recovery plan.
- **Print-First Support:** Exportable Teacher Recovery Briefs for offline classroom use.

## Development Setup

The application is built using Next.js and React.

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

```bash
npm run build
npm run start
```
