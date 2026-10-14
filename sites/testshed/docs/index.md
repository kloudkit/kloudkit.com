---
title: TestShed
layout: home

hero:
  tagline: Integration tests against real services, not mocks. Ask for a fixture, get a live Docker container or browser.

features:
  - title: Containers as Fixtures
    details: Request shed (or docker_sidecar) and run commands, read files and inspect processes inside a real container.
  - title: Playwright Browsers
    details: Drive a browser running in a Playwright sidecar container.
  - title: Per-Test Configuration
    details: Set env vars, volumes and readiness probes with markers, or defaults for the whole suite.
  - title: Lifecycle Handled
    details: Images are resolved up front; containers and volumes are removed when the test finishes, even on failure.
  - title: Ready When You Are
    details: HTTP, log and shell probes block until the container is ready, so tests don't race its startup.
  - title: Parallel Out of the Box
    details: pytest -n auto works without setup; networks and labels are namespaced per xdist worker.
---

## Why TestShed

Integration tests need real services *(a database, an API, a browser)*, not mocks.
Standing those up by hand means container code in `conftest.py`, flaky startup races, and
leftover containers when a test crashes.

TestShed hands you a running Docker container, or a Playwright browser, as a fixture.
Ask for `shed` and you get a live container: TestShed pulls or builds the image, waits for
it to be ready, and removes everything when the test ends.

```python
def test_container_is_alive(shed):
  assert shed.execute(["echo", "hello"]) == "hello"
```
