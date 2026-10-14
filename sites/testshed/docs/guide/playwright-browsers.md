---
description: "Drive a Chromium browser that runs in a Playwright container, with no browser installed on the host."
---

# Playwright Browsers

`playwright_browser` gives your tests a Chromium browser that runs in a container, on the
session's network.
Nothing but the Playwright Python package is needed on the host.

## At a Glance

- TestShed enabled with `--shed`.
- Docker can pull `mcr.microsoft.com/playwright`, and the container can reach the npm
  registry *(it starts the server with `npx playwright run-server`)*.

## Drive the Browser

```python
def test_example_website(playwright_browser):
  page = playwright_browser.new_page()
  page.goto("https://example.com")

  assert "Example Domain" in page.title()
```

The fixture is session-scoped: every test shares one browser.
Open a page or context per test to keep them apart.

## Reach Your Containers

The browser runs on the session's network, so it reaches `shed` containers by address:

```python
def test_app_page(shed, playwright_browser):
  page = playwright_browser.new_page()
  page.goto(f"http://{shed.ip()}:3000")
```

## Which Image

The container runs `mcr.microsoft.com/playwright` at the same version as the `playwright`
package you have installed, so the client and the browser always match.
Upgrade the package and the image follows.

## Next Steps

- [Containers](./containers): start the services the browser tests.
- [Fixtures and Markers](../reference/fixtures): every fixture TestShed registers.
