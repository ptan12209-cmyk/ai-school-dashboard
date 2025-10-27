# Security Policy

## Vulnerability Reports

### Known Vulnerabilities

#### 1. XLSX Library (SheetJS)
**Status:** Known - No fix available
**Severity:** High
**CVEs:**
- GHSA-4r6h-8v6p-xvw6: Prototype Pollution in sheetJS
- GHSA-5pgg-2g8v-p4x9: SheetJS Regular Expression Denial of Service (ReDoS)

**Current Version:** 0.18.5 (latest as of 2025-10-27)

**Mitigation Strategies:**
1. **Input Validation:** All uploaded Excel files are validated before processing using `validateStudentsData()` and `validateGradesData()` functions in `frontend/src/utils/exportUtils.js`
2. **Restricted Upload:** Only authenticated users can upload files
3. **File Size Limits:** Server enforces maximum file size limits
4. **Content Validation:** All parsed data is sanitized and validated against expected schemas
5. **Error Handling:** Malformed files are rejected with appropriate error messages

**Risk Assessment:**
- **Impact:** High - Potential for prototype pollution or ReDoS attacks
- **Likelihood:** Low - Requires authenticated user to upload malicious Excel file
- **Overall Risk:** Medium

**Monitoring:**
We are actively monitoring the xlsx library for security patches and will upgrade immediately when fixes become available.

**Alternative Considered:**
- **exceljs:** More features but larger bundle size
- Staying with xlsx due to:
  - Industry standard (most widely used)
  - Active maintenance
  - Smaller bundle size
  - Comprehensive format support

#### 2. webpack-dev-server (Development Only)
**Status:** Accepted - Development-only vulnerability
**Severity:** Moderate
**CVEs:**
- GHSA-9jgg-88mc-972h: Source code theft via malicious website (non-Chromium browsers)
- GHSA-4v9v-hfq4-rm2v: Source code theft via malicious website

**Current Version:** 4.15.1 (from react-scripts 5.0.1)

**Why Not Fixed:**
- Upgrading to webpack-dev-server 5.2.1+ causes breaking changes with react-scripts 5.0.1
- This is a **development-only** vulnerability (does not affect production builds)
- Requires developer to visit a malicious website while dev server is running

**Mitigation Strategies:**
1. **Development Environment Only:** Never exposed in production
2. **Network Isolation:** Run dev server on localhost only
3. **Browser Security:** Use Chromium-based browsers for development (Chrome, Edge) - not vulnerable
4. **Awareness:** Developers should avoid visiting untrusted websites while dev server is running

**Risk Assessment:**
- **Impact:** Low - Only affects development environment, not production
- **Likelihood:** Very Low - Requires specific attack scenario during development
- **Overall Risk:** Very Low

**Production Impact:** None - Production builds are not affected

---

## Reporting Security Issues

If you discover a security vulnerability, please email us at security@example.com instead of opening a public issue.

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fixes (if any)

We will acknowledge receipt within 48 hours and provide a detailed response within 7 days.

---

## Security Best Practices

### For Developers:
1. Run `npm audit` before each release
2. Keep dependencies updated
3. Review all third-party library changes
4. Use environment variables for sensitive data
5. Never commit `.env` files

### For Users:
1. Only upload Excel files from trusted sources
2. Use strong passwords for accounts
3. Report suspicious activity immediately
4. Keep browsers updated
5. Logout when using shared computers

---

## Dependency Security

### Backend
- **Last Audit:** 2025-10-27
- **Vulnerabilities:** 0
- **Status:** ✅ All Clear

### Frontend
- **Last Audit:** 2025-10-27
- **Vulnerabilities:** 3 (1 high, 2 moderate - all documented above)
- **Production Vulnerabilities:** 1 (xlsx only)
- **Development Vulnerabilities:** 2 (webpack-dev-server, postcss)
- **Status:** ⚠️ Monitoring - Production builds unaffected

---

## Update History

### 2025-10-27
- Fixed all backend vulnerabilities
- Fixed 9/10 frontend vulnerabilities via package.json overrides
- Documented known xlsx vulnerability
- Implemented input validation for Excel uploads

---

## Contact

For security concerns: security@example.com
For general issues: https://github.com/yourusername/ai-school-dashboard/issues
