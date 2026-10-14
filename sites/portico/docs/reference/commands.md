---
description: "Every Portico command and flag: init, up, routes, status, logs, restart and down."
---

# Commands

Every command but `init` takes `-c`, `--config FILE` to use a specific `portico.yaml` instead of
searching for one.
`portico --help` lists the commands, and `portico --version` prints the version.

## Commands

| Command                   | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `portico init`            | Write a starter `portico.yaml` in the current directory.      |
| `portico up [service…]`   | Start your services and the proxy in front of them.           |
| `portico routes`          | Print the resolved route table without starting anything.     |
| `portico status`          | Show the state of every service of a running Portico.         |
| `portico logs [service…]` | Print service output from `.portico/logs`.                    |
| `portico restart <svc>…`  | Restart services of a running Portico.                        |
| `portico down`            | Stop a running Portico, or clean up what a crashed one left.  |

## `portico init`

| Flag          | Description                                  |
| ------------- | -------------------------------------------- |
| `-y`, `--yes` | Add everything found without asking.         |
| `--force`     | Replace an existing `portico.yaml`.          |

## `portico up` and `portico routes`

Both take the flags that add to or override `portico.yaml`:

| Flag                   | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| `--run name=command`   | Run a command as a service; `{port}` is substituted. Repeatable.      |
| `--route /path=port`   | Route a path to a port, as a service you start yourself. Repeatable.  |
| `--route /path=name`   | Route a path to an existing service. Repeatable.                      |
| `--port PORT`          | Port Portico listens on *(overrides `proxy.port`)*.                   |
| `--host ADDR`          | Address Portico listens on *(overrides `proxy.host`)*.                |
| `--base PATH`          | Prefix for every route *(overrides `proxy.base`)*.                    |

`portico up` also takes:

| Flag              | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `--tui`           | Show a live dashboard instead of the log stream; needs a terminal.          |
| `--watch`         | Reload when `portico.yaml` changes, restarting only what changed.           |
| `--hide svc[,…]`  | Keep services' output off the screen *(it's still logged)*. Repeatable.     |
| `--timestamps`    | Prefix every line with the time.                                            |
| `--raw`           | Print output without prefixes or colors, and Portico's own lines to stderr. |
| `--no-logs`       | Don't write service output to `.portico/logs`.                              |

## `portico logs`

| Flag              | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `-f`, `--follow`  | Keep printing new output.                                         |
| `-n`, `--lines N` | Lines to show from the end of each log *(default: `20`)*.         |
