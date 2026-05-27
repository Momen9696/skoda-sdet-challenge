# Senior SDET Technical Challenge 

Task 2 :- Automation Task 

**Target:** skoda-parts.com (public site)
**Scope:** Task 2 -  Automation Task 
**Author:** Mo'men Ali

---

**Table of contents:** 
Repository layout
Quick start
Running the tests
Automation coverage strategy
Framework architecture
Design patterns & rationale
Sample automated scenarios
Search feature suite (TC1–TC6)
Environment configuration
Reporting & artifacts
CI/CD
Quality gates
Task 1 — Exploratory Analysis
Submission notes


**Repo layout:** 
Path
Purpose
docs/
Task 1 exploratory analysis report
src/
Framework core — pages, components, fixtures, config, API layer
tests/
Executable scenarios (search, cart, checkout, API smoke)
resources/test-data/
Externalized JSON for data-driven tests
.github/workflows/
CI pipeline (cross-browser matrix)
playwright.config.ts
Playwright configuration (projects, reporters, env wiring)



Quick start
Prerequisites
Node.js 20+
npm 9+
Install
npm install

npm run install:browsers

cp .env.example .env


Running the tests
Run everything
npm test
Run only the search feature suite
npx playwright test tests/search

This is the primary command for reviewing the Task 2 deliverable. It executes every search-related spec (positive, negative, data-driven, TC1–TC6).
Other useful commands
# Headed debugging (visible browser)

npm run test:headed

# Playwright UI mode (interactive runner with time travel)

npm run test:ui

# Tag filters

npm run test:smoke

npm run test:search

npm run test:checkout

# Single browser

npm run test:chromium

# Single file

npx playwright test tests/search/search.spec.ts

# Single test by title regex

npx playwright test tests/search -g "TC1"

# Last HTML report

npx playwright show-report


Automation coverage strategy
High-level scope (coverage ideas, not full manual test cases):

Search — discovery funnel

Valid OEM and generic queries return navigable catalog results
Autocomplete suggestions appear, are relevant, and are clickable
Model dropdown filter changes the search context
Nonsense and empty-input behavior (CH-01.11) — guarded with negative checks
Data-driven keyword matrix loaded from JSON fixtures
API smoke on search-partnr.php for hybrid UI + contract expansion (CH-01.02)

Cart — pre-checkout integrity

Add-to-cart from search → product detail journey (CH-03.05 friction documented)
Cart non-empty assertion and quantity update / recalculate path (CH-02.05, CH-02.14)
Per-row math validation (unitPrice × qty === sumPrice) and grand-total reconciliation

Checkout — guest conversion path

Guest reaches checkout with cart context; stops before order placement (no production orders)
Contact / delivery form visibility (P0/P1 validation gaps documented for manual follow-up)

Non-goals in this suite (candidates for next iteration)

Full payment submission, corporate VAT flows, inventory API contract tests
Performance / load validation for debouncing (CH-01.04, CH-02.09)


Framework architecture
src/

├── config/          # Environment + tag registry

├── core/            # BasePage, BaseComponent (OOP foundation)

├── locators/        # LocatorStrategy — resilient OR-based selectors

├── pages/           # Page Object Model (feature pages)

├── components/      # Composed UI widgets (header, search, cookies)

├── fixtures/        # Extended Playwright test with DI

├── helpers/         # Cookie, navigation, wait utilities

├── data/            # Typed test data + JSON loader

├── api/             # ApiClient + endpoint map (extensibility)

├── assertions/      # Custom + soft assertion helpers

├── reporting/       # Allure metadata helpers

└── utils/           # Logger, Czech text normalization

tests/

├── search/          # Positive, negative, data-driven, TC1–TC6

├── checkout/        # Cart + guest checkout

└── api/             # Contract-readiness smoke
Why Playwright + TypeScript?
Auto-waiting reduces flaky synchronization on a legacy jQuery + Luigi's Box stack.
Built-in tracing, video, and HAR accelerate triage of intermittent UI issues (e.g. cart recalculation — CH-02.02).
Native parallelization and multi-browser projects suit CI matrices without extra runners.
APIRequestContext enables a clean path to hybrid UI + API tests (search-partnr.php, cart.php) per exploratory network findings.
TypeScript-first aligns with strict typing and senior SDET maintainability expectations.


Design patterns & rationale
Pattern
Application
Why
Page Object Model
HomePage, SearchPage, ResultsPage, SearchResultsPage, ProductPage
Separates locators from test intent — DOM churn touches one class.
Component composition
SearchComponent, HeaderComponent, CookieConsentComponent
Reusable widgets composed into multiple pages.
Strategy
LocatorStrategy
Centralizes resilient OR-fallback selectors for legacy markup.
Fixture injection
test-fixtures.ts
Wires pages + ApiClient per test; keeps specs declarative.
Factory
createGuestCheckoutData()
Isolated guest data per worker — parallel-safe.
Template method
BasePage.open() / waitForReady()
Shared lifecycle across every page object.
Data-driven
JSON cases + for loops in search.data-driven.spec.ts
New cases added by editing JSON — no code changes.
Tag registry
src/config/test-tags.ts
Single source of truth for @smoke, @regression, @search, etc.

