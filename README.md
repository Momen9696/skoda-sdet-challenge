Senior SDET Technical Challenge — Submission
Target: skoda-dily.cz (public site) Author: Mo'men Ali

This repository contains both deliverables for the Senior SDET technical challenge: an exploratory analysis report and an executable Playwright + TypeScript automation suite.


What's inside
All documentation lives in the docs/ folder:

File
Task
What it contains
docs/exploratory-analysis-task.md
Task 1
Exploratory testing report — charters, observations, prioritization rationale, risk distribution, and strategic recommendations.
docs/automation-task.md
Task 2
Automation framework documentation — setup, run commands, architecture, design patterns, and sample scenarios.



Task 1 — Exploratory Analysis
See docs/exploratory-analysis-task.md.

Covers:

Charter CH-01 — Search Functionality (13 findings)
Charter CH-02 — Checkout Flow (20 findings)
CH-03 — Strategic UX & Business Recommendations (10 items)
Risk distribution, revenue exposure by area, customer journey drop-off map, and prioritization rationale.

Total: 33 defects + 10 recommendations across P0 → P3 priorities.


Task 2 — Automation task
See docs/automation-task.md.

Stack: Playwright + TypeScript, Page Object Model, fixture-based DI, tag-driven execution, Allure + HTML reporting, GitHub Actions CI matrix.

Primary command for reviewers:

npx playwright test tests/search

This runs the full search feature suite (positive, negative, data-driven, and TC1–TC6).


🚀 Quick start
# Install

npm install

npm run install:browsers

cp .env.example .env

# Run the focused search suite (Task 2 deliverable)

npx playwright test tests/search

# Or run everything

npm test

Full setup, environment variables, tag filters, reporting, and CI details are in docs/automation-task.md.


🗂️ Repository structure (top level)
.

├── docs/                        # Both task deliverables (this README points here)

│   ├── automation-task.md

│   └── exploratory-analysis-task.md

├── src/                         # Framework core (pages, components, fixtures, config)

├── tests/                       # Executable specs (search, checkout, api)

├── resources/test-data/         # JSON fixtures for data-driven tests

├── .github/workflows/           # CI pipeline (cross-browser matrix)

├── playwright.config.ts

├── package.json

└── README.md                    # ← you are here

Submission notes
Both task documents are written for review — start with whichever task you want to evaluate first.
The automation suite is executable from the terminal. Reports land in playwright-report/ (HTML) and allure-results/ (Allure raw data).
AI tools were used for scaffolding and copy assistance; all code was reviewed for production patterns and senior-SDET maintainability.