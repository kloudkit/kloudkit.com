---
description: "How Portico maps request paths to services: routes, prefixes, compose services, and the headers upstreams receive."
---

# Routing

Every service with a port gets a route: a path prefix on Portico's port.
A request goes to the service with the longest route that matches its path.

## At a Glance

- `portico routes` prints the route table without starting anything.
- Routes are mounted under `proxy.base`, which defaults to `/`.

## Routes and Prefixes

A service is mounted at `/<name>` unless `route` says otherwise:

```yaml
services:
  web:
    run: npm run dev -- --port {port}
    route: /
  api:
    port: 3200
```

Here `/api/users` goes to `api`, and every other path goes to `web`.
A path matches a route when it equals the route or continues it after a `/`, so `/apiary`
goes to `web`, not `api`.

Two services can't share a route; Portico refuses to start when they do.

### Stripping the Prefix

By default the route is removed before the request is forwarded: `api` sees `/users`, not
`/api/users`.
The original prefix travels in `X-Forwarded-Prefix`, for apps that build their own links.

Set `strip: false` for an app that expects the full path, such as one built with a base path:

```yaml
services:
  docs:
    run: npm run dev -- --port {port} --base /docs
    route: /docs
    strip: false
```

### A Prefix for Everything

`proxy.base` *(or `--base`)* mounts every route under one prefix.
With `base: /app`, `web` answers on `/app` and `api` on `/app/api`.

## Compose Services

A `compose` service expands into one route per compose service that publishes a port, at
`<route>/<compose service>`:

```yaml
services:
  stack:
    compose: ./compose.yaml
```

If `compose.yaml` has `db` and `queue` services that publish ports, they're routed at
`/stack/db` and `/stack/queue`.
A compose service that publishes several ports gets one route per port, such as
`/stack/queue/5672` and `/stack/queue/15672`.

Portico reads the ports from `compose config`, so environment variables, override files and
profiles are already applied.

Move individual routes with `routes`:

```yaml
services:
  stack:
    compose: ./compose.yaml
    routes:
      queue: /rabbit
```

Or route a single compose service with `service`, which also starts only that one:

```yaml
services:
  grafana:
    compose: ./compose.yaml
    service: grafana
    route: /grafana
```

When that service publishes several ports, `port` picks the one to route.

## What Your Service Sees

Portico forwards each request to `localhost:<port>` and rewrites a few headers:

| Header               | Value                                                              |
| -------------------- | ------------------------------------------------------------------ |
| `Host`               | `localhost:<port>`, so dev server host checks pass.                |
| `X-Forwarded-Host`   | The host the browser used, or what a gateway in front already set. |
| `X-Forwarded-Proto`  | `http`, or what a gateway in front already set.                    |
| `X-Forwarded-For`    | The client address chain.                                          |
| `X-Forwarded-Prefix` | The route, when it was stripped.                                   |

Apps that compare `Origin` to `Host`, like Django's CSRF check, either trust
`X-Forwarded-Host` and `X-Forwarded-Proto`, or set `host: preserve` to receive the browser's
`Host` instead.

Websockets and server-sent events pass straight through, and responses stream as they're
written.

## Next Steps

- [Proxy](./proxy): CORS, error responses and the nginx engine.
- [Containers](./containers): image and compose services.
