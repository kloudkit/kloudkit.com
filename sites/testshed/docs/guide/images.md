---
description: "How TestShed gets the image your tests run against: tags and digests, and the pull, build, require and rebuild policies."
---

# Images

Every `shed` container runs one image, set once for the whole session.
TestShed gets it before the first test, pulling or building it as the image policy says.

## At a Glance

- `--shed-image` is required, without a tag *(`ghcr.io/acme/app`, not `ghcr.io/acme/app:1.2`)*.
- `--shed-tag` sets the tag, and defaults to `tests`.

## Tags and Digests

`--shed-tag` takes a tag or a digest.
A value starting with `sha` is used as a digest, so the image can't change under you:

```sh
pytest --shed --shed-image=ghcr.io/acme/app --shed-tag=pr-563
pytest --shed --shed-image=ghcr.io/acme/app --shed-tag=sha256:9f86d0…
```

`--shed-image` can't contain `:` or `@`, so a registry with a port *(`localhost:5000/app`)*
is rejected too.

The `shed_tag` fixture holds the result *(`ghcr.io/acme/app:pr-563`, or
`ghcr.io/acme/app@sha256:…`)*, for tests that start their own containers from the same image.

## Image Policies

`--shed-image-policy` decides how the image is acquired:

- **`pull`:** use the local image if it exists; otherwise pull it, and build it if the pull
  fails *(default)*.
- **`build`:** build only if the image doesn't exist locally.
- **`require`:** use the local image, and stop the session if it doesn't exist.
- **`rebuild`:** always build.

Use `rebuild` while you change the image, and `require` in CI after a separate build step.

## Building

Builds run `docker build` with `--pull`, so base images are always fresh, and tag the result
as the shed image:

```sh
pytest --shed --shed-image=my-test-image --shed-image-policy=rebuild
```

The build context is the directory of your pytest config, and the Dockerfile is `Dockerfile`
in it.
Change either:

```sh
pytest --shed --shed-image=my-test-image --shed-image-policy=build \
  --shed-build-context=docker --shed-dockerfile=Dockerfile.tests
```

`--shed-build-context` is relative to the current directory, and `--shed-dockerfile` to the
build context.

## Skipping Docker

`--shed-skip-bootstrap` skips the image and the network, for a run of tests that don't start
containers *(a unit test subset, say)*.
TestShed's fixtures are still registered, but containers can't start without the network.

## Next Steps

- [Containers](./containers): run the image in your tests.
- [Command-Line Options](../reference/options): every flag and its default.
