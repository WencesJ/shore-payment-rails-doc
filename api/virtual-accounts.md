---
title: Virtual accounts
description: The business vault and customer sub-accounts.
sidebar_position: 5
---

# Virtual accounts

Two kinds of account live under this resource:

| | Business vault | Customer sub-account |
| --- | --- | --- |
| `owner_type` | `MERCHANT` | `SUB_ACCOUNT` |
| `external_ref` | `null` | Your customer key |
| Created by | Shore, at provisioning | You, via `POST /v1/virtual-accounts` |
| Purpose | Treasury prefunding | Deposit attribution |

The vault cannot be created or closed through the public API.

---

## `POST /v1/virtual-accounts`

| | |
| --- | --- |
| Scope | `fiat:accounts:issue` |
| Signed | Yes |
| Idempotency key | Yes |

### Request

```http
POST /v1/virtual-accounts
Authorization: Bearer <api-key>
Idempotency-Key: customer-001-va-v1
X-Shore-Timestamp: <unix-seconds>
X-Shore-Signature: v1=<signature>
Content-Type: application/json
```

```json
{
  "external_ref": "customer-001",
  "kyc": {
    "bvn": "22222222222",
    "nin": "11111111111",
    "first_name": "Ada",
    "last_name": "Lovelace"
  }
}
```

### Validation

| Field | Rule |
| --- | --- |
| `external_ref` | Required, max 128 characters |
| `kyc.bvn` | Exactly 11 digits |
| `kyc.nin` | Exactly 11 digits |
| `kyc.first_name`, `kyc.last_name` | Required, max 100 characters each |

### Response

```json
{
  "id": "f8f6b83f-74b9-4144-8662-af78a0cb8920",
  "owner_type": "SUB_ACCOUNT",
  "account_type": "DEDICATED",
  "status": "ACTIVE",
  "external_ref": "customer-001",
  "account_number": "9876543210",
  "account_name": "ACME/ADA LOVELACE",
  "bank_name": "Example Bank",
  "bank_code": "000017"
}
```

### Verification

Shore verifies both BVN and NIN, and they must resolve to the same identity. The verified provider identity is authoritative — submitted names are not trusted as the final legal identity.

### Get-or-create semantics

- If the business already has an active account for that `external_ref`, the existing account is returned.
- A retry for an in-progress provisioning intent stays pinned to the original provider and reference.
- If an unfinished intent is already bound to a different verified identity, the request is rejected with `KYC_MISMATCH`.

### Errors

| Code | HTTP | Cause |
| --- | ---: | --- |
| `KYC_INVALID` | 422 | BVN or NIN did not verify |
| `KYC_MISMATCH` | 422 | BVN and NIN identities differ, or the intent is bound elsewhere |
| `IDENTITY_PROVIDER_UNAVAILABLE` | 503 | Identity provider temporarily unavailable; retry same idempotency key |

> Treat `external_ref` as an **immutable** merchant-side customer key mapping to exactly one internal customer identity. Do not use repeated issuance to update KYC — there is no public KYC-update or account-closure operation in v1.

---

## `GET /v1/virtual-accounts`

| | |
| --- | --- |
| Scope | `fiat:read` |
| Signed | No |
| Idempotency key | No |

### Query parameters

| Parameter | Notes |
| --- | --- |
| `external_ref` | Filter to one customer key |
| `page`, `page_size` | See [pagination](../getting-started/conventions.md#pagination) |

```http
GET /v1/virtual-accounts?external_ref=customer-001&page=1&page_size=50
Authorization: Bearer <api-key>
```

### Finding the business vault

List accounts and select the entry with:

```json
{ "owner_type": "MERCHANT", "account_type": "DEDICATED", "external_ref": null }
```

---

## `GET /v1/virtual-accounts/{id}`

| | |
| --- | --- |
| Scope | `fiat:read` |
| Signed | No |
| Idempotency key | No |

Returns a single account. An ID owned by another business returns the same not-found behavior as an absent resource.

See [Deposits and customer crediting](../guides/deposits-and-crediting.md).
