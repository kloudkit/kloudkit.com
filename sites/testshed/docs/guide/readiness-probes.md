---
description: "Wait until a TestShed container is ready with HTTP, log and shell probes, set suite-wide defaults and adjust timeouts."
---

# Readiness Probes

A probe holds a test back until its container is ready, so the test doesn't race the
container's startup.
If the container isn't ready in time, the test fails with what the probe waited for.

## At a Glance

- Probes are imported from `kloudkit.testshed.docker`.
- Probes run inside the container: `HttpProbe` needs `curl` in the image, or another command.

## Built-In Probes

```python
from kloudkit.testshed.docker import HttpProbe, LogProbe, ShellProbe

# An HTTP endpoint answers.
HttpProbe(port=3000, endpoint="/health", timeout=30.0)

# A regex matches the container's output.
LogProbe(pattern=r"ready to accept connections", timeout=30.0)

# A command exits 0.
ShellProbe(command="pg_isready -U postgres", timeout=30.0)
```

- **`HttpProbe`:** runs `curl http://localhost:<port><endpoint>` inside the container.
  Set `command` to use another client *(`command="wget -qO-"`)*, or `host` for another address.
- **`LogProbe`:** searches the container's logs for `pattern`.
- **`ShellProbe`:** runs `command`, split on spaces and run without a shell.

Each probe retries every 100 ms, for up to `timeout` seconds *(30 by default)*.

## Use a Probe

Pass a probe wherever a container starts:

```python
from kloudkit.testshed.docker import HttpProbe, ShellProbe
from kloudkit.testshed.docker.decorators import shed_config

@shed_config(probe=HttpProbe(port=8080, endpoint="/healthz"))
def test_app(shed):
  ...


def test_db(docker_sidecar):
  docker_sidecar(
    "postgres:16",
    envs={"POSTGRES_PASSWORD": "x"},
    probe=ShellProbe(command="pg_isready -U postgres"),
  )
```

For every `shed` container, set `probe` in `shed_container_defaults` *(see
[Containers](./containers#suite-wide-defaults))*.

## Override the Default Probe

A probe passed to a test combines with the default one:

- **Same type:** the fields you set replace the default's.
  Fields you leave out keep the default's value when they default to nothing *(`port`,
  `endpoint`)*; `timeout`, `host` and `command` come from the new probe either way.
  `HttpProbe(endpoint="/ready")` keeps the default's port, with a 30-second timeout.
- **Another type:** it replaces the default.
- **`probe=None`:** no probe for this container.

To wait longer without restating the probe, pass only `timeout`:

```python
@shed_config(timeout=90.0)
def test_slow_boot(shed):
  ...
```

## When a Probe Times Out

The test fails with what the probe waited for, such as
`URL [http://localhost:3000/health] was not reachable within 30.0s`.
Run with `--shed-container-logs` to see the container's logs as well.

## Next Steps

- [Containers](./containers#suite-wide-defaults): set a default probe for the whole suite.
- [Cleanup and Parallel Runs](./cleanup): container logs on failure.