Scalability considerations
Tag-based execution (@smoke, @regression, @search, @checkout) for pipeline stages.
Environment profiles (local / ci / staging) without code changes.
API layer stub ready for contract tests when JSON schemas are defined.
Locator strategy isolates DOM churn — update one class instead of every test.
Parallel-safe tests — no shared state; unique guest emails via factory.
CI matrix — Chromium + Firefox on Ubuntu with artifact retention.


Sample automated scenarios
#
Scenario
Tags
File
1
Valid part number search returns results
@smoke @search
tests/search/search.positive.spec.ts
2
Generic search term surfaces multiple result links
@smoke @search
tests/search/search.positive.spec.ts
3
Nonsense query — no misleading results
@negative @search
tests/search/search.negative.spec.ts
4
Empty search — validation / empty state
@negative @search
tests/search/search.negative.spec.ts
5
Data-driven search matrix (JSON-fed)
@data-driven @search
tests/search/search.data-driven.spec.ts
6
Search API smoke (contract-readiness)
@api-ready
tests/api/search-api.contract.spec.ts



Search feature suite (TC1–TC6)
A dedicated locator-driven suite implementing the six search test cases extracted from exploratory testing:

ID
Title
Type
TC1
Valid search with model + term (autocomplete click)
Positive
TC2
Valid search via submit button (no suggestion click)
Positive
TC3
Autocomplete suggestions appear and are correct
Autocomplete
TC4
Model dropdown selection persists in search
Positive
TC5
Invalid search shows "no results" message
Negative
TC6
Empty search submission — documents actual behavior
Negative


Files:

Test spec → tests/search.spec.ts
Page objects → src/pages/SearchPage.ts, src/pages/ResultsPage.ts
Locators → centralized inside each page object (no hardcoded selectors in specs)

Run it:

# All search specs (TC1–TC6 + positive/negative/data-driven)

npx playwright test tests/search

# Only TC1–TC6

npx playwright test tests/search.spec.ts

# Filter by tag

npm run test:search


Environment configuration
Copy .env.example to .env and adjust:

Variable
Description
Default
BASE_URL
Application under test
https://www.skoda-dily.cz
TEST_ENV
local | ci | staging
local
BROWSER
Filter projects (chromium / firefox / webkit / all)
chromium
WORKERS
Parallel workers
4 (local), 2 (CI)
RETRIES
Test retries
0 local / 2 CI
ACTION_TIMEOUT
Per-action timeout (ms)
15000
NAVIGATION_TIMEOUT
Navigation timeout (ms)
45000
EXPECT_TIMEOUT
Assertion timeout (ms)
10000
TRACE
Playwright trace mode
on-first-retry in CI
SCREENSHOT
Screenshot policy
only-on-failure
VIDEO
Video policy
retain-on-failure
ALLURE_RESULTS_DIR
Allure raw results
allure-results
API_BASE_URL
API root for hybrid tests
mirrors BASE_URL
API_TIMEOUT
API request timeout (ms)
30000


CI sets CI=true, TEST_ENV=ci, and uploads Playwright + Allure artifacts (see .github/workflows/e2e.yml).


Reporting & artifacts
Three reporters are wired in playwright.config.ts:

List — terminal summary during local runs.
HTML — playwright-report/ (open with npx playwright show-report).
Allure — allure-results/ raw data; serve with npm run report:serve or generate static HTML with npm run report.

Artifact
Policy
Trace
on-first-retry (CI), configurable via TRACE
Screenshot
only-on-failure
Video
retain-on-failure
Allure
allure-playwright reporter



CI/CD
.github/workflows/e2e.yml runs the suite on every push and PR:

Cross-browser matrix (Chromium + Firefox on Ubuntu).
Caches npm and Playwright browsers.
Uploads playwright-report/ and allure-results/ as artifacts on failure.
Honours TEST_ENV=ci, CI=true (2 retries, 2 workers, tracing on first retry).


Quality gates
npm run typecheck      # strict TypeScript compilation

npm run lint           # ESLint (flat config)

npm run format:check   # Prettier verification

CI runs all three before executing tests — code that doesn't typecheck never reaches the runner.


Test tagging
import { Tags } from '../src/config/test-tags';

test.describe('Search Feature - Valid', { tag: [Tags.SEARCH, Tags.REGRESSION] }, () => { ... });

Run subsets:

npm run test:smoke

npx playwright test --grep @checkout

npx playwright test --grep "@search.*@regression"


It covers charters CH-01 — Search Functionality with risk-prioritized findings that fed directly into the automation coverage above.