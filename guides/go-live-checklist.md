---
title: Go-live checklist
description: Product, engineering, security, and activation acceptance criteria.
sidebar_position: 9
---

# Go-live checklist

## Product and operations

- [ ] Customer crediting policy for deposit `gross` versus `net` is approved.
- [ ] Payout authorization and confirmation UX is approved.
- [ ] Duplicate-payout review procedure is documented.
- [ ] Long-running payout escalation procedure is documented.
- [ ] Deposit-correction and post-success-reversal manual procedures are agreed with Shore.
- [ ] Finance understands pool, locked funds, fees, and optional credit.

## Engineering

- [ ] All [sandbox scenarios](./sandbox-test-plan.md) pass.
- [ ] Every durable POST uses a stable idempotency key.
- [ ] All required writes use correct raw-body HMAC signing.
- [ ] Customer `external_ref` values are immutable and unique in your domain.
- [ ] Payout references are globally unique within the Shore business.
- [ ] Webhooks are verified, deduplicated, persisted, and processed asynchronously.
- [ ] Reconciliation jobs use balances, transactions, statements, and delivery status.
- [ ] Test-deposit code cannot be invoked by the production workflow.

## Security

- [ ] Production keys have minimum scopes.
- [ ] IP allowlists are configured where possible.
- [ ] Secrets are in a managed secret store.
- [ ] Rotation and revocation have been rehearsed.
- [ ] Logs and traces exclude credentials and raw identity numbers.
- [ ] Merchant and webhook servers have synchronized clocks.

## Live activation

- [ ] Merchant KYB is approved.
- [ ] Shore's live entitlement is granted.
- [ ] The [live-readiness endpoint](../api/dashboard-keys.md#live-readiness) returns `ready: true`.
- [ ] A live key is issued and stored securely.
- [ ] The production webhook endpoint is registered and verified.
- [ ] A controlled low-value deposit and payout are reconciled end to end.
