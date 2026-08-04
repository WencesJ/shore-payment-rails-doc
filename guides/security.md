---
title: Security checklist
description: Credential, signing, and logging practices.
sidebar_position: 8
---

# Security checklist

- Keep API and signing secrets only in a server-side secret manager.
- Never call Shore directly from a browser or mobile application with a business API key.
- Use minimum required scopes.
- Use IP allowlists for fixed server egress addresses.
- Maintain accurate system clocks on both API callers and webhook receivers.
- Sign exact raw request bytes.
- Never reuse one idempotency key across business intents.
- Treat payout references as durable unique identifiers.
- Store webhook secrets separately from API signing secrets.
- Verify webhook HMAC before parsing or acting.
- Deduplicate webhook event IDs in a database transaction.
- Return webhook 2xx quickly and process asynchronously.
- Refresh the supported-bank list instead of trusting stale static data.
- Mask customer bank and identity data in application logs.
- Monitor key `last_used_at`, expiration, and unexpected source-IP failures.
- Revoke credentials immediately after suspected exposure.

Never log API keys, signing secrets, webhook secrets, BVNs, NINs, or full raw identity payloads. Do log Shore's `correlationId` alongside your idempotency key, business reference, and resource ID.
