---
description: "Install Portico, write a portico.yaml and serve every service of your app through one port."
---

# Getting Started

Portico starts the services your app is made of and puts one port in front of them.
The browser only talks to that port, and Portico routes each path to the right service.

## At a Glance

- Linux, on `amd64` or `arm64`.
- Docker or Podman, only for `image` and `compose` services.

## Install Portico

::: code-group

```sh [binary]
mkdir -p ~/.local/bin
curl -fsSL -o ~/.local/bin/portico \
  https://github.com/kloudkit/portico/releases/latest/download/portico-amd64
chmod +x ~/.local/bin/portico
```

```sh [go]
go install github.com/kloudkit/portico@latest
```

:::

On `arm64`, download `portico-arm64` instead.

## Write a Config

Run `portico init` in your project.
It looks for a compose file and for `package.json` dev scripts, and offers to add each one:

```sh
portico init
```

The result is a `portico.yaml` you can edit:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/kloudkit/portico/main/portico.schema.json

services:
  web:
    run: npm run dev -- --port {port} --strictPort
    route: /
  api:
    run: npm run dev
    dir: api
```

Check what it resolves to before starting anything:

```sh
portico routes
```

## Start Everything

```sh
portico up
```

Portico starts every service, prints the route table and listens on `http://localhost:4400`.
Output from all services lands in one stream, each line prefixed with its service.
Press `Ctrl-C` to stop everything.

::: tip
Behind a gateway *(Cloud Workstations, Codespaces, a remote dev box)*, open the forwarded URL
for port `4400`.
Portico logs the public URL once the first request comes through it.
:::

### Without a Config File

Flags cover the simple cases:

```sh
portico up --run 'web=npm run dev -- --port {port}' --route /=web --route /api=3200
```

`--run` starts a command as a service, and `--route` mounts a path on a service or a port.

## Next Steps

- [Configuration](./configuration): every kind of service, and what `portico init` detects.
- [Routing](./routing): how paths reach your services.
- [Running Services](./running-services): output, the dashboard and controlling a running Portico.
