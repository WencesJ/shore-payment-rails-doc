---
title: Transactions
description: Ledger-derived activity for deposits, holds, settlements, fees, and releases.
sidebar_position: 2
---

# Transactions

## `GET /v1/transactions`

| | |
| --- | --- |
| Scope | `fiat:read` |
| Signed | No |
| Idempotency key | No |

### Query parameters

| Parameter | Notes |
| --- | --- |
| `page`, `page_size` | See [pagination](../getting-started/conventions.md#pagination) |
| `type` | One of `deposit`, `payout_hold`, `payout_settle`, `fee`, `release`, `adjustment` |
| `asset` | `NGN` |
| `from`, `to` | ISO-8601 UTC bounds |

```http
GET /v1/transactions?page=1&page_size=50&type=deposit&asset=NGN&from=2026-08-01T00:00:00Z&to=2026-09-01T00:00:00Z
Authorization: Bearer <api-key>
```

### Response item

```json
{
  "id": "<journal-or-projection-id>",
  "type": "payout_hold",
  "amount": "25000",
  "fee": "62.5",
  "asset": "NGN",
  "balance_after": {
    "available": "100000",
    "locked": "25062.5"
  },
  "related": { "id": "<payout-id>" },
  "created_at": "2026-08-04T12:00:00.000Z"
}
```

### Notes

This endpoint is a business-facing projection of Shore's ledger. Use `related.id` to connect an entry to a payout or deposit.

Customer attribution is most directly available from the [deposit webhook](./webhook-events.md) and [virtual-account lookup](./virtual-accounts.md), not from this projection.

See [Reconciliation](../guides/reconciliation.md).
