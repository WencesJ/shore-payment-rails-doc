---
title: Webhook implementation
description: Ingress flow, verification, deduplication, and recovery.
sidebar_position: 4
---

# Webhook implementation

Webhooks notify you after money-state changes commit. They reduce polling latency; they are **not** a replacement for read APIs or reconciliation.

## Ingress flow

```text
Webhook -> verify HMAC -> deduplicate by event ID -> persist -> acknowledge 2xx
        -> fetch/reconcile Shore state -> update merchant ledger/workflow
```

## Requirements

- Capture the raw body before parsing; verify before acting.
- Deduplicate event IDs inside a database transaction.
- Tolerate out-of-order delivery — never make webhook arrival order the source of truth.
- Return 2xx within 10 seconds and do slow work asynchronously.
- Store webhook secrets separately from API signing secrets.
- Keep receiver clocks synchronized; timestamps more than 300 seconds off must be rejected.

Verification steps and the canonical signature value are in [Webhook events and delivery](../api/webhook-events.md#signature-verification).

## Recovery after downtime

1. Find exhausted deliveries: `GET /v1/webhook-events?status=EXHAUSTED`.
2. Request a fresh delivery cycle: `POST /v1/webhooks/{endpointId}/redeliver` with the UUID `id` returned by the event list.
3. Rely on your event-ID deduplication — redelivery can repeat an event you already processed.

## Secret rotation

`POST /v1/webhooks/{id}/rotate-secret` returns the new secret once. Coordinate so the receiver can validate with the new secret immediately.
