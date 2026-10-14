---
description: "Run commands, read files and inspect processes inside a TestShed container, and customize the container class."
---

# Inside a Container

Every container TestShed gives you, from `shed`, `docker_sidecar` or `shed_attach`, has the
same helpers: `execute` runs commands, `fs` reads files and `proc` inspects processes.

## At a Glance

- A container from any TestShed fixture.
- The image needs the tools the helpers call: a shell, `test`, `ls`, `stat`, `grep` and `tr`.

## Run Commands With `execute`

`execute` runs a command through the container's shell *(`/bin/sh -c`)* and returns its
output, without the trailing newline:

```python
def test_commands(shed):
  assert shed.execute("echo hello") == "hello"
  assert shed.execute(["echo", "hello"]) == "hello"

  # A specific shell.
  shed.execute.bash("set -o pipefail; cat /etc/os-release | head -1")
  shed.execute.sh(["echo", "portable"])
  shed.execute.zsh("print -r -- $ZSH_VERSION")

  # Another user.
  assert shed.execute("whoami", user="nobody") == "nobody"
```

A list is joined with spaces, unquoted, before it reaches the shell.
`login_shell=True` runs it in a login shell, and other keyword arguments *(`envs`, `workdir`,
…)* go to python-on-whales' `execute`.

### When a Command Fails

A command that exits non-zero fails the test with the command's error output, without a
Python traceback.
Pass `raises=True` to get a `DockerException` instead, to assert on it or recover:

```python
import pytest

from kloudkit.testshed.docker import DockerException

def test_missing_file(shed):
  with pytest.raises(DockerException):
    shed.execute("cat /nope", raises=True)
```

With `--shed-container-logs`, the container's logs are printed when a command fails the test.

## Read Files With `fs`

```python
def test_files(shed):
  assert shed.fs.exists("/etc/hostname")
  assert "hostname" in shed.fs.ls("/etc")          # hidden=True includes dotfiles

  assert "root" in shed.fs("/etc/passwd")          # same as shed.fs.text(...)
  raw = shed.fs.bytes("/etc/hostname")
  config = shed.fs.json("/app/config.json")
  manifest = shed.fs.yaml("/app/manifest.yaml")

  assert shed.fs.mode("/etc/hostname") == "644"
  assert shed.fs.owner("/etc/hostname") == "root"
  assert shed.fs.group("/etc/hostname") == "root"
```

Files are copied out of the container, so reading works even when the path isn't readable
by the container's default user.

## Inspect Processes With `proc`

```python
def test_processes(shed):
  assert shed.proc.running("nginx")
  assert shed.proc.pids("nginx")                   # tuple of matching PIDs

  assert "nginx" in shed.proc.cmdline("nginx")     # command line of the first match
  assert shed.proc.environ()["PATH"]               # environment of PID 1
```

Names match the process name exactly.
The kernel cuts process names at 15 characters, so look up a long name by its first 15.
`cmdline` raises `LookupError` when nothing matches, and `environ` takes another PID.

## The Container Itself

- **`ip()`:** the container's address on the session's network.
- **`whoami()`:** the user commands run as.
- **`wrapped`:** the underlying python-on-whales container, with its exact type.
- **`name`, `id`, `logs()`, …:** anything else is passed to the underlying
  [python-on-whales](https://gabrieldemarmiesse.github.io/python-on-whales/) container.

## Custom Container Classes

Subclass `Container` to change how commands run, and set it as `container_class` *(per call,
or in `shed_container_defaults`)*:

```python
from kloudkit.testshed.docker import Container

class AppContainer(Container):
  DEFAULT_USER = "app"          # user= for every command
  DEFAULT_SHELL = "/bin/bash"   # shell for execute(...)
  LOGIN_SHELL = True            # run commands in a login shell
  ZSH_PATH = "/bin/zsh"         # where execute.zsh finds zsh
```

`BASH_PATH` *(`/bin/bash`)*, `SH_PATH` *(`/bin/sh`)* and `ZSH_PATH` *(`/usr/bin/zsh`)* are the
shells `execute.bash`, `execute.sh` and `execute.zsh` use.

## Next Steps

- [Readiness Probes](./readiness-probes): make sure the container is ready before you use it.
- [Containers](./containers#suite-wide-defaults): set a container class for the whole suite.
