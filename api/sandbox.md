---
title: Sandbox endpoints
description: Simulate deposits and force deterministic payout outcomes.
sidebar_position: 9
---

# Sandbox endpoints

The sandbox uses provider simulators — no real money and no real bank account issuance.

## `POST /v1/test/deposits`

| | |
| --- | --- |
| Scope | `fiat:accounts:issue` |
| Signed | Yes |
| Idempotency key | Yes |

### Request

```http
POST /v1/test/deposits
Authorization: Bearer sk_test_...
Idempotency-Key: <stable-key>
X-Shore-Timestamp: <unix-seconds>
X-Shore-Signature: v1=<signature>
Content-Type: application/json
```

```json
{
  "account_number": "9876543210",
  "amount": "100000.00",
  "asset": "NGN"
}
```

### Addressing the account

| Field | | |
| --- | --- | --- |
| `account_number` | string, `^[0-9]{10}$` | The account number returned by [`POST /v1/virtual-accounts`](./virtual-accounts.md) — the same number a real payer transfers to. |
| `virtual_account_id` | uuid, **deprecated** | Retained for integrations built against the original contract. Prefer `account_number`. |

Supply exactly one of the two. Sending both or neither returns a validation error.

The account must be `ACTIVE` and belong to the calling business. An account number outside your business returns `NOT_FOUND` (404) — it is not distinguishable from a number that does not exist, by design.

### Notes

- Drives the same normalized deposit, ledger, transaction, balance, and webhook path used by real provider deposits. Addressing by account number is how a real provider webhook resolves an inbound credit, so the sandbox exercises the same resolution your live traffic will.
- Live credentials receive `SANDBOX_ONLY` (503).
- There is **no public live "create deposit" endpoint** — a live deposit begins with a real bank transfer.
- Ensure test-deposit code cannot be invoked by the production workflow.

## Deterministic outcomes

| Trigger | Result |
| --- | --- |
| Payout amount ending in `.01` | `FAILED` |
| Payout amount ending in `.02` | Pre-settlement `REVERSED` |
| Other valid payout amounts | `SUCCESS` after a short delay |
| Name enquiry on account `0000000404` | `ACCOUNT_NOT_RESOLVED` |

Duplicate-window rules still apply in sandbox. Use new references and idempotency keys for new test intents, and vary destination or amount unless intentionally testing `allow_duplicate`.

See the [sandbox test plan](../guides/sandbox-test-plan.md).
