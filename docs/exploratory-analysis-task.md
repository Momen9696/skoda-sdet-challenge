# Senior SDET Technical Challenge 

Task 1 :- Exploratory Analysis Report

**Target:** skoda-parts.com (public site)
**Scope:** Task 1 — Exploratory testing (Search & Checkout)
**Author:** Mo'men Ali

---

## Documentation Sections

1. **Introduction** — context and intent of this document.
2. **Scope (Features)** — features explored and rationale.
3. **Results** — findings per feature, ordered highest to lowest priority.
   - **3.A)** CH-01 — Search Functionality
   - **3.B)** CH-02 — Checkout Flow
4. **Exploratory UX & Business Recommendations** — CH-03, quality-perspective improvements beyond defects.
5. **Summary** — risk distribution, revenue exposure, journey drop-off map, prioritization rationale, and closing notes.

---

## 1. Introduction

This document is the deliverable for **Task 1** of the Senior SDET Technical Challenge: a time-boxed exploratory evaluation of the public skoda-parts.com website. The session covered functional, UX, performance, security, and data-integrity dimensions across two business-critical user journeys.

**Priority scale (used throughout):**

- **P0 (Critical)** — Production-blocking; data loss, security breach, or unfulfillable orders.
- **P1 (High Impact)** — Broken business logic, financial/data integrity, security gaps, or strategic conversion blockers.
- **P2 (Medium Impact)** — UX degradation, performance, or consistency issues.
- **P3 (Low Impact)** — Polish, minor validation, or edge-case UX.

---

## 2. Scope (Features)

Two features were selected as required by the challenge.

### Charter CH-01 — Search Functionality

- **Goal:** Explore the search experience end-to-end across input modes, filters, and result handling.
- **Why included:** Search is the entry point into the catalog — defects here block discovery and degrade every downstream flow.

### Charter CH-02 — Checkout Flow

- **Goal:** Explore the full purchase journey, including cart state, recalculation, address forms, and order placement.
- **Why included:** Checkout is the revenue-critical path — defects here directly affect conversion, fulfillment, and trust.

---

## 3. Results

---

### 3.A) CH-01 — Search Functionality

---

**CH-01.01 — Search Functionality** · **P1 (High Impact)** · *Input Handling / Security Consistency*

**Observation**
The system behaves differently between live filtering and explicit search execution when SQL-like input patterns are injected. Auto-filtering returns no results, while executing the search via the search button returns results.

**Risks**
1. Inconsistent input handling across search flows.
2. Potential validation gaps between endpoints (security-adjacent).
3. Unpredictable search behavior in edge cases.

---

**CH-01.02 — Search Functionality** · **P1 (High Impact)** · *Architecture / System Design*

**Observation**
`search-partnr.php` returns an HTML response instead of a structured JSON API.

**Risks**
1. Limits scalability and headless consumption.
2. Reduces reusability across web/mobile/API clients.
3. Couples backend rendering tightly to a single client.

---

**CH-01.03 — Search Functionality** · **P1 (High Impact)** · *Data / Analytics Integrity*

**Observation**
The Luigisbox analytics endpoint returns an invalid JSON error when the `actions` payload is empty.

**Risks**
1. Breaks the analytics pipeline.
2. Loss of user-behavior tracking.
3. Incorrect business insights derived from search analytics.

---

**CH-01.04 — Search Functionality** · **P2 (Medium Impact)** · *Performance / Scalability*

**Observation**
Search triggers API requests on every keystroke without a visible debouncing mechanism.

**Risks**
1. Excessive backend load.
2. Performance degradation under high traffic.

---

**CH-01.05 — Search Functionality** · **P2 (Medium Impact)** · *Performance / Payload Optimization*

**Observation**
The search API response returns a large payload without visible filtering or projection.

**Risks**
1. Negative network performance impact.
2. Increased latency for end users.

---

**CH-01.06 — Search Functionality** · **P2 (Medium Impact)** · *Search Logic / UX Consistency*

**Observation**
Both free-text query and dropdown selection are applied in the same request, but results are primarily driven by free-text input.

