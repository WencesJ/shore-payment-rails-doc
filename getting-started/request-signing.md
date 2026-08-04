---
title: Request signing
description: Which requests require HMAC signing and how to construct the signature.
sidebar_position: 5
---

# Request signing

## What must be signed

State-changing public operations require an HMAC signature:

- `POST /v1/virtual-accounts`
- `POST /v1/payouts`
- `POST /v1/test/deposits`
- `POST /v1/webhooks`
- `DELETE /v1/webhooks/{id}`
- `POST /v1/webhooks/{id}/rotate-secret`
- `POST /v1/webhooks/{id}/redeliver`

GET requests are not signed. `POST /v1/banks/resolve` is a stateless read-like utility: it requires the bearer key and `fiat:read`, but **not** HMAC signing or an idempotency key.

## Headers

```http
X-Shore-Timestamp: 1785844800
X-Shore-Signature: v1=<lowercase-hex-hmac>
```

## Canonical value

```text
timestamp + "." + uppercase_method + "." + exact_request_target + "." + raw_body
```

Example:

```text
1785844800.POST./v1/payouts.{"destination":{"bank_code":"000017","account_number":"0123456789"},"amount":"25000","asset":"NGN","reference":"wd-0042"}
```

Compute a hexadecimal HMAC-SHA256 with the key's `signingSecret` and prefix it with `v1=`.

## Rules that trip people up

- `exact_request_target` starts at `/v1` and includes the exact query string when one exists.
- Sign the **exact bytes sent over the wire**. Do not parse and re-serialize JSON between signing and transmission.
- Use Unix **seconds**, not milliseconds.
- The timestamp must be within **300 seconds** of Shore's clock, otherwise `TIMESTAMP_OUT_OF_RANGE`.
- On the receiving side, compare webhook signatures in constant time.

## Node.js example

```js
import { createHmac, randomUUID } from 'node:crypto';

const timestamp = Math.floor(Date.now() / 1000).toString();
const method = 'POST';
const requestTarget = '/v1/payouts';
const rawBody = JSON.stringify(payload);
const canonical = `${timestamp}.${method}.${requestTarget}.${rawBody}`;
const signature = createHmac('sha256', process.env.SHORE_SIGNING_SECRET)
  .update(canonical, 'utf8')
  .digest('hex');

const headers = {
  Authorization: `Bearer ${process.env.SHORE_API_KEY}`,
  'Content-Type': 'application/json',
  'Idempotency-Key': randomUUID(),
  'X-Shore-Timestamp': timestamp,
  'X-Shore-Signature': `v1=${signature}`,
};

// send rawBody itself — not a re-serialized object
```

## When signing fails

`SIGNATURE_INVALID` (401) means rebuild the signature from raw bytes. It does **not** mean create a new business intent — reuse the same idempotency key and payout reference.

Inbound webhook signatures use a **different, simpler** canonical value. See [Webhook events and delivery](../api/webhook-events.md#signature-verification).
