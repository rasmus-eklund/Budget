## 1. Compose Test Workflow

- [x] 1.1 Add a minimal Linux-first `docker-compose.test.yml` that defines the full test database contract in one place
- [x] 1.2 Add a single shell script that starts the compose-managed test database before running the suite with `NODE_ENV=test`
- [x] 1.3 Update `package.json` and GitHub Actions so CI and local runs call the same compose-backed integration-test script

## 2. TypeScript Test Bootstrap

- [x] 2.1 Remove `TEST_DATABASE_URL` remapping and any env-file parsing or fallback logic from the database integration test setup
- [x] 2.2 Make the integration test bootstrap read `DATABASE_URL` directly from the environment supplied by compose
- [x] 2.3 Add a minimal exact-match safety check that fails when `DATABASE_URL` does not equal the compose-defined test database URL

## 3. Verification

- [x] 3.1 Verify the normal development path still uses the developer-provided `DATABASE_URL` when `NODE_ENV` is not `test`
- [x] 3.2 Run the database integration tests through the new compose workflow and confirm the database starts automatically
