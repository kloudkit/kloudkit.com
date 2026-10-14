---
description: "Every fixture and marker TestShed registers, with its scope and what it returns."
---

# Fixtures and Markers

TestShed registers these fixtures and markers whenever `--shed` is set, with no import or
`conftest.py` needed.
Markers are imported from `kloudkit.testshed.docker.decorators` when you apply them.

## Containers

| Fixture                  | Scope    | Returns                                                                       |
| ------------------------ | -------- | ----------------------------------------------------------------------------- |
| `shed`                   | function | The shared container, or a dedicated one when the test has markers.           |
| `shed_deferred`          | function | `shed_deferred(envs=…, volumes=…, **kwargs)`: starts a container when called. |
| `shed_attach`            | function | `shed_attach(name_or_id)`: wraps a running container you manage.              |
| `shed_default`           | session  | The shared container `shed` returns without markers.                          |
| `shed_factory`           | function | Starts a shed container with the defaults merged in; behind `shed`.           |
| `docker_sidecar`         | function | `docker_sidecar(image, **kwargs)`: starts a container from any image.         |
| `docker_module_sidecar`  | module   | Same as `docker_sidecar`, removed after the module.                           |
| `docker_session_sidecar` | session  | Same as `docker_sidecar`, removed after the session.                          |
| `playwright_browser`     | session  | A Playwright `Browser` connected to Chromium in a container.                  |

## Settings and Paths

| Fixture                   | Scope    | Returns                                                                     |
| ------------------------- | -------- | --------------------------------------------------------------------------- |
| `shed_container_defaults` | session  | `{}`; override it to set defaults for every `shed` container.               |
| `shed_tag`                | session  | The image used, as `image:tag` or `image@sha256:…`.                         |
| `shed_state`              | session  | The session's resolved settings: image, tag, network, labels and paths.     |
| `test_root`               | session  | The tests directory, as an absolute path *(`--shed-tests-dir`)*.            |
| `project_root`            | session  | The source directory, as an absolute path *(`--shed-src-dir`)*.             |
| `downloader`              | function | `downloader(url, output)`: downloads into `tmp_path`, returns the `Path`.   |

`downloader` also takes `method`, `allow_redirects`, `raise_for_status` and
`request_options` *(passed to `requests`)*.

## Container Arguments

`docker_sidecar`, `shed_deferred` and `@shed_config` take any argument of python-on-whales'
`docker.run`, plus:

| Argument          | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| `probe`           | A readiness probe to wait for; `None` for none.                            |
| `timeout`         | Seconds to wait for the probe, keeping its other fields *(not on sidecars)*. |
| `container_class` | The `Container` subclass to wrap the container in.                         |
| `volumes`         | `(source, dest)` tuples or volume objects, mounted read-only.              |
| `networks`        | Networks to join instead of the session's network.                         |
| `detach`          | `False` runs the container to completion and returns its output *(sidecars only)*. |

## Markers

| Marker                   | Effect                                                            |
| ------------------------ | ----------------------------------------------------------------- |
| `@shed_env(**envs)`      | Set environment variables.                                        |
| `@shed_volumes(*mounts)` | Mount `(source, dest)` tuples or volume objects, read-only.       |
| `@shed_config(**kwargs)` | Pass container arguments *(see above)*.                           |
| `@shed_mutable()`        | Give the test its own container, without other settings.          |
