---
description: "What Portico answers itself: CORS, JSON errors for missing routes and stopped services, the public URL, and the nginx engine."
---

# Proxy

Portico answers a few things itself instead of passing them on: CORS, requests it can't
route, and requests for services that aren't up.
It can also hand the proxying to nginx, for parity with production.

## At a Glance

- The `proxy` section of `portico.yaml` sets the port, address, base path, engine and CORS.
- Portico listens on `0.0.0.0:4400` by default; `--port` and `--host` override it.

## CORS

Your own frontend never needs CORS: it's served from the same origin as everything else.
CORS only matters for callers on another origin, and Portico answers it for them:

- It echoes an allowed `Origin` back, with credentials allowed.
- It answers preflight `OPTIONS` requests itself, allowing the requested method and headers.
- It drops the `Access-Control-*` headers your app sends for that origin, so the browser
  never sees two sets.

`proxy.cors` lists the allowed origins, and defaults to any origin *(`*`)*.
On a laptop, "any origin" includes any website you visit, so narrow it down:

```yaml
proxy:
  cors:
    - http://localhost:3000
    - https://*.cloudworkstations.dev
```

A leading `*.` in the host matches any subdomain.
An empty list *(`cors: []`)* leaves CORS entirely to your app.

## Error Responses

When Portico can't forward a request, it answers with JSON your frontend can show:

| Status | `error`               | When                                                    |
| ------ | --------------------- | ------------------------------------------------------- |
| `404`  | `no_route`            | No route matches the path.                              |
| `503`  | `service_unavailable` | The service is down, crashed or still starting.         |
| `502`  | `upstream_error`      | The service accepted the connection, then failed.       |

A `503` says what state the service is in, and for one that crashed, its exit code and last
lines of output:

```json
{
  "error": "service_unavailable",
  "service": "api",
  "port": 3200,
  "state": "exited",
  "exit_code": 1,
  "logs": ["Error: Cannot find module 'express'"]
}
```

## The Public URL

Behind a gateway, the URL in your browser isn't `localhost:4400`.
When the first request arrives with an `X-Forwarded-Host`, Portico logs the URL it came in on,
and `portico status` shows it from then on.

## The nginx Engine

`proxy.engine: nginx` puts nginx in front instead of Portico's builtin proxy:

```yaml
proxy:
  engine: nginx
```

Portico writes the nginx config from the same routes, to `.portico/nginx/nginx.conf`, and
runs the `nginx` on your `PATH`.
Without one, it runs nginx in a container *(`proxy.image` and `proxy.tag`)*.
With `--watch`, it rewrites the config and reloads nginx on changes.

Whatever nginx can't serve, a missing route or a service that's down, it passes to Portico,
so error responses look the same on both engines.

::: info
On the nginx engine, a container with a healthcheck gets requests as soon as its port
answers, without waiting to be healthy.
:::

## Next Steps

- [Routing](./routing): paths, prefixes and forwarded headers.
- [Configuration File Reference](../reference/configuration#proxy): every `proxy` key.
