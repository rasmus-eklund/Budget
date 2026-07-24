## ADDED Requirements

### Requirement: Compose owns test database settings
Docker Compose SHALL be the single source of truth for all test database configuration, including host, port, database name, and credentials.

#### Scenario: Test database values come from compose
- **WHEN** the integration test workflow starts
- **THEN** the test database connection details SHALL match the values defined by docker compose

### Requirement: Test mode is explicit
The integration test workflow SHALL run with `NODE_ENV=test`, and test setup SHALL use that value to select the test path.

#### Scenario: Test setup is triggered by NODE_ENV
- **WHEN** the test command is executed with `NODE_ENV=test`
- **THEN** the test-specific setup SHALL run

### Requirement: Tests start the compose database automatically
Running integration tests SHALL start the test database through docker compose so local development and CI use the same workflow.

#### Scenario: Test command starts the database
- **WHEN** a developer or CI runs the integration test command
- **THEN** docker compose SHALL start the test database before the tests execute

### Requirement: Test code uses DATABASE_URL directly
Integration tests SHALL use `DATABASE_URL` directly from the compose environment and SHALL NOT remap `TEST_DATABASE_URL`, parse env files, use fallback URLs, or dynamically load environment values.

#### Scenario: No test URL remapping occurs
- **WHEN** integration test setup reads database configuration
- **THEN** it SHALL use `DATABASE_URL` as provided and SHALL NOT consult `TEST_DATABASE_URL`

### Requirement: Test database mismatch fails fast
Integration tests SHALL include a minimal safety check that fails if `DATABASE_URL` does not exactly match the compose-defined test database URL.

#### Scenario: Mismatched database URL is rejected
- **WHEN** `DATABASE_URL` differs from the docker compose test database URL
- **THEN** the test setup SHALL fail before executing the test suite

### Requirement: Development workflow remains unchanged
Non-test development workflows SHALL continue to use the developer-provided `DATABASE_URL` without requiring docker compose or test-specific overrides.

#### Scenario: Normal dev uses the developer database
- **WHEN** a developer runs the app outside `NODE_ENV=test`
- **THEN** the application SHALL continue using the normal development `DATABASE_URL`
