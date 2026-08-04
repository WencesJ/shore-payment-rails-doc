---
title: Statements
description: Immutable monthly totals for a closed period.
sidebar_position: 3
---

# Statements

## `GET /v1/statements`

| | |
| --- | --- |
| Scope | `fiat:read` |
| Signed | No |
| Idempotency key | No |

### Query parameters

| Parameter | Notes |
| --- | --- |
| `period` | `YYYY-MM`; must be a closed month |

```http
GET /v1/statements?period=2026-07
Authorization: Bearer <api-key>
```

### Response

```json
{
  "period": "2026-07",
  "currency": "NGN",
  "totals": {
    "deposits": "10000000",
    "payouts": "7500000",
    "deposit_fees": "10000",
    "payout_fees": "18750"
  },
  "closed_at": "2026-08-01T00:00:00.000Z"
}
```

### Notes

- Only **closed** months are available. Current or future periods return `STATEMENT_PERIOD_NOT_CLOSED` (422).
- The first successful read **creates the immutable snapshot** for that business and month.
- Use [transactions](./transactions.md) for line items and this endpoint for closed-period totals.

See [Reconciliation → monthly close](../guides/reconciliation.md#monthly-close).
