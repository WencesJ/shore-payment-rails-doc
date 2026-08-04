---
title: Balances
description: Read pool, locked, and credit state for the business.
sidebar_position: 1
---

# Balances

## `GET /v1/balances`

| | |
| --- | --- |
| Scope | `fiat:read` |
| Signed | No |
| Idempotency key | No |

Reads pool and credit state for the authenticated business.

### Request

```http
GET /v1/balances
Authorization: Bearer <api-key>
```

### Response

```json
{
  "data": [
    {
      "asset": "NGN",
      "available": "12500000",
      "locked": "750000",
      "total": "13250000",
      "credit_limit": "5000000",
      "credit_available": "3500000",
      "balance_threshold": "1000000"
    }
  ],
  "as_of": "2026-08-04T12:00:00.000Z"
}
```

### Fields

| Field | Meaning |
| --- | --- |
| `available` | Own funds currently available for payout holds |
| `locked` | Principal and fees reserved by open payout holds |
| `total` | `available + locked`; credit is **not** included |
| `credit_limit` | Shore-approved credit ceiling |
| `credit_available` | Undrawn credit headroom |
| `balance_threshold` | Optional configured low-balance threshold; may be `null` |

A payout is accepted when available funds plus credit headroom cover principal **plus** the frozen fee.

### Notes

- Use this endpoint, not the bank's view of the vault, as the operational source of truth.
- Never compute pool availability by summing webhook amounts locally.
- The `balance.threshold` webhook event has no emission path; poll this endpoint instead.

See [Liquidity and credit](../guides/liquidity-and-credit.md).
