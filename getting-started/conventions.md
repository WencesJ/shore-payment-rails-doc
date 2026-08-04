---
title: Conventions
description: Amounts, timestamps, pagination, and rate limits.
sidebar_position: 7
---

# Conventions

## Amounts

Decimal **strings** in the major unit of the asset:

```json
{ "amount": "25000.00", "asset": "NGN" }
```

Never send JSON numbers or floating-point values. Public validators permit up to 18 decimal places; the configured asset determines effective settlement precision.

## Timestamps

ISO-8601 UTC strings, except where a request specifically requires Unix seconds for HMAC verification.

## Pagination

List endpoints use page-based pagination:

```text
?page=1&page_size=50
```

- Default page: `1`
- Default page size: `50`
- Maximum page size: `100`
- List responses return `page`, `page_size`, and `total`

New records may shift later pages. For reconciliation jobs, persist the IDs already processed and use date filters where supported.

## Rate limits

Fixed one-minute bucket per API key:

- **300 requests/minute** for GET
- **60 requests/minute** for POST, PUT, PATCH, DELETE

`POST /v1/banks/resolve` counts against the mutating bucket even though it is logically read-only.

Every response exposes:

```text
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset      # Unix timestamp
```

A limited response is HTTP 429 with `Retry-After` and code `RATE_LIMITED`.
