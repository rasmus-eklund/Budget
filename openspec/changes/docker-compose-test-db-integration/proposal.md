## Why

The current database integration test setup adds extra indirection by remapping `TEST_DATABASE_URL` to `DATABASE_URL`, which makes the test environment harder to reason about and easier to drift from local or CI configuration. We want a single explicit test database contract owned by docker compose, with a simple Linux-first workflow that local runs and CI both call the same way.

## What Changes

- Use docker compose as the single source of truth for all test database settings: host, port, database name, and credentials.
- Run the integration test workflow with `NODE_ENV=test` as the explicit trigger for test setup.
- Start the test database automatically through a dedicated script that both local runs and CI invoke, following the same compose-backed workflow.
- Remove `TEST_DATABASE_URL` to `DATABASE_URL` remapping logic from TypeScript test setup.
- Remove env-file parsing, fallback logic, and dynamic env loading from the test path.
- Keep a minimal safety check that fails fast if `DATABASE_URL` does not exactly match the compose-defined test database URL.
- Preserve the normal development workflow so non-test runs can still use the developer’s usual `DATABASE_URL`.

## Capabilities

### New Capabilities
- `test-database-workflow`: Integration test workflow that is explicitly driven by `NODE_ENV=test`, uses docker compose for the test database environment, and validates that the runtime database URL matches the compose contract.

### Modified Capabilities
- None

## Impact

- Test command wiring in `package.json` and/or a dedicated shell script.
- Docker compose files or scripts that define the test database service and environment, with CI staying Linux-first and simple.
- TypeScript integration test setup that currently remaps `TEST_DATABASE_URL`.
- Any shared DB bootstrap code that needs to preserve production/development behavior while adding a stricter test-only path.
