---
description: "Describe the services Portico runs in portico.yaml: commands, containers, compose files and services you start yourself."
see:
  - name: Configuration File Reference
    link: /reference/configuration
---

# Configuration

`portico.yaml` lists the services Portico runs and routes.
Every command reads it, so `portico status` or `portico down` from another terminal act on
the same project.

## At a Glance

- Portico looks for `portico.yaml` or `.portico.yaml` in the current directory, then in each
  parent, stopping at the git root.
- `-c`, `--config FILE` points any command at a specific file.
- Without a file, Portico runs on its defaults and whatever `--run` and `--route` add.

## Kinds of Services

Each entry under `services` is one of four kinds, picked by the key it sets:

```yaml
services:
  web:
    run: npm run dev -- --port {port}
    dir: frontend
    route: /
  api:
    port: 3200
  config-server:
    image: registry.example.com/config-server
    tag: "2.4"
    port: 8080
    route: /config
  stack:
    compose: ./compose.yaml
```

- **`run`:** a shell command Portico starts, in `dir` if set.
  `{port}` in the command becomes the service's port, which is also set as `PORT`.
  Leave `port` out and Portico picks a free one; set `port: none` for a worker that serves
  nothing.
- **`image`:** a container.
  `port` is the port inside the container; Portico publishes it on a free local port.
- **`compose`:** a compose file.
  Every port its services publish gets a route *(see [Routing](./routing#compose-services))*.
- **Only `port`:** something you start yourself, such as an API under a debugger.
  Portico routes to it but never starts or stops it.

Service names use `a-z`, `0-9`, `_`, `.` and `-`.
`portico` and `nginx` are reserved.

## Commands and Their Environment

A `run` command runs through `sh -c`, so pipes, `&&` and variables work.
Portico adds a few variables to the environment it inherits:

| Variable              | Value                                                   |
| --------------------- | ------------------------------------------------------- |
| `PORT`                | The service's port, unless it has `port: none`.         |
| `PYTHONUNBUFFERED`    | `1`, so Python output shows up as it's printed.         |
| `FORCE_COLOR`         | `1` when Portico prints to a terminal without `--raw`.  |

Most dev servers read `.env` themselves.
For one that doesn't, load it in the command:

```yaml
services:
  api:
    run: set -a; . ./.env; set +a; ./start
```

## Write a Starter With `portico init`

`portico init` writes `portico.yaml` from what it finds in the current directory:

- **A compose file:** the first of `compose.yaml`, `compose.yml`, `docker-compose.yaml` and
  `docker-compose.yml`, added as a service named `stack`.
- **`package.json` dev scripts:** in the directory itself, then in `web`, `frontend`,
  `client`, `app` and `ui`, then in every other subdirectory.
  The first one found gets the `/` route.

For each dev script, `init` uses the package manager its lock file points at *(pnpm, Yarn or
Bun, else npm)*, and passes the port the way the framework expects:

| Dependency         | Port flags                       |
| ------------------ | -------------------------------- |
| `next`             | `-p {port}`                      |
| `vite`             | `--port {port} --strictPort`     |
| `nuxt`, `astro`    | `--port {port}`                  |

In a terminal, `init` asks which of the services to add.
`-y`, `--yes` adds them all, and `--force` replaces an existing `portico.yaml`.
When it finds nothing, it writes a single example service to edit.

## Validation

Portico checks the whole file before starting anything, and lists every problem at once.
Unknown keys are errors too, so a typo like `rout:` fails instead of being ignored.

The schema on the first line of the file gives your editor the same checks, with
autocompletion:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/kloudkit/portico/main/portico.schema.json
```

## Next Steps

- [Routing](./routing): paths, prefixes and the headers your services see.
- [Containers](./containers): image and compose services in more depth.
- [Configuration File Reference](../reference/configuration): every key and its rules.
