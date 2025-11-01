# WORKPLAN.md: Full-Stack Audit & Autofix Plan

This document outlines the results of the initial repository inventory and the strategic plan for the comprehensive audit, autofix, and validation process for the AI School Dashboard.

---

## 1. Inventory Summary

- **Backend**: Node.js/Express application detected with Sequelize models, JWT-based authentication, and Jest/Supertest for testing.
- **Frontend**: React application detected, using Redux for state management and Axios for API communication.
- **Database**: Project is configured for PostgreSQL, with migration files present.
- **Discrepancy**: The `docs/PROJECT_STRUCTURE.md` mentions an `/ai-service` (Python), but this directory is **not present** in the repository. This will be flagged as a major issue.

---

## 2. Prioritized Action Plan

### 🔴 Critical Issues (Build/Runtime Failures)

1.  **Issue**: Frontend Build Failure due to Module Resolution.
    -   **Files Affected**: `frontend/src/services/*.js` (multiple files).
    -   **Problem**: The frontend `package.json` specifies `"type": "module"`, which enforces strict ECMAScript Module rules. Relative imports like `from './api'` are failing because they require the file extension to be explicitly stated (e.g., `from './api.js'`).
    -   **Fix Plan**: Scan all `.js` and `.jsx` files under `frontend/src/` and append the `.js` extension to all relative imports that are missing it.
    -   **Impact**: **Blocking**. The frontend application cannot be built or run locally.

### 🟠 Major Issues (Broken Functionality & Structural Gaps)

1.  **Issue**: API Route Parity Mismatch.
    -   **Files Affected**: `backend/routes/`, `frontend/src/services/`.
    -   **Problem**: Previous reports (`api-diff-report.md`) indicate a significant number of frontend API calls that do not have corresponding backend routes, leading to 404 errors and broken features.
    -   **Fix Plan**: 
        1.  Re-run the `tools/compare-apis.mjs` script to generate a fresh `reports/route-parity.md`.
        2.  Systematically create or update backend routers (`auth`, `assignments`, `dashboard`, etc.) to include placeholder handlers (`501 Not Implemented`) for every missing route.
        3.  Add a `/health` endpoint to each router for diagnostic purposes.
    -   **Impact**: **High**. Core application functionality is broken.

2.  **Issue**: Missing AI Service Component.
    -   **Files Affected**: Root directory.
    -   **Problem**: The `ai-service` directory, documented as a core component, is missing. Backend calls to `/api/ai/*` will fail.
    -   **Fix Plan**: 
        1.  Create a placeholder `ai-service` directory.
        2.  Add a basic Python Flask/FastAPI application with a `/health` endpoint.
        3.  Include a `requirements.txt` file.
        4.  Note this structural gap in `DEVELOPER_NOTES.md` for the AI team to implement.
    -   **Impact**: **High**. All AI-related features are non-functional.

3.  **Issue**: Potential CORS Configuration Flaw.
    -   **Files Affected**: `backend/app.js`.
    -   **Problem**: The CORS configuration logic is fragile. It merges default origins with environment variables, but this can still fail if not handled correctly. The previous error logs confirm this is a recurring issue.
    -   **Fix Plan**: Review and harden the CORS logic in `backend/app.js` to be more robust, ensuring `http://localhost:3000` is always allowed in non-production environments, regardless of `.env` settings.
    -   **Impact**: **High**. Blocks all frontend-to-backend communication during local development.

### 🟢 Minor Issues (Code Quality & Maintenance)

1.  **Issue**: Lack of Comprehensive Code Quality Analysis.
    -   **Problem**: While ESLint is configured, there is no consolidated report on code quality, code smells, or complexity.
    -   **Fix Plan**: Run `eslint` on both `backend` and `frontend` directories. Pipe the output into `reports/code-quality.md`. Autofix safe, non-breaking issues (like formatting and unused imports).

2.  **Issue**: Incomplete Test Coverage & Validation.
    -   **Problem**: Existing tests may be broken or outdated. New placeholder routes have no test coverage.
    -   **Fix Plan**: 
        1.  Run all existing Jest tests for the backend to establish a baseline.
        2.  Repair any failing tests due to import errors or simple logic changes.
        3.  Augment `tests/integration/scaffold.test.js` to add smoke tests for all new `501` and `/health` endpoints.
        4.  Summarize all test results in `reports/test-summary.md`.

3.  **Issue**: Dependency Vulnerabilities.
    -   **Problem**: Dependencies may have known security vulnerabilities.
    -   **Fix Plan**: Run `npm audit` for both `backend` and `frontend`. Log the full report to `reports/audit.md`. Do not autofix, but list critical vulnerabilities in `DEVELOPER_NOTES.md`.

---

## 3. Execution Order

The autofix process will proceed in the following order to ensure stability:

1.  **Create `WORKPLAN.md`** (This file).
2.  **Backend Audit**: Fix routes and middleware.
3.  **Frontend Audit**: Fix imports and other React-related issues.
4.  **AI Service**: Create placeholder service.
5.  **Test Repair**: Validate existing tests and add new smoke tests.
6.  **Audits & Reporting**: Generate code quality, security, and test summary reports.
7.  **Finalize**: Update documentation and prepare PR draft.

