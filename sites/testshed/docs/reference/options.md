---
description: "Every TestShed command-line option, with its default."
---

# Command-Line Options

Every option TestShed adds to pytest.
Paths are relative to the directory of your pytest config file.

| Option                       | Default                                 | Description                                                         |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------------- |
| `--shed`                     | off                                     | Enable TestShed for the current test suite.                         |
| `--shed-image IMAGE`         | none, required                          | Image repository, without a tag *(e.g. `ghcr.io/acme/app`)*.        |
| `--shed-tag TAG\|SHA`        | `tests`                                 | Image tag, or a digest when it starts with `sha`.                   |
| `--shed-image-policy POLICY` | `pull`                                  | `pull`, `build`, `require` or `rebuild` *(see [Images](../guide/images#image-policies))*. |
| `--shed-build-context DIR`   | the pytest config's directory           | Build context for `build`, `rebuild` and the `pull` fallback.       |
| `--shed-dockerfile FILE`     | `Dockerfile`                            | Dockerfile, relative to the build context.                          |
| `--shed-src-dir DIR`         | `src`                                   | Source directory, for `project_root`.                               |
| `--shed-tests-dir DIR`       | `tests`                                 | Tests directory, for `test_root`.                                   |
| `--shed-stubs-dir DIR`       | `tests/stubs`                           | Where relative `@shed_volumes` sources resolve.                     |
| `--shed-skip-bootstrap`      | off                                     | Skip the image and network, for tests that start no containers.     |
| `--shed-container-logs`      | off                                     | Print container logs when a command or probe fails a test.          |
