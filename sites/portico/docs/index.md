---
title: Portico
layout: home

hero:
  tagline: Start your dev servers, APIs and containers, and reach all of them through one port.

features:
  - title: Runs Your Services
    details: Shell commands, container images and compose files, with their output in one stream and a clean stop on Ctrl-C.
  - title: One Origin
    details: / goes to the frontend, /api to the API. No CORS, no per-port auth. Websockets and server-sent events pass straight through.
  - title: Dev-Server Friendly
    details: Upstreams see Host localhost:&lt;port&gt;, so Vite and webpack host checks pass; X-Forwarded-* headers say where the app really lives.
  - title: Knows What's Up
    details: JSON 503s for services that are down, crashed (with their last lines) or still starting per Docker's healthcheck.
  - title: Quick to Set Up
    details: portico init writes the config, and flags cover the rest.
  - title: Production Parity
    details: Swap the builtin proxy for nginx, generated from the same routes, when you need to match production.
---

## Why Portico

A web app in development is rarely one process: a frontend dev server, an API, maybe a config
server and a websocket service, each on its own port.
That works on a laptop.
It breaks behind a gateway that gives every port its own origin *(Cloud Workstations,
Codespaces, a remote dev box)*: the browser sees cross-origin calls, CORS and auth redirects
get in the way, and `localhost` points at the wrong machine.

Portico starts those services and puts one port in front of all of them.
The browser only talks to Portico, and Portico routes each path to the right service.

```sh
portico init    # finds compose files and package.json dev scripts
portico up      # starts everything on http://localhost:4400
```
