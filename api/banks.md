---
title: Banks
description: List reachable banks and resolve a beneficiary name.
sidebar_position: 4
---

# Banks

## `GET /v1/banks`

| | |
| --- | --- |
| Scope | `fiat:read` |
| Signed | No |
| Idempotency key | No |

### Query parameters

| Parameter | Notes |
| --- | --- |
| `asset` | `NGN` |

```http
GET /v1/banks?asset=NGN
Authorization: Bearer <api-key>
```

### Response

```json
{
  "data": [
    {
      "code": "000017",
      "name": "Example Bank",
      "country": "NG",
      "assets": ["NGN"]
    }
  ]
}
```

Use the returned `code` values for name enquiry and payouts. Refresh this list rather than hard-coding it permanently.

> A `country` filter described in the original product model is **not** implemented in the public DTO. Only `asset=NGN` is supported.

---

## `POST /v1/banks/resolve`

| | |
| --- | --- |
| Scope | `fiat:read` |
| Signed | No |
| Idempotency key | No |
| Rate-limit bucket | Mutating (60/min) |

### Request

```json
{
  "bank_code": "000017",
  "account_number": "0123456789"
}
```

### Response

```json
{
  "bank_code": "000017",
  "account_number": "0123456789",
  "account_name": "ADEYEMI OLUWASEUN K"
}
```

### Rules

- Account numbers must be exactly 10 digits.
- An invalid bank code, unknown account, or failed provider verification returns `ACCOUNT_NOT_RESOLVED` (422).
- In sandbox, account number `0000000404` deterministically returns `ACCOUNT_NOT_RESOLVED`.

### Notes

Name enquiry is **informational**. Shore does not gate payout creation on it and does not return an account name in the payout object. Call it before presenting your own payout confirmation screen.