**Risks**
1. Non-intuitive search behavior.
2. Reduced search precision.
3. Lower user trust and conversion efficiency.

---

**CH-01.07 — Search Functionality** · **P2 (Medium Impact)** · *Relevance / UX Impact*

**Observation**
Filtered items do not always reflect the selected value in the item title and may appear only in secondary attributes.

**Risks**
1. Reduced perceived search relevance.
2. User confusion when expecting direct matches.
3. Erosion of trust in filtering accuracy.

---

**CH-01.08 — Search Functionality** · **P2 (Medium Impact)** · *Tracking Integrity*

**Observation**
A static `tracker_id` value is present in network requests.

**Risks**
1. Inaccurate session tracking.
2. Unreliable analytics data.

---

**CH-01.09 — Search Functionality** · **P2 (Medium Impact)** · *Performance / Abuse Protection*

**Observation**
The filtering endpoint does not enforce visible rate limiting under rapid requests.

**Risks**
1. Backend exposure to excessive load.
2. Abuse potential via automation.
3. Performance degradation during traffic spikes.

---

**CH-01.10 — Search Functionality** · **P2 (Medium Impact)** · *Performance / Input Validation Strategy*

**Observation**
`ajax/email-check.php` is invoked on every keystroke, returning a binary response (`{"found": 0/1}`) without debouncing or incremental validation value. *(Same root cause as CH-02.15 — track as a single defect with two reproduction paths.)*

**Risks**
1. Excessive backend requests if no debouncing is applied.
2. Unnecessary server load during fast typing.
3. Inefficient validation strategy — no incremental value per call.

---

**CH-01.11 — Search Functionality** · **P3 (Low Impact)** · *UX / Validation*

**Observation**
Search can be triggered with no input value via the search button.

**Risks**
1. Unnecessary backend requests.
2. Irrelevant result sets returned.
3. Missing input validation.

---

**CH-01.12 — Search Functionality** · **P3 (Low Impact)** · *Input Validation*

**Observation**
The input field does not enforce a visible maximum character length restriction.

**Risks**
1. Unnecessary backend load on oversized inputs.
2. Abuse and edge-case risks.
3. Possible UI responsiveness impact.

---

**CH-01.13 — Search Functionality** · **P3 (Low Impact)** · *UX / State Management*

**Observation**
The filter dropdown does not reset after page refresh and retains its previous state.

**Risks**
1. User confusion about active filters.
2. Misleading UI state persistence.
3. Reduced usability in new sessions.

---

### 3.B) CH-02 — Checkout Flow

---

**CH-02.01 — Checkout Flow** · **P0 (Critical)** · *Checkout Validation / Order Integrity*

**Observation**
When "Deliver to a different address" is selected and all mandatory address fields are left empty, the system still allows the order to be placed successfully without triggering validation errors. The same required-field rules enforced during address entry are not enforced at order submission.

**Risks**
1. Orders created with incomplete or missing delivery information.
2. Failed deliveries and fulfillment issues.
3. Missing or broken server-side validation of mandatory checkout fields.

---

**CH-02.02 — Checkout Flow** · **P1 (High Impact)** · *Data Integrity / API Contract / Financial Accuracy*

**Observation**
Clicking "Recalculate Cart" triggers multiple API calls (`cartlist.php`, `cart.php`) returning similar or duplicated cart state. A third response variant uses a different schema. Monetary values are returned in scientific notation (e.g. `9.2325144e+18`) with inconsistent formatting across responses.

**Risks**
1. Inconsistent system behavior caused by multiple overlapping endpoints.
2. Data-integrity issues from schema drift across responses.
3. Precision loss in monetary values — potential miscalculations.
4. Increased frontend complexity and UI rendering errors.

---

**CH-02.03 — Checkout Flow** · **P1 (High Impact)** · *Financial Calculation Integrity*

**Observation**
Rounding is applied during the actual total-price calculation, not only at the UI display layer. The system uses rounded values as inputs to aggregation, affecting precision of final totals.

