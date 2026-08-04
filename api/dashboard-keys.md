---
title: "Dashboard: keys and live-readiness"
description: Merchant-JWT routes for API key lifecycle and go-live checks.
sidebar_position: 10
---

# Dashboard: keys and live-readiness

These routes use the **merchant dashboard JWT**, not a Fiat Rails API key, and are available to an authenticated merchant **OWNER** or **ADMIN** for a business belonging to that merchant.

```text
POST   /api/v1/fiat-rails/storefronts/{storefrontId}/keys
GET    /api/v1/fiat-rails/storefronts/{storefrontId}/keys
POST   /api/v1/fiat-rails/storefronts/{storefrontId}/keys/{keyId}/rotate
DELETE /api/v1/fiat-rails/storefronts/{storefrontId}/keys/{keyId}
GET    /api/v1/fiat-rails/storefronts/{storefrontId}/live-readiness
```

Note the `/api/v1` prefix — public money APIs do **not** use it. See [Environments](../getting-started/environments.md).

---

## Issue a key

```http
POST /api/v1/fiat-rails/storefronts/{storefrontId}/keys
Authorization: Bearer <merchant-dashboard-jwt>
Content-Type: application/json
```

```json
{
  "environment": "test",
  "scopes": ["fiat:read", "fiat:payouts", "fiat:accounts:issue", "fiat:webhooks"],
  "ipAllowlist": ["203.0.113.10/32"],
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

The response includes `apiKey` and `signingSecret`, both shown **once**. Scopes, allowlists, limits, and rotation strategy are covered in [Authentication](../getting-started/authentication.md).

## List, rotate, revoke

- **List** returns key metadata including `last_used_at` and expiry. Secrets are never returned.
- **Rotate** revokes the selected key and immediately issues replacement credentials with the same environment, scopes, allowlist, and expiry.
- **Delete** revokes a key.

At most two unexpired active keys exist per business per environment.

---

## Live readiness

```http
GET /api/v1/fiat-rails/storefronts/{storefrontId}/live-readiness
Authorization: Bearer <merchant-dashboard-jwt>
```

Returns `ready` plus a set of `PASS`/`FAIL` checks. Implemented checks:

- Production deployment
- Active API business
- Fiat Rails and live entitlements
- Approved merchant KYB and ownership relationship
- Active NGN deposit and payout configuration
- An active provider-backed vault
- Healthy and safely recoverable deposit and payout providers
- Resolvable deposit and payout fees
- Available BVN and NIN verification providers
- Capacity for another live API key

Live key issuance fails with `LIVE_NOT_READY` (503) until every required check passes.

See the [go-live checklist](../guides/go-live-checklist.md).
