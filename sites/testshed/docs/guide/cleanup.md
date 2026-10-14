---
description: "How TestShed removes containers, volumes and networks, runs in parallel with pytest-xdist, and shows container logs on failure."
---

# Cleanup and Parallel Runs

TestShed removes what it starts, when the fixture that started it goes out of scope, and
again at the end of the session.
Each session gets its own network and labels, so parallel runs don't collide.

## At a Glance

- Nothing to set up: cleanup and xdist support are always on.
- `--shed-container-logs` prints container logs when a test fails.

## What Gets Removed

- **Containers:** removed with their anonymous volumes when their fixture ends: after the
  test for `shed` with markers, `docker_sidecar` and `shed_deferred`; after the module or the
  session for the wider-scoped fixtures.
- **Volume files:** the temporary files behind `InlineVolume` and `RemoteVolume`.
- **The network:** removed at the end of the session.

At the end of the session, TestShed also removes any container still carrying the session's
label, so a test that crashed mid-setup doesn't leave one behind.
Containers you attach with `shed_attach` are never removed.

Every container carries two labels, for finding them while a session runs:

| Label                         | Value                                              |
| ----------------------------- | -------------------------------------------------- |
| `com.kloudkit.testshed`       | The session, such as `testshed-app-4821`.          |
| `com.kloudkit.testshed.test`  | The test that started it *(its pytest node ID)*.   |

```sh
docker ps --filter label=com.kloudkit.testshed
```

Pressing `Ctrl-C` stops the session and still runs the cleanup; it can take a moment.

## Parallel Runs

`pytest -n auto` *(pytest-xdist)* works without extra setup:

```sh
pytest -n auto
```

The network name and labels include the xdist worker *(`gw0`, `gw1`, …)*, so workers don't
share containers, and each worker cleans up its own.

## Container Logs on Failure

`--shed-container-logs` prints a container's logs when a test fails because of it: a command
that failed, or a probe that timed out.

```sh
pytest --shed-container-logs
```

## Next Steps

- [Command-Line Options](../reference/options): every flag and its default.
- [Readiness Probes](./readiness-probes): fail fast when a container isn't ready.