**Risks**
1. Cumulative pricing inaccuracies across multi-item carts.
2. Discrepancies between expected and system-calculated totals.
3. Likely missing fixed-decimal / money-type handling at the backend.

---

**CH-02.04 — Checkout Flow** · **P1 (High Impact)** · *Data Integrity / Inventory Accuracy*

**Observation**
The "In Stock" flag is always set to `true` regardless of the requested item quantity. Even unrealistic quantities (e.g. 9,999,999) leave the item marked in stock without validation against inventory.

**Risks**
1. Misleading stock availability shown to users.
2. Incorrect purchase expectations → fulfillment failures.
3. Missing backend validation or broken stock-state synchronization.

---

**CH-02.05 — Checkout Flow** · **P1 (High Impact)** · *Business Logic / Cart Integrity*

**Observation**
A maximum quantity of 999 is enforced **per add-to-cart action only**. The user can repeatedly add the same item to bypass the limit; no cumulative cap exists, and aggregate quantity is not surfaced until checkout.

**Risks**
1. Users can exceed intended purchase limits via repeated actions.
2. Unexpected behavior at checkout when large aggregated quantities reach the backend.
3. Missing global cart-level validation — inconsistent rule enforcement.

---

**CH-02.06 — Checkout Flow** · **P1 (High Impact)** · *Validation Consistency*

**Observation**
The checkout screen does not enforce or display quantity validation, even though the Add-to-Cart flow does. Validation rules differ between stages of the purchase journey.

**Risks**
1. Inconsistent rule enforcement across the flow.
2. Invalid or excessive quantities reach checkout silently.
3. User-trust erosion due to unpredictable validation behavior.

---

**CH-02.07 — Checkout Flow** · **P1 (High Impact)** · *Checkout Flow / Business Rule Enforcement*

**Observation**
The user can advance from cart to the delivery and payment step even when the cart is in an invalid state (e.g. quantity > 999). No pre-checkout validation gate exists.

**Risks**
1. Invalid states propagate to payment and order-creation stages.
2. Order-processing failures after payment submission.
3. Missing validation gate between cart and checkout transitions.

---

**CH-02.08 — Checkout Flow** · **P1 (High Impact)** · *Input Validation / Data Integrity*

**Observation**
The phone-number input accepts non-numeric characters (letters, symbols) without any input-level validation or restriction.

**Risks**
1. Malformed phone numbers submitted to the backend.
2. Backend validation failures or extra sanitization required.
3. Failed delivery contact and order confirmation issues.

---

**CH-02.09 — Checkout Flow** · **P1 (High Impact)** · *Performance / API Optimization / State Management*

**Observation**
`ajax/order_summary.php` is triggered on every field interaction (focus and blur), refetching the full cart even when no state has changed.

**Risks**
1. Excessive backend load from non-mutating UI events.
2. Performance degradation under realistic interaction patterns.
3. Missing event optimization and state-diff control.

---

**CH-02.10 — Checkout Flow** · **P1 (High Impact)** · *Form State Management / Address Integrity*

**Observation**
The user can change the selected city or country **after** filling street/address details, but the previously submitted address data is still sent in the request — producing an inconsistent address payload.

**Risks**
1. Incorrect or outdated shipping address submitted.
2. Possible delivery failures or misrouted orders.
3. Missing dependency handling between location fields and address-form state.
4. Stale data persisted in the checkout process.

---

**CH-02.11 — Checkout Flow** · **P1 (High Impact)** · *Form State Management / Business Logic*

**Observation**
Selecting the "Corporate" delivery type still opens the personal-information form. The form structure does not switch based on the selected delivery type.

**Risks**
1. Incorrect data collected for corporate users.
2. Mismatch between selected delivery type and captured details.
3. Incomplete or invalid corporate-order processing.

---

**CH-02.12 — Checkout Flow** · **P1 (High Impact)** · *Form Validation / Business Rules*

**Observation**
Submitting an empty Corporate form triggers personal-form validation. Corporate-specific required fields (VAT number, Company ID) are not validated and not surfaced in error messages.

