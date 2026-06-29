## Context

Database integration tests currently bootstrap their connection by reading `TEST_DATABASE_URL` when present and falling back to a hard-coded local URL. That makes the test path diverge from the rest of the app, hides the true source of configuration, and creates room for CI/local drift.

The desired end state is stricter: docker compose defines the test database contract, `NODE_ENV=test` selects the test path, and the TypeScript test setup uses `DATABASE_URL` directly with only a minimal mismatch guard. The workflow should stay Linux-first and simple, matching the sibling repo pattern where CI calls one integration-test script and that script owns compose startup.

## Goals / Non-Goals

**Goals:**
- Make docker compose the only place that defines test database host, port, database name, and credentials.
- Ensure local and CI integration tests use the same compose-driven workflow.
- Keep the CI path thin and Linux-first by delegating test startup to one shell script.
- Remove `TEST_DATABASE_URL` remapping and other test-only env loading logic from TypeScript.
- Preserve the normal non-test development path unchanged.
- Fail fast when the runtime `DATABASE_URL` does not match the compose-defined test database.

**Non-Goals:**
- Redesigning the application’s general environment validation system.
- Changing production database configuration or deployment behavior.
- Introducing new test frameworks or changing the scope of the integration suite itself.

## Decisions

- Use a dedicated docker compose test workflow rather than host-side env bootstrapping.
  - Rationale: if the database values are only defined in compose, the test runner should inherit them from compose instead of re-encoding them in scripts or TypeScript.
  - Alternatives considered: host script that starts compose and then exports env variables, or env-file parsing in tests. Both reintroduce duplication and weaken the single-source-of-truth goal.

- Use one shell script as the canonical integration-test entrypoint.
  - Rationale: this keeps GitHub Actions minimal and gives local developers the same invocation path as CI.
  - Alternatives considered: putting the compose logic directly into GitHub Actions, or spreading startup across package.json and test files. Both make the workflow harder to reason about.

- Run the integration suite inside a compose-managed test-runner container.
  - Rationale: this lets compose own both the database and the runtime environment without duplicating test database values in CI or host-side scripts.
  - Alternatives considered: running Bun on the host and trying to export compose values into the shell. That would reintroduce the exact indirection this change removes.

- Keep `NODE_ENV=test` as the explicit test-mode switch.
  - Rationale: the test path should be obvious and deterministic, and the application already has a conventional environment flag available.
  - Alternatives considered: separate custom test env flags or heuristics based on script name. Those would add another layer of indirection.

- Retain a small runtime safety check in the test setup.
  - Rationale: even with compose as the contract source, a mistaken override should fail immediately rather than silently testing against the wrong database.
  - Alternatives considered: remove all checks and trust the environment, or validate by parsing env files. The former is too permissive; the latter violates the no-parsing requirement.

- Keep development behavior untouched outside test mode.
  - Rationale: developers should still be able to run the app against their normal database without needing compose for everyday work.
  - Alternatives considered: force compose for all database access. That would be unnecessarily disruptive and expand the change beyond the request.

## Risks / Trade-offs

- [Risk] Compose-based test execution may require a slightly different local/CI entrypoint than the current host-run test command. → Mitigation: keep a single shell script as the canonical entrypoint and have both local and CI call it.
- [Risk] A stricter URL equality check can fail on harmless formatting differences. → Mitigation: define the compose URL format consistently and compare against the exact expected string.
- [Risk] Moving test execution under compose may increase startup time. → Mitigation: scope compose to only the test database path and keep the test runner workflow minimal.
- [Risk] Existing test helpers may still assume fallback env behavior. → Mitigation: update the shared bootstrap path once and let the integration suite consume it directly.

## Migration Plan

1. Add or update the compose test database workflow so it exposes the test database contract in one place.
2. Add a single integration-test shell script that starts the compose-managed database before executing the suite with `NODE_ENV=test`.
3. Remove `TEST_DATABASE_URL` remapping and env-file loading from the TypeScript test bootstrap.
4. Replace fallback logic with a strict `DATABASE_URL` equality check for the compose-defined test database.
5. Verify that development runs still use the developer’s normal `DATABASE_URL` when `NODE_ENV` is not `test`.
6. Update CI to call the same compose-backed integration test script used locally.

## Open Questions

None.
