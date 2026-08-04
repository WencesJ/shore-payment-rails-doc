---
title: Authentication
description: Bearer credentials, scopes, IP allowlists, key limits, and rotation.
sidebar_position: 4
---

# Authentication

## Bearer credential

Every public `/v1` request requires:

```http
Authorization: Bearer sk_test_...
```

The key identifies the business. **No public request accepts a merchant or storefront identifier in place of the key.**

## Scopes

| Scope | Grants |
| --- | --- |
| `fiat:read` | Balances, transactions, statements, bank list, name enquiry, payout reads, virtual-account reads |
| `fiat:payouts` | Create payouts |
| `fiat:accounts:issue` | Issue customer sub-accounts; create sandbox deposits |
| `fiat:webhooks` | Create, list, delete, rotate, inspect, and redeliver webhooks |

Use separate keys for separate workloads. A reporting job usually needs only `fiat:read`; a payout service needs `fiat:payouts` and normally `fiat:read`.

A key lacking the required scope returns `SCOPE_MISSING` (403).

## IP allowlists and expiry

A key may be restricted to IPv4/IPv6 addresses and CIDR blocks. When an allowlist exists, requests from any other source are rejected as `UNAUTHORIZED`.

Expiry, if set, must be in the future. Expired credentials no longer authenticate.

## Key limits

At most **two unexpired active keys per business per environment**.

## Rotation

The `rotate` endpoint revokes the selected key and immediately creates replacement credentials with the same environment, scopes, allowlist, and expiry. Use it when immediate replacement is acceptable.

For a zero-downtime rollout, prefer:

1. Issue a second active key.
2. Deploy it to all callers.
3. Verify its `last_used_at` through the key list.
4. Revoke the old key.

## Secrets returned at issuance

Issuance and rotation return two secrets:

- `apiKey` — the bearer credential;
- `signingSecret` — used to sign mutating requests ([Request signing](./request-signing.md)).

Both are shown **once** and are never returned by key-listing calls. Store them in a secret manager immediately.

Issuance, listing, rotation, and revocation are documented in [Dashboard: keys and live-readiness](../api/dashboard-keys.md).
