---
description: "Run Looking Glass and send it a request to see exactly what arrived: method, URL, headers and body."
---

# Getting Started

Looking Glass answers every request with the request itself: method, URL, query, headers,
client address and body.
Point a webhook, a proxy or a client at it to see what it really sends.

## At a Glance

- Docker, on `amd64` or `arm64`, or Go 1.27.2 or later to run it without a container.
- A free port; the examples use `8080`.

## Run It

::: code-group

```sh [docker]
docker run --rm -p 8080:8080 ghcr.io/kloudkit/looking-glass:latest
```

```yaml [compose]
services:
  looking-glass:
    image: ghcr.io/kloudkit/looking-glass:latest
    ports:
      - 8080:8080
```

```sh [go]
go install github.com/kloudkit/looking-glass@latest
looking-glass
```

:::

Images are tagged `latest`, `vX.Y.Z` and `vX.Y`; pin a version for anything that has to stay
put.

## Send a Request

Any method on any path gets a `200` with the request reflected back:

```sh
curl -X POST 'localhost:8080/api/users?page=2' -d '{"name":"ada"}' -H 'X-Glass-Format: json'
```

```json
{
  "method": "POST",
  "uri": "/api/users?page=2",
  "proto": "HTTP/1.1",
  "time": "2026-10-14T09:30:00Z",
  "remote": "172.17.0.1:54321",
  "host": "localhost:8080",
  "query": { "page": ["2"] },
  "headers": {
    "Accept": ["*/*"],
    "Content-Length": ["14"],
    "Content-Type": ["application/x-www-form-urlencoded"],
    "User-Agent": ["curl/8.5.0"],
    "X-Glass-Format": ["json"]
  },
  "body": "{\"name\":\"ada\"}",
  "bodyBytes": 14,
  "truncated": false
}
```

Open the same URL in a browser for the HTML view.

## Next Steps

- [Response Formats](./response-formats): HTML or JSON, and copying a request.
- [Activity Log](./activity-log): what the container prints for each request.
- [Configuration](../reference/configuration): the port and the body limit.