**Risks**
1. Invalid corporate orders accepted without required business information.
2. Incomplete invoice data → tax and compliance issues.
3. Incorrect mapping between customer type and validation rules.

---

**CH-02.13 — Checkout Flow** · **P1 (High Impact)** · *Checkout Flow / Form Dependency Integrity*

**Observation**
Users with prior orders are blocked when selecting "new order" with the same email. Additionally, the mandatory "Method of transport" field fails to render after country selection, breaking the form dependency chain.

**Risks**
1. Valid users prevented from creating new orders.
2. Incomplete checkout flows due to mandatory fields not rendered.
3. Broken conditional logic between country selection and dependent sections.

---

**CH-02.14 — Checkout Flow** · **P2 (Medium Impact)** · *UX Feedback / Business Rule Clarity*

**Observation**
Clicking "Recalculate Cart" displays a max-quantity (999) warning for ~1 second, yet the system still proceeds to recalculate and update totals.

**Risks**
1. User confusion from very brief feedback visibility.
2. Ambiguity between "warning" and "enforced limit".
3. Weak validation enforcement signal.

---

**CH-02.15 — Checkout Flow** · **P2 (Medium Impact)** · *Performance / Input Validation Strategy*

**Observation**
`ajax/email-check.php` is triggered on every keystroke while typing an email, returning a static response (`{"found": 0}`) with no incremental validation value. *(Same root cause as CH-01.10 — track jointly.)*

**Risks**
1. Excessive backend requests due to per-character validation.
2. Unnecessary load without incremental value.
3. Missing debouncing and inefficient validation strategy.

---

**CH-02.16 — Checkout Flow** · **P2 (Medium Impact)** · *UX / Conversion Focus*

**Observation**
The checkout screen still displays global navigation options (search, cart icon) even though the user is inside the checkout flow.

**Risks**
1. Distraction during a critical conversion flow.
2. Increased risk of accidental navigation away → cart abandonment.
3. Reduced focus on completing the purchase.

---

**CH-02.17 — Checkout Flow** · **P2 (Medium Impact)** · *UI Consistency / Financial Presentation*

**Observation**
After "Recalculate Cart", monetary values shift from a compact inline format to a multi-line layout where currency labels (e.g. "Kč s DPH", "Kč bez DPH") are separated from the numeric values.

**Risks**
1. Reduced readability of pricing information.
2. Confusion from inconsistent formatting of critical financial data.
3. Trust erosion if prices appear visually unstable after recalculation.

---

**CH-02.18 — Checkout Flow** · **P2 (Medium Impact)** · *Navigation / User Journey*

**Observation**
Clicking "Back" on the empty cart screen returns the user to the previous browsing step instead of a meaningful entry point such as the home page or product listing.

**Risks**
1. Poor UX returning users to irrelevant or empty states.
2. Lost conversion opportunities — no path back to product discovery.
3. Inconsistent navigation expectations within the cart journey.

---

**CH-02.19 — Checkout Flow** · **P2 (Medium Impact)** · *Form State Management / UX*

**Observation**
After a validation error, refreshing the page does not clear input fields. The form retains its previous (invalid) state instead of resetting.

**Risks**
1. User confusion from persistent invalid form state.
2. Repeated submission attempts with the same invalid data.
3. Missing state-reset handling on reload / error recovery.

---

**CH-02.20 — Checkout Flow** · **P3 (Low Impact)** · *Input Validation / Abuse Prevention*

**Observation**
The coupon-code input does not enforce a visible maximum character length, allowing excessively long values.

**Risks**
1. Unnecessary or malicious input submitted.
2. Increased backend processing overhead if not server-side validated.
3. Missing input constraints → inconsistent user experience.

---

## 4. Exploratory UX & Business Recommendations (CH-03)

Recommendations are strategic improvements beyond defects — quality, UX, and business-impact opportunities surfaced during exploration. Each entry includes a structured Observation, Recommendation, and Business Impact block for executive review ( These findings are non-defect product-quality observations that may influence conversion, UX efficiency, and business scalability. ).

