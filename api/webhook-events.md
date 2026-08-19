---
title: Webhook events and delivery
description: Event envelope, catalogue, signature verification, retries, and redelivery.
sidebar_position: 8
---

# Webhook events and delivery

Webhooks notify you after money-state changes commit. **Delivery is at least once and ordering is not guaranteed.** They reduce polling latency but do not replace read APIs or reconciliation.

## Envelope

```json
{
  "id": "evt_<event-id>",
  "type": "deposit.received",
  "created_at": "2026-08-04T12:00:00.000Z",
  "livemode": false,
  "data": {}
}
```

Use the envelope `id` as your deduplication key.

## Event catalogue

| Event | Emitted when | Key data |
| --- | --- | --- |
| `deposit.received` | Deposit ledger allocation and settlement commit | Deposit ID, VA ID, owner type, external ref, gross, fee, net, asset, bank reference |
| `payout.success` | Payout settlement commits | Payout fields and bank session reference |
| `payout.failed` | Pre-settlement hold release commits after failure | Payout fields and failure code |
| `payout.reversed` | Pre-settlement hold release commits after reversal | Payout fields |
| `balance.threshold` | **Reserved value — no emission path implemented** | Poll [`GET /v1/balances`](./balances.md) instead |

Endpoint validation currently accepts `balance.threshold`, but do not depend on receiving it until Shore confirms activation.

### `deposit.received` data

```json
{
  "id": "<deposit-id>",
  "status": "SETTLED",
  "virtual_account_id": "<virtual-account-id>",
  "owner_type": "SUB_ACCOUNT",
  "external_ref": "customer-001",
  "gross": "100000",
  "fee": "100",
  "net": "99900",
  "asset": "NGN",
  "bank_reference": "<provider-reference>",
  "virtual_account_number": "9012345678",
  "sender_name": "ADA LOVELACE",
  "sender_account_number": "0123456789",
  "sender_bank_name": "Example Bank",
  "sender_bank_code": "000017"
}
```

`virtual_account_number` is the account the payer credited. The four `sender_*` fields are the payer details exactly as the bank reported them, and any of them is `null` when the provider omits it — treat them as advisory, never as an authorisation signal. In sandbox the simulator reports `SANDBOX PAYER` on account `0000000001` at `Sandbox Bank` so the fields are exercised end to end.

For a vault deposit, `owner_type` is `MERCHANT` and `external_ref` is `null`.

`status` is always `SETTLED`. The event is written inside the same transaction that posts the ledger journal, so a `deposit.received` never exists for a deposit that did not settle — there is no failure counterpart for deposits the way payouts have `payout.failed` and `payout.reversed`.

## Signature verification

Every delivery includes:

```http
X-Shore-Timestamp: <unix-seconds>
X-Shore-Signature: v1=<hex-hmac>
```

The canonical value is **simpler than outbound API signing**:

```text
timestamp + "." + raw_request_body
```

Procedure:

1. Capture the raw request body **before** JSON parsing.
2. Compute HMAC-SHA256 with the endpoint's `whsec_...` secret.
3. Compare supplied and computed hex values in **constant time**.
4. Reject timestamps more than 300 seconds from the receiver's clock.
5. Skip business processing when the event ID was already committed.
6. Return 2xx within 10 seconds.

Persist the event before triggering slower work. Acknowledge quickly, process asynchronously.

## Retries

Any non-2xx response, timeout, TLS error, connection error, or security validation failure counts as a failed attempt.

Shore performs up to **six attempts** — the initial attempt plus jittered delays of approximately:

```text
1 minute -> 5 minutes -> 15 minutes -> 30 minutes -> 1 hour
```

After the sixth failure the event/endpoint delivery becomes `EXHAUSTED`. The event itself is retained.

---

## `GET /v1/webhook-events`

| | |
| --- | --- |
| Scope | `fiat:webhooks` |
| Signed | No |
| Idempotency key | No |

### Query parameters

| Parameter | Notes |
| --- | --- |
| `status` | e.g. `EXHAUSTED`, `RETRYING` |
| `page`, `page_size` | See [pagination](../getting-started/conventions.md#pagination) |

```http
GET /v1/webhook-events?status=EXHAUSTED&page=1&page_size=50
Authorization: Bearer <api-key>
```

```json
{
  "id": "<event-id>",
  "type": "payout.success",
  "created_at": "2026-08-04T12:00:00.000Z",
  "deliveries": [
    {
      "endpoint_id": "<endpoint-id>",
      "status": "EXHAUSTED",
      "attempts": 6,
      "last_response_status": 503,
      "last_error": "HTTP 503",
      "next_retry_at": null
    }
  ]
}
```

`last_error` carries the reason for the most recent failed attempt. When `last_response_status` is `null` the request never reached your endpoint at all — the message names the cause, and the common ones are:

| `last_error` | Meaning |
| --- | --- |
| `Webhook URL resolves to a forbidden address` | The hostname resolved to a loopback, private, or link-local address |
| `Webhook hostname could not be resolved` | DNS returned no answer for the hostname |
| `Webhook URL must be HTTPS without credentials` | Scheme is not `https`, or the URL embeds a username or password |
| `ENOTFOUND` / `ETIMEDOUT` / `ECONNREFUSED` | The connection could not be established |
| `HTTP <status>` | Your endpoint responded with a non-2xx status |

---

## `POST /v1/webhooks/{endpointId}/redeliver`

| | |
| --- | --- |
| Scope | `fiat:webhooks` |
| Signed | Yes |
| Idempotency key | Yes |

```json
{ "event_id": "<event-id>" }
```

Starts a fresh delivery cycle. Because redelivery can deliver an event you already processed, **event-ID deduplication is mandatory**.

> **ID formats differ.** The delivered envelope uses a display ID prefixed with `evt_`. The event-list API returns the underlying UUID, and redelivery validates that UUID. Use the exact `id` from `GET /v1/webhook-events` when requesting redelivery; use the full prefixed envelope ID for merchant-side deduplication.
