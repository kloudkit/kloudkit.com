---
title: Looking Glass
layout: home

hero:
  tagline: A drop-in HTTP request reflector. Point anything at it and get back the full request it sent.

features:
  - title: Wildcard Everything
    details: Every HTTP method on every path returns 200 with the full request reflected back.
  - title: Two Response Formats
    details: HTML by default or JSON, chosen with the X-Glass-Format header, never the request's own Accept.
  - title: Copy As
    details: The HTML view copies the request as pretty JSON or a raw HTTP dump, no devtools required.
  - title: Colored Activity Log
    details: One readable line per request, so docker logs stays a clean access stream and request contents never leak.
  - title: Safe and Bounded
    details: Reflected values are escaped, and request bodies are capped so a stray upload can't take the box down.
  - title: Tiny Image
    details: A single static Go binary on a shell-less, non-root distroless base.
---

## Why Looking Glass

When a webhook, a proxy or a client misbehaves, the first question is what request actually
arrived.
Answering it usually means adding log lines to the service, or reaching for a packet capture.

Looking Glass is a drop-in HTTP request reflector.
Point anything at it, and every method on every path is answered with the full request it
received: method, URL, query, headers, client address and body.

```sh
docker run --rm -p 8080:8080 ghcr.io/kloudkit/looking-glass:latest
```