---

**CH-03.01 — Recommendation** · **P1 (High Impact)** · *UX / Search Relevance*

**Observation**
Search results are heavily dependent on free-text input, even when filters are selected.

**Recommendation**
- Align filter logic so structured filters take priority over free-text when applied.
- Improve result predictability for better user control.
- Enhance trust in filtering system behavior.

**Business Impact**
- Reduces user effort and improves discoverability.
- Strengthens conversion at the top of the funnel.
- Increases trust in search as a reliable navigation tool.

---

**CH-03.02 — Recommendation** · **P1 (High Impact)** · *Performance / System Optimization*

**Observation**
Cart recalculation triggers multiple redundant API calls.

**Recommendation**
- Introduce event batching or state-based recalculation.
- Reduce API dependency duplication.
- Improve system efficiency and reduce performance cost.

**Business Impact**
- Lowers infrastructure cost at scale.
- Improves cart responsiveness during peak load.
- Reduces backend exposure to redundant traffic.

---

**CH-03.03 — Recommendation** · **P1 (High Impact)** · *UX / Business Logic Consistency*

**Observation**
Form behavior differs between personal and corporate delivery modes.

**Recommendation**
- Implement strict form-schema switching based on customer type.
- Separate validation rules per business context.
- Prevent mixed-state form rendering.

**Business Impact**
- Improves data quality for B2B orders.
- Reduces invoice/tax/compliance errors.
- Strengthens trust with corporate customers.

---

**CH-03.04 — Recommendation** · **P1 (High Impact)** · *Accessibility / Market Reach / Conversion*

**Observation**
The system is available only in Czech, with no support for English or other widely used languages.

**Recommendation**
- Introduce multilingual support starting with English as the primary global fallback.
- Prioritize language coverage based on global user adoption.
- Ensure critical flows (search, cart, checkout) are fully usable in English.

**Business Impact**
- Significantly reduces conversion for non-Czech speaking users.
- Creates a high entry barrier for international customers.
- Limits market scalability and global expansion potential.
- Increases drop-off during first interaction.

---

**CH-03.05 — Recommendation** · **P1 (High Impact)** · *Conversion Optimization / Funnel Efficiency*

**Observation**
The current "Add to Cart" flow requires the user to enter the product details page before being able to add an item to the cart.

**Recommendation**
- Introduce a direct "Add to Cart" action from listing/search/recommendation surfaces.
- Keep the product details page as an optional step, not mandatory.
- Allow instant add from browsing surfaces.

**Business Impact**
- Reduces friction in the purchase journey.
- Increases conversion via a shorter funnel.
- Improves impulse purchase behavior.
- Enhances UX efficiency for returning users.

---

**CH-03.06 — Recommendation** · **P1 (High Impact)** · *Security / Abuse Prevention / Order Integrity*

**Observation**
The system allows users to complete orders without authentication, relying only on email and phone for identification, with no verification or anti-abuse controls.

**Recommendation**
- Introduce lightweight verification mechanisms for guest checkout.
- Add rate limiting / abuse detection for repeated order attempts.
- Implement basic fraud/spam prevention rules.
- Maintain guest-checkout flexibility with controlled safeguards.

**Business Impact**
- Reduces risk of spam or fake orders.
- Mitigates abuse exposure on the checkout system.
- Lowers operational cost from invalid orders.
- Strengthens traceability and accountability.

---

**CH-03.07 — Recommendation** · **P1 (High Impact)** · *Responsive Design / Mobile UX*

**Observation**
The UI exhibits layout and rendering issues when changing screen orientation (portrait ↔ landscape), indicating the frontend is not fully responsive or does not handle orientation changes properly.

**Recommendation**
- Improve responsive-design handling for orientation changes.
- Ensure layout reflow is triggered on viewport resize and orientation events.
- Validate UI components across breakpoints and device orientations.
- Consider adaptive layouts for critical screens.

**Business Impact**
- Improves mobile user experience.
- Eliminates layout glitches and overlap.
- Recovers mobile conversion at risk from display defects.
- Strengthens perceived product quality.

