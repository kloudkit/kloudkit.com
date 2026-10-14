---
description: "Install TestShed, point it at your image and write a pytest test against a live Docker container."
---

# Getting Started

TestShed is a pytest plugin that hands your tests real services: a running Docker container,
or a Playwright browser, as a fixture.
It gets the image, waits for the container to be ready, and removes everything when the test
ends.

## At a Glance

- A running Docker daemon *(local, or reachable through `DOCKER_HOST`)*.
- Python 3.11 or later, and pytest 9 or later.
- A pytest config file *(`pyproject.toml`, `pytest.ini`, …)*: TestShed resolves its paths from
  its directory.

## Install TestShed

::: code-group

```sh [pip]
pip install testshed
```

```sh [uv]
uv add testshed --group dev
```

:::

## Enable It

TestShed stays dormant until you pass `--shed`, so it never touches Docker in projects that
don't use it.
Turn it on, with your image, in your pytest config:

```toml
# pyproject.toml
[tool.pytest.ini_options]
addopts = "--shed --shed-image=ghcr.io/acme/app --shed-tag=tests"
```

## Write a Test

Ask for the `shed` fixture and you get a running container of that image:

```python
# tests/test_smoke.py
def test_container_is_alive(shed):
  assert shed.execute(["echo", "hello"]) == "hello"
```

```sh
pytest
```

When the session starts, TestShed makes sure the image exists *(pulling or building it)* and
creates a Docker network for the session.
The pytest header shows which image and network it used:

```text
shed-image: ghcr.io/acme/app:tests
shed-network: testshed-app-4821
```

## Next Steps

- [Images](./images): where the image comes from, and when it's built.
- [Containers](./containers): shared and dedicated containers, markers and defaults.
- [Inside a Container](./inside-a-container): run commands, read files and inspect processes.
