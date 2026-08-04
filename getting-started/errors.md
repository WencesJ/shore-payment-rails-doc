---
title: Errors
description: Error response shape and logging rules.
sidebar_position: 8
---

# Errors

## Response shape

The global error handler returns a flat problem-detail body:

```json
{
  "code": "INSUFFICIENT_AVAILABLE_BALANCE",
  "message": "Available balance is insufficient",
  "statusCode": 422,
  "correlationId": "<correlation-id>",
  "path": "/v1/payouts"
}
```

Treat `code` and the HTTP status as machine-readable. Treat `message` as human-readable and subject to improvement.

Input DTO validation uses the platform validation code and message format rather than every domain-specific code in the [error code reference](../reference/error-codes.md).

## Logging

Log together:

- Shore's `correlationId`
- your idempotency key
- your business reference
- the resource ID

**Never log** API keys, signing secrets, webhook secrets, BVNs, NINs, or full raw identity payloads.

## Full code list

See [Error codes](../reference/error-codes.md).
