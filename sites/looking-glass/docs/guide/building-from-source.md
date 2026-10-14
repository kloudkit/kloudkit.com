---
description: "Run Looking Glass from source while you work on it, or build the image yourself."
---

# Building From Source

Run Looking Glass straight from a checkout while you change it, or build the image yourself.

## At a Glance

- A clone of [kloudkit/looking-glass](https://github.com/kloudkit/looking-glass).
- Go to run from source, Docker to build the image.

## Run From Source

```sh
go run .
# in another shell
curl -X DELETE 'localhost:8080/anything/here'
```

## Build the Image

```sh
docker build -t looking-glass .
docker run --rm -p 8080:8080 looking-glass
```

The image is a single static binary on a [distroless](https://github.com/GoogleContainerTools/distroless)
base, without a shell, running as a non-root user.

::: tip
Swap the final stage for `scratch` to make the image smaller, or for
`ghcr.io/kloudkit/base-image` if you want a shell to exec into.
:::

## Next Steps

- [Configuration](../reference/configuration): flags and environment variables.
