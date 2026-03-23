<!-- Generated: 2026-03-23T23:22:28.194Z | RepoSage 0.1.0 -->

# Security Review

Automated workflow for security-focused code review.

## Trigger

- Changes to authentication or authorization code
- New API endpoints or route handlers
- Dependency updates (`package.json`)
- Changes to configuration or environment handling
- Manual invocation for security audits

## Goal

Identify security vulnerabilities and ensure secure coding practices:
- Detect common vulnerability patterns (injection, XSS, CSRF)
- Verify proper input validation and sanitization
- Check authentication and authorization logic
- Review secret and credential handling

## Steps

1. **Identify Security-Sensitive Changes**
   - Filter changes to auth, crypto, input handling, API routes
   - Check for new environment variables or config changes
   - Note any dependency additions or updates

2. **Scan for Vulnerability Patterns**
   - SQL/NoSQL injection: raw queries, string concatenation
   - XSS: unescaped output, innerHTML usage
   - Command injection: exec, spawn, system calls
   - Path traversal: user input in file paths
   - Insecure deserialization: eval, pickle, JSON.parse on user input

3. **Review Authentication Flow**
   - Check session management and token handling
   - Verify password hashing (bcrypt, argon2 preferred)
   - Review OAuth/OIDC implementation if present

4. **Check Authorization Logic**
   - Verify role-based access controls
   - Check for privilege escalation paths
   - Review resource ownership validation

5. **Inspect Secret Handling**
   - Flag hardcoded secrets or API keys
   - Verify environment variable usage
   - Check for secrets in logs or error messages

6. **Generate Security Report**
   - List findings by severity (Critical, High, Medium, Low)
   - Provide OWASP category references
   - Include remediation guidance

## Signals to Inspect

- No pre-existing security findings detected
- Auth patterns: login, authenticate, authorize, session, token, jwt
- Crypto patterns: hash, encrypt, decrypt, sign, verify
- Input patterns: user input from requests, params, payloads, forms
- Dangerous patterns: eval-like code execution, shell execution with unsanitized input, raw output rendering

## Expected Output

```markdown
## Security Review Report

### Executive Summary
- Total findings: X (Critical: A, High: B, Medium: C, Low: D)
- Risk level: [Critical/High/Medium/Low]

### Findings

#### [CRITICAL] Finding Title
- **Location**: file:line
- **Category**: OWASP-A01 (Injection)
- **Description**: Brief description of the vulnerability
- **Impact**: What could happen if exploited
- **Remediation**: How to fix it
- **Code Example**:
  ```
  // Before (vulnerable)
  // After (secure)
  ```

### Passed Checks
- [x] No hardcoded secrets detected
- [x] Input validation present on endpoints
- [ ] Rate limiting not implemented (recommendation)

### Recommendations
1. Priority fix for critical findings
2. Security improvements to consider
```

## Fallback

If security assessment is uncertain:
- Mark findings as "Needs Manual Review"
- Recommend security team consultation for auth/crypto changes
- Suggest external security audit for major features
