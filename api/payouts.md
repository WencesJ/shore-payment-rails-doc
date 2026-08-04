---
title: Payouts
description: Send NGN to a Nigerian bank account, and manage payout lifecycle.
sidebar_position: 6
---

# Payouts

## Trust boundary

Payout creation is **instruction-agnostic**: Shore faithfully executes the bank destination and amount you supply. Shore does not know whether your end user approved the withdrawal.

You must authenticate the customer, enforce your own risk and balance rules, display the beneficiary where appropriate, and obtain final confirmation before calling Shore.

---

## `POST /v1/payouts`

| | |
| --- | --- |
| Scope | `fiat:payouts` |
| Signed | Yes |
| Idempotency key | Yes |

### Request

```http
POST /v1/payouts
Authorization: Bearer <api-key>
Idempotency-Key: 99759bbb-f454-4c67-b47a-2d72e336cf9d
X-Shore-Timestamp: <unix-seconds>
X-Shore-Signature: v1=<signature>
Content-Type: application/json
```

```json
{
  "destination": {
    "bank_code": "000017",
    "account_number": "0123456789"
  },
  "amount": "25000.00",
  "asset": "NGN",
  "reference": "withdrawal-20260804-0042",
  "narration": "Customer withdrawal",
  "allow_duplicate": false
}
```

### Validation

| Field | Rule |
| --- | --- |
| `amount` | Positive decimal string; configured minimum and maximum apply |
| `asset` | `NGN` only |
| `destination.account_number` | Exactly 10 digits |
| `destination.bank_code` | Must exist in the active [bank list](./banks.md) |
| `reference` | Required, unique per business, max 128 characters |
| `narration` | Optional, max 100 characters |
| `allow_duplicate` | Optional; bypasses only the duplicate window |

### Response

```json
{
  "id": "<payout-id>",
  "status": "PENDING",
  "amount": "25000",
  "fee": "62.5",
  "asset": "NGN",
  "destination": {
    "bank_code": "000017",
    "account_number": "0123456789"
  },
  "reference": "withdrawal-20260804-0042",
  "created_at": "2026-08-04T12:00:00.000Z"
}
```

The beneficiary receives the **full `amount`**. The `fee` is an additional debit to the business pool.

### Acceptance semantics

Acceptance is financially atomic:

1. Validate key, scope, signature, input, provider, and business configuration.
2. Validate the merchant reference and duplicate window.
3. Resolve and freeze the payout fee.
4. Reserve principal plus fee from available balance and optional credit.
5. Persist the payout and the exact funding split.
6. Enqueue provider submission.

If the hold cannot be posted, no payout is accepted and no funds remain locked.

### Errors

| Code | HTTP | Cause |
| --- | ---: | --- |
| `DUPLICATE_REFERENCE` | 409 | Reference already belongs to another request |
| `DUPLICATE_SUSPECTED` | 409 | Matching payout inside the duplicate window |
| `AMOUNT_BELOW_MINIMUM` | 422 | Below business configuration |
| `AMOUNT_ABOVE_MAXIMUM` | 422 | Above business configuration |
| `INSUFFICIENT_AVAILABLE_BALANCE` | 422 | Available plus credit cannot cover principal and fee |
| `FEE_SCHEDULE_UNRESOLVED` | 503 | Fee configuration cannot quote the transaction |

---

## Statuses

| Status | Meaning | Your action |
| --- | --- | --- |
| `PENDING` | Accepted and held; queued for submission | Wait for webhook or poll |
| `PROCESSING` | Submission or uncertain-outcome reconciliation underway | **Do not retry as a new payout** |
| `EXECUTED` | Provider accepted the instruction; final status pending | Continue waiting |
| `SUCCESS` | Provider success confirmed; principal and fee settled | Mark the instruction complete |
| `FAILED` | Pre-settlement failure confirmed; hold released | Mark failed; decide whether the customer may retry |
| `REVERSED` | Pre-settlement reversal confirmed; hold released | Mark reversed and reconcile |

There is **no cancel endpoint** in v1. An accepted payout proceeds to a terminal outcome.

---

## Duplicate protections

Three independent protections:

1. **`Idempotency-Key`** — prevents duplicate HTTP processing of the same serialized request.
2. **`reference`** — must be unique for the business (`DUPLICATE_REFERENCE`).
3. **Duplicate fingerprint** — same bank, account number, amount, and asset within the configured window, default **300 seconds** (`DUPLICATE_SUSPECTED`).

`allow_duplicate: true` bypasses **only** the short duplicate window. It does not permit a reused `reference` or a conflicting idempotency key. Use it only after your system has established that two economically distinct payouts intentionally share a destination and amount.

---

## Uncertain provider outcomes

If Shore loses a provider response after submission, the payout stays `PROCESSING`, the hold stays intact, and Shore queries by the stable submission reference. **Shore does not blindly create another bank transfer.**

Do not create a replacement payout merely because a payout remains `PROCESSING`. Escalate long-running processing states through the agreed support channel, preserving the original payout ID and reference.

---

## `GET /v1/payouts`

| | |
| --- | --- |
| Scope | `fiat:read` |
| Signed | No |
| Idempotency key | No |

### Query parameters

| Parameter | Notes |
| --- | --- |
| `status` | Any status value above |
| `page`, `page_size` | See [pagination](../getting-started/conventions.md#pagination) |

```http
GET /v1/payouts?status=PROCESSING&page=1&page_size=50
Authorization: Bearer <api-key>
```

## `GET /v1/payouts/{id}`

| | |
| --- | --- |
| Scope | `fiat:read` |
| Signed | No |
| Idempotency key | No |

Only API-origin payouts for the authenticated business are returned.