---

**CH-03.08 — Recommendation** · **P2 (Medium Impact)** · *UX / Conversion Optimization*

**Observation**
Users do not have access to a "Recently Viewed Items" or previously interacted products section during their shopping journey.

**Recommendation**
- Introduce a "Recently Viewed Items" section on listings/homepage.
- Persist lightweight browsing history.
- Enable users to continue shopping without repeating search.

**Business Impact**
- Reduces effort in rediscovery.
- Increases conversion for previously viewed items.
- Improves session engagement.
- Enhances shopping efficiency for returning visitors.

---

**CH-03.09 — Recommendation** · **P2 (Medium Impact)** · *UX / Visual Clarity*

**Observation**
The login input field uses a black-colored placeholder, visually resembling actual user input rather than a muted placeholder style.

**Recommendation**
- Use a lighter muted color for placeholder text.
- Ensure clear distinction between placeholder and user input.
- Follow standard input-hierarchy patterns.

**Business Impact**
- Reduces user confusion during form interaction.
- Improves UI clarity and form completion rate.
- Eliminates input hesitation caused by visual ambiguity.

---

**CH-03.10 — Recommendation** · **P2 (Medium Impact)** · *Conversion Optimization*

**Observation**
Checkout flow still exposes unnecessary navigation elements (search/cart).

**Recommendation**
- Introduce a focused checkout mode.
- Reduce navigation distractions.
- Improve conversion via flow isolation.

**Business Impact**
- Reduces accidental cart abandonment.
- Increases checkout completion rate.
- Strengthens focus on conversion-critical actions.

---

## 5. Summary

### 5.A) Overall Risk Distribution

**Defects (CH-01 + CH-02)**

| Priority | Count | Definition |
|---|---|---|
| **P0 (Critical)** | 1 | Production-blocking; data loss, security breach, or unfulfillable orders. |
| **P1 (High Impact)** | 15 | Broken business logic, financial/data integrity, security gaps. |
| **P2 (Medium Impact)** | 13 | UX degradation, performance, or consistency issues. |
| **P3 (Low Impact)** | 4 | Polish, minor validation, or edge-case UX. |
| **Total Defects** | **33** | Search: 13 · Checkout: 20 |

**Recommendations (CH-03)**

| Priority | Count | Definition |
|---|---|---|
| **P1 (High Impact)** | 7 | Strategic improvements with direct conversion, security, or market-reach impact. |
| **P2 (Medium Impact)** | 3 | UX and clarity improvements that enhance trust and efficiency. |
| **Total Recommendations** | **10** | UX, conversion, market reach, and security uplift opportunities. |

**Grand total: 43 items** (33 defects + 10 recommendations).

> A companion HTML visualization (`skoda-parts-summary-visualization.html`) presents the data in 5.A, 5.B, and 5.C as an executive-ready indicator dashboard.

---

### 5.B) Revenue Risk Exposure by Area

Each finding area exposes the business to a different category of revenue risk. The table below summarizes that exposure qualitatively; quantification requires actual traffic, conversion, and order-value data from production analytics.

| Area | Revenue Risk Type | Exposure Severity | Representative Findings |
|---|---|---|---|
| **Checkout (CH-02)** | **Direct** — orders fail, are invalid, or carry incorrect totals | **Critical** | CH-02.01 (invalid orders submitted), CH-02.02 / .03 (price precision loss), CH-02.04 (false stock), CH-02.13 (broken form gates) |
| **Search (CH-01)** | **Indirect** — discovery friction reduces top-of-funnel conversion | **High** | CH-01.01 (input inconsistency), CH-01.06 / .07 (filter unreliability), CH-01.03 (analytics loss → poor decisions) |
| **Recommendations (CH-03)** | **Strategic** — missed market reach, funnel uplift, and abuse exposure | **High** | CH-03.04 (no English → blocked international market), CH-03.05 (forced PDP → funnel friction), CH-03.06 (no auth → fraud exposure) |

**Categorical revenue impact summary:**

