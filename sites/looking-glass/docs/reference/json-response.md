---
description: "Every field of the JSON document Looking Glass returns for a request."
---

# JSON Response

With `X-Glass-Format: json` *(or `?format=json`)*, Looking Glass returns this document, always
with status `200`.

| Field       | Type                  | Description                                                    |
| ----------- | --------------------- | -------------------------------------------------------------- |
| `method`    | string                | Request method.                                                |
| `uri`       | string                | Path and query, as sent.                                       |
| `proto`     | string                | Protocol version *(`HTTP/1.1`)*.                               |
| `time`      | string                | When the request arrived, in UTC *(RFC 3339)*.                 |
| `remote`    | string                | Client address and port.                                       |
| `host`      | string                | The `Host` the client asked for.                               |
| `query`     | object of string arrays | Query parameters, each with every value it was sent with.   |
| `headers`   | object of string arrays | Request headers, without `Host`.                            |
| `body`      | string                | The body, up to the body limit.                                |
| `bodyBytes` | number                | Bytes in `body`.                                               |
| `truncated` | boolean               | Whether the body was longer than the limit and was cut off.    |
