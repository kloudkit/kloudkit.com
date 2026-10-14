---
description: "Every key in portico.yaml: the runtime, the proxy and each service, with defaults and rules."
---

# Configuration File

Every key `portico.yaml` accepts.
Unknown keys are errors.

## Top Level

| Key        | Default | Description                                                          |
| ---------- | ------- | -------------------------------------------------------------------- |
| `runtime`  | `auto`  | Container runtime: `auto` *(Docker, else Podman)*, `docker` or `podman`. |
| `proxy`    |         | The proxy in front of the services *(see below)*.                    |
| `services` |         | The services, by name.                                               |

## Proxy

| Key      | Default         | Description                                                                 |
| -------- | --------------- | --------------------------------------------------------------------------- |
| `port`   | `4400`          | Port Portico listens on.                                                    |
| `host`   | `0.0.0.0`       | Address Portico listens on.                                                 |
| `base`   | `/`             | Prefix mounted in front of every route. Must start with `/`.                |
| `engine` | `builtin`       | `builtin`, or `nginx` for production parity.                                |
| `image`  | `nginx`         | Image for the nginx engine, when nginx isn't installed.                     |
| `tag`    | `1.30.5-alpine` | Tag for the nginx engine's image.                                           |
| `cors`   | `["*"]`         | Origins allowed to call Portico cross-origin; `[]` leaves CORS to your app. |

A `cors` entry is `*`, an `http` or `https` origin, or an origin with a leading `*.` in the
host to match any subdomain.

## Services

| Key       | Kinds     | Description                                                                |
| --------- | --------- | -------------------------------------------------------------------------- |
| `run`     | `run`     | Shell command to start; `{port}` becomes the port, also set as `PORT`.     |
| `dir`     | `run`     | Directory to run the command in, relative to `portico.yaml`.               |
| `image`   | `image`   | Container image to run.                                                    |
| `tag`     | `image`   | Image tag.                                                                 |
| `compose` | `compose` | Compose file to bring up, relative to `portico.yaml`.                      |
| `service` | `compose` | The single compose service to start and route.                             |
| `routes`  | `compose` | Paths for individual compose services; not with `service`.                 |
| `port`    | all       | The port it listens on; `none` for a `run` service that serves nothing.    |
| `route`   | all       | Path to mount it at *(default: `/<name>`)*. Must start with `/`.           |
| `strip`   | all       | Remove the route prefix before forwarding *(default: `true`)*.             |
| `host`    | all       | `preserve` forwards the browser's `Host` instead of `localhost:<port>`.    |
| `quiet`   | all       | Keep its output off the screen *(default: `false`)*.                       |
| `log`     | all       | Write its output to `.portico/logs/<name>.log` *(default: `true`)*.        |

A service sets at most one of `run`, `image` and `compose`; with none, it's a service you
start yourself.

### Rules

- `port` is required for `image` services and for services you start yourself.
- `port: none` is only valid with `run`, and a service without a port can't have a `route`.
- With `compose`, `port` needs `service`, and must be a port that compose service publishes.
- Service names use `a-z`, `0-9`, `_`, `.` and `-`, and can't be `portico` or `nginx`.
