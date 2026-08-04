---
title: Quickstart
description: Provisioning and the recommended integration order.
sidebar_position: 2
---

# Quickstart

## Provisioning

Merchant and API-business creation is an internal Shore process. You cannot self-create an API business through the public API.

Shore provisions:

- the API business;
- the NGN fiat configuration;
- the business vault;
- fee assignments;
- any approved credit limit;
- the `fiat_rails` entitlement; and
- the live entitlement after approval.

## Integration order

Once you have a business/storefront identifier:

1. Issue a **test API key** with the scopes you need — [Dashboard: keys and live-readiness](../api/dashboard-keys.md)
2. Configure and verify a **webhook endpoint** — [Webhook endpoints](../api/webhook-endpoints.md)
3. **List banks** and test **name enquiry** — [Banks](../api/banks.md)
4. **Issue a customer sub-account** — [Virtual accounts](../api/virtual-accounts.md)
5. **Simulate an inbound deposit** — [Sandbox endpoints](../api/sandbox.md)
6. Verify **balances** and **transactions** — [Balances](../api/balances.md), [Transactions](../api/transactions.md)
7. Create payouts for **success, failure, and reversal** outcomes — [Payouts](../api/payouts.md)
8. Verify webhook **signatures, deduplication, and redelivery** — [Webhook events](../api/webhook-events.md)
9. Reconcile a **closed statement** when historical test data exists — [Statements](../api/statements.md)
10. Work through the [sandbox test plan](../guides/sandbox-test-plan.md) and the [go-live checklist](../guides/go-live-checklist.md)

## Minimum reading before writing code

- [Environments](./environments.md) — the `/v1` vs `/api/v1` distinction
- [Request signing](./request-signing.md) — raw-byte HMAC rules
- [Idempotency](./idempotency.md) — one key per business intent
