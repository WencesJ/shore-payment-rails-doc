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
  "virtual_account_id": "f8f6b83f-74b9-4144-8662-af78a0cb8920",
  "amount": "100000.00",
  "asset": "NGN"
}
```

### Notes

- Drives the same normalized deposit, ledger, transaction, balance, and webhook path used by real provider deposits.
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
