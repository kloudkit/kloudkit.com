---
description: "Run container images and compose files with Portico: runtimes, published ports, healthchecks and cleanup."
---

# Containers

Portico runs `image` and `compose` services through Docker or Podman, next to your own
commands, and stops them with everything else.

## At a Glance

- Docker or Podman installed, with its `compose` subcommand for `compose` services.
- `runtime` picks one: `auto` *(the default)* uses Docker and falls back to Podman.

## Images

```yaml
services:
  config-server:
    image: registry.example.com/config-server
    tag: "2.4"
    port: 8080
    route: /config
```

`port` is the port inside the container.
Portico publishes it on a free port on `127.0.0.1`, so the container is only reachable
through Portico.
Without `tag`, the runtime uses its default *(`latest`)*.

The container is named `portico-<project>-<service>` and removed when it stops.

## Compose Files

```yaml
services:
  stack:
    compose: ./compose.yaml
```

Portico runs `compose up` on the file and `compose stop` when you stop it, so volumes and
networks survive between runs.
With `service`, it starts and stops only that compose service.

Routes come from the ports the compose services publish *(see
[Routing](./routing#compose-services))*.

## Healthchecks

When a container has a Docker `HEALTHCHECK`, Portico routes to it only once the runtime
reports it healthy.
Until then, requests get a `503` with the container's state:

```json
{"error": "service_unavailable", "service": "stack/db", "port": 5432, "state": "starting"}
```

Containers without a healthcheck, like every other service, are ready as soon as their port
accepts connections.

::: info
Healthchecks hold back requests on the builtin engine only.
The nginx engine routes to a container as soon as its port answers.
:::

## Cleanup

Every container Portico starts carries a `portico.project` label for its project.
When Portico starts, it removes containers a previous run left behind.
`portico down` does the same after a crash *(see
[Running Services](./running-services#stopping))*.

## Next Steps

- [Routing](./routing): how compose ports become routes.
- [Running Services](./running-services): start, restart and stop services.