- **Direct revenue loss risk:** CH-02.01, CH-02.02, CH-02.03, CH-02.04, CH-02.07
- **Conversion friction risk:** CH-01.01, CH-01.06, CH-02.16, CH-03.05, CH-03.10
- **Market reach limitation:** CH-03.04, CH-03.07
- **Operational cost exposure:** CH-03.06, CH-02.04, CH-02.10
- **Brand-trust erosion:** CH-02.17, CH-03.09, CH-01.07

---

### 5.C) Customer Journey Drop-off Map

Findings mapped to journey stages reveal where risk concentrates and where the user is most likely to abandon. Drop-off risk is highest in **Cart → Checkout transitions** and **Checkout form submission**, which together carry the bulk of the P0/P1 defects.

| Journey Stage | Drop-off Risk Driver | Related Findings | Risk Level |
|---|---|---|---|
| **1. Discovery** | Failed, irrelevant, or unpredictable search results | CH-01.01, CH-01.06, CH-01.07, CH-01.11 | High |
| **2. Product Selection** | Forced detail-page navigation; no rediscovery surface | CH-03.05, CH-03.08 | High |
| **3. Cart** | Inaccurate totals, false stock, unstable UI on recalculation | CH-02.02, CH-02.03, CH-02.04, CH-02.05, CH-02.17 | **Critical** |
| **4. Checkout — Forms** | Broken validation, wrong form schema, missing fields | CH-02.06, CH-02.08, CH-02.10, CH-02.11, CH-02.12, CH-02.13 | **Critical** |
| **5. Checkout — Submit** | Invalid orders accepted; no pre-submit gate | CH-02.01, CH-02.04, CH-02.07 | **Critical** |
| **6. Post-Order Fulfillment** | Bad address/contact data persisted into fulfillment | CH-02.01, CH-02.08, CH-02.10, CH-02.04 | High |
| **7. Cross-cutting (all stages)** | Performance load, mobile rendering, market access | CH-01.04, CH-01.05, CH-02.09, CH-03.04, CH-03.07 | Medium-High |

> **Note on quantification:** Converting these risk levels into monetary exposure (e.g., "% conversion lost per stage") requires production analytics, average order value, and stage-funnel data. The table above defines **where** the risk is — quantifying **how much** is the next step once business data is available.

---

### 5.D) Prioritization Rationale

Exploration order and finding priority were driven by **business impact** and **risk concentration**:

1. **Checkout was prioritized for depth** — the revenue-critical path. Any defect allowing an invalid order, incorrect price, or inventory mismatch directly threatens revenue, fulfillment, and customer trust.
2. **Financial precision and data integrity outranked everything except outright order failure** — scientific-notation monetary values (`9.23e+18`) and rounding inside calculation logic are foundational defects affecting every transaction.
3. **Validation consistency was treated as a recurring theme** — cart vs. checkout, personal vs. corporate, input vs. submission. Inconsistency between layers is the most common source of exploitable gaps.
4. **Search was explored as the journey entry point** — security and analytics integrity are real concerns, but defects rarely block conversion directly, so it ranked second after checkout depth.
5. **Performance and UX polish were ranked lower** — important for scale and trust, but addressable iteratively without immediate revenue risk.
6. **Recommendations (CH-03) were captured separately** to keep the defect list pure while still surfacing strategic uplift opportunities (market reach, conversion, abuse prevention).

---

### 5.E) Closing Note

The findings above reflect a time-boxed exploratory session, not a full regression. A Senior SDET would translate the **P0 and P1 items into automated regression suites first** — API-level for data and validation defects, UI-level for checkout flow gates — and use the **P2/P3 items to inform broader test design and non-functional coverage**: performance and load tests for the debouncing and rate-limit findings, contract tests for the API schema drift, and accessibility and UX heuristics for the navigation issues. **CH-03 recommendations would be prioritized into the product backlog** alongside the defect remediation roadmap, with revenue and market-reach items (CH-03.04, CH-03.05, CH-03.06) treated as strategic uplift candidates for the next planning cycle.

---
**End of report.**