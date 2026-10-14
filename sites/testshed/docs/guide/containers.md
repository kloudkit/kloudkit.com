---
description: "Get a shared or dedicated container per test, configure it with markers and defaults, start it on demand, or attach one that's already running."
see:
  - name: Fixtures and Markers
    link: /reference/fixtures
---

# Containers

The `shed` fixture gives a test a running container of the shed image.
Tests that don't change anything share one container; markers give a test its own.

## At a Glance

- TestShed enabled with `--shed` and an image *(see [Getting Started](./getting-started))*.
- Markers are imported from `kloudkit.testshed.docker.decorators`.

## Shared and Dedicated Containers

By default, `shed` returns one container shared by the whole session *(`shed_default`)*, so
it starts once and tests stay fast.

A test with any TestShed marker gets its own container instead, removed when the test ends.
Use `@shed_mutable()` for a test that changes the container *(writes files, installs
packages)* but needs no other setting:

```python
from kloudkit.testshed.docker.decorators import shed_mutable

@shed_mutable()
def test_install_package(shed):
  shed.execute("apt-get install -y curl")

  assert "curl" in shed.execute("which curl")
```

## Configure With Markers

| Marker                    | Effect                                                                     |
| ------------------------- | -------------------------------------------------------------------------- |
| `@shed_env(**envs)`       | Set environment variables.                                                 |
| `@shed_volumes(*mounts)`  | Mount files: `(source, dest)` tuples or volume objects.                    |
| `@shed_config(**kwargs)`  | Pass any other argument to the container *(`publish`, `command`, `probe`, …)*. |
| `@shed_mutable()`         | Give the test its own container, without other settings.                   |

```python
from kloudkit.testshed.docker.decorators import shed_config, shed_env

@shed_config(publish=[(8080, 80)])
@shed_env(MY_ENV_VAR="hello")
def test_configured_app(shed):
  assert shed.execute("echo $MY_ENV_VAR") == "hello"
```

`@shed_config` arguments go to the container's `run` call, so anything `docker run` takes
works there *(`publish`, `command`, `entrypoint`, `user`, `networks`, …)*.

Markers work on a class or a module too *(`pytestmark`)*.
The one closest to the test wins: a marker on a test replaces the same marker on its class.

### Volumes

Every mount is read-only.
A relative source resolves against the stubs directory *(`tests/stubs`, or
`--shed-stubs-dir`)*:

```python
from kloudkit.testshed.docker import InlineVolume, RemoteVolume
from kloudkit.testshed.docker.decorators import shed_volumes

@shed_volumes(
  ("nginx.conf", "/etc/nginx/nginx.conf"),
  InlineVolume("/app/config.txt", "any content you want", mode=0o644),
  RemoteVolume("/app/config.json", "https://api.example.com/config.json"),
)
def test_with_files(shed):
  ...
```

- **`InlineVolume(path, content, mode=0o644)`:** mounts a file with the given text or bytes.
- **`RemoteVolume(path, url, mode=0o644)`:** downloads the URL before the container starts,
  and mounts the result.
  It also takes `method`, `allow_redirects`, `raise_for_status` and `request_options`
  *(passed to `requests`)*.

## Suite-Wide Defaults

Override `shed_container_defaults` in your `conftest.py` to set what every `shed` container
starts with:

```python
import pytest

from kloudkit.testshed.docker import Container, HttpProbe

class AppContainer(Container):
  DEFAULT_USER = "app"

@pytest.fixture(scope="session")
def shed_container_defaults():
  return {
    "container_class": AppContainer,
    "envs": {"APP_PORT": 3000},
    "probe": HttpProbe(port=3000, endpoint="/health"),
  }
```

Markers are applied on top of the defaults.
`container_class` picks the class every container is wrapped in *(see
[Inside a Container](./inside-a-container#custom-container-classes))*.

## Start on Demand With `shed_deferred`

`shed_deferred` is a function that starts the container when you call it, for setup that has
to happen first, or for several containers in one test:

```python
from kloudkit.testshed.docker.decorators import shed_env

@shed_env(APP_PORT="3000")
def test_deferred(shed_deferred):
  # Nothing is running yet.
  container = shed_deferred(envs={"DEBUG": "true"})

  assert container.execute("echo $DEBUG") == "true"
  assert container.execute("echo $APP_PORT") == "3000"


def test_replicas(shed_deferred):
  primary = shed_deferred(envs={"ROLE": "primary"})
  replica = shed_deferred(envs={"ROLE": "replica"})
```

Call arguments merge with the markers:

- **`envs`:** merged, call values win.
- **`volumes`:** added after the marker's volumes.
- **Anything else:** replaces the `@shed_config` value of the same name.

## Attach a Running Container

`shed_attach` brings in a container you started yourself, such as a database from a compose
file:

```python
def test_against_running_db(shed, shed_attach):
  db = shed_attach("my-postgres")

  assert db.execute("pg_isready")
  assert shed.execute(["getent", "hosts", db.name])
```

The container joins the session's network for the test, so `shed` containers reach it by
name, and leaves it when the test ends.
TestShed never stops or removes it.
It must already be running, and can't be used with `--shed-skip-bootstrap`.

## Other Images With `docker_sidecar`

`docker_sidecar` starts a container from any image, on the session's network:

```python
def test_with_nginx(docker_sidecar):
  nginx = docker_sidecar("nginx:latest", publish=[(8080, 80)])

  assert nginx.ip()
```

It takes the same arguments as `@shed_config`, plus `probe` and `container_class`.
The container is removed when the test ends; `docker_module_sidecar` and
`docker_session_sidecar` keep it for the module or the session.
With `detach=False`, the container runs to completion and the call returns its output.

## Next Steps

- [Inside a Container](./inside-a-container): what you can do with the container you get.
- [Readiness Probes](./readiness-probes): wait until it's ready.
- [Fixtures and Markers](../reference/fixtures): every fixture and its scope.
