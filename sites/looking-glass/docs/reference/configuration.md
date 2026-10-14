---
description: "Every Looking Glass setting, as a flag or an environment variable, and the selectors that pick the response format."
---

# Configuration

Every setting has a flag and an environment variable; the flag wins.
`looking-glass --help` lists them, and `looking-glass --version` prints the version
*(`dev` for a build without a release tag)*.

## Settings

| Flag                | Variable         | Default   | Description                                      |
| ------------------- | ---------------- | --------- | ------------------------------------------------ |
| `-p`, `--port PORT` | `PORT`           | `8080`    | Port to listen on, on every interface.           |
| `--max-body BYTES`  | `MAX_BODY_BYTES` | `1048576` | Body bytes reflected before the body is cut off. |

`--max-body` must be positive.
A `MAX_BODY_BYTES` that isn't a positive number is ignored, and the default applies.

```sh
docker run --rm -p 9000:9000 -e PORT=9000 -e MAX_BODY_BYTES=65536 \
  ghcr.io/kloudkit/looking-glass:latest
```

## Response Format

| Selector                | Values          | Effect                                       |
| ----------------------- | --------------- | -------------------------------------------- |
| `X-Glass-Format` header | `html` / `json` | Response format. Wins over the query param.  |
| `format` query param    | `html` / `json` | For browsers. Anything but `json` is `html`. |

## Shutdown

On `SIGTERM` or `SIGINT`, Looking Glass stops accepting connections and gives requests in
flight 5 seconds to finish.
