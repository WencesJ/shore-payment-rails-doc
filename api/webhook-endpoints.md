---
title: Webhook endpoints
description: Create, list, delete, and rotate the secret for webhook endpoints.
sidebar_position: 7
---

# Webhook endpoints

## `POST /v1/webhooks`

| | |
| --- | --- |
| Scope | `fiat:webhooks` |
| Signed | Yes |
| Idempotency key | Yes |

### Request

```http
POST /v1/webhooks
Authorization: Bearer <api-key>
Idempotency-Key: primary-webhook-v1
X-Shore-Timestamp: <unix-seconds>
X-Shore-Signature: v1=<signature>
Content-Type: application/json
```

```json
{
  "url": "https://payments.example.com/webhooks/shore",
  "enabled_events": ["deposit.received", "payout.success", "payout.failed", "payout.reversed"]
}
```

Use `"*"` to subscribe to every supported event. See the [event catalogue](./webhook-events.md#event-catalogue).

The response includes a `whsec_...` secret, returned **once**. Ordinary endpoint listing does not return it. Store it in a secret manager immediately, separately from API signing secrets.

### Endpoint security rules

- HTTPS only.
- No credentials embedded in the URL.
- Hostname must resolve.
- Loopback, private, link-local, carrier-grade NAT, multicast, and other forbidden ranges are rejected.
- DNS is checked again and pinned for delivery.
- Redirects are not followed.
- Response timeout is 10 seconds.
- Request and response body limits protect the delivery worker.

---

## `GET /v1/webhooks`

| | |
| --- | --- |
| Scope | `fiat:webhooks` |
| Signed | No |
| Idempotency key | No |

Lists active endpoints. Secrets are not included.

---

## `DELETE /v1/webhooks/{id}`

| | |
| --- | --- |
| Scope | `fiat:webhooks` |
| Signed | Yes |
| Idempotency key | No |

Disables and soft-deletes the endpoint.

---

## `POST /v1/webhooks/{id}/rotate-secret`

| | |
| --- | --- |
| Scope | `fiat:webhooks` |
| Signed | Yes |
| Idempotency key | Yes |

Replaces the signing secret and returns the new secret once. Coordinate rotation so the receiver can validate with the new secret immediately.

See [Webhook implementation](../guides/webhook-implementation.md).
