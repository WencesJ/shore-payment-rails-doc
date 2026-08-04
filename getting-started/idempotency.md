---
title: Idempotency
description: Where idempotency keys are required, how replay behaves, and how keys differ from business references.
sidebar_position: 6
---

# Idempotency

## Where required

`Idempotency-Key` is required on durable POSTs:

- `POST /v1/virtual-accounts`
- `POST /v1/payouts`
- `POST /v1/test/deposits`
- `POST /v1/webhooks`
- `POST /v1/webhooks/{id}/rotate-secret`
- `POST /v1/webhooks/{id}/redeliver`

Not required for GETs, webhook deletion, or bank name enquiry.

## Behavior

Idempotency records are business-scoped and retained for **24 hours**.

| Situation | Result |
| --- | --- |
| Same key, same method + request target + raw body | Stored result returned |
| Successful replay | Response includes `Idempotent-Replay: true` |
| Same key, different request | `IDEMPOTENCY_KEY_REUSED` (409) |
| Same request while original is still running | `IDEMPOTENCY_IN_PROGRESS` (409) |
| Final client error | Replayed consistently |
| Server-side failure | Remains retryable with the same key |

**Rule:** one idempotency key per business intent, reused only while retrying that exact serialized request.

## Idempotency key is not a business reference

For payouts, `reference` is your durable business identifier. The idempotency key protects HTTP retries; the reference protects the business instruction across its whole lifetime. Keep both.

See also [Payouts → duplicate protections](../api/payouts.md#duplicate-protections).
