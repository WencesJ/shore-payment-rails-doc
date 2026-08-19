---
title: Sandbox test plan
description: Scenarios to pass before requesting live credentials.
sidebar_position: 6
---

# Sandbox test plan

The sandbox uses provider simulators — no real money and no real bank account issuance. Endpoint details are in [Sandbox endpoints](../api/sandbox.md).

## Scenarios

1. Issue a sub-account, then replay the identical idempotent request.
2. Attempt the same idempotency key with a changed body → `IDEMPOTENCY_KEY_REUSED`.
3. Simulate a deposit against a sub-account's `account_number`; verify webhook, balance, and transaction.
4. Create a successful payout and wait for `payout.success`.
5. Create a failed payout (amount ending `.01`) and verify hold release.
6. Create a pre-settlement reversal (amount ending `.02`) and verify hold release.
7. Trigger duplicate-window protection → `DUPLICATE_SUSPECTED`.
8. Verify `allow_duplicate: true` with a new reference.
9. Make a webhook endpoint fail until `EXHAUSTED`, then redeliver.
10. Rotate webhook and API credentials.
11. Confirm a resource from another business returns not found.
12. Exercise rate-limit and signature failures.

## Constraints

- Duplicate-window rules still apply. Use new references and idempotency keys for new test intents, and vary destination or amount unless intentionally testing `allow_duplicate`.
- Name enquiry on account `0000000404` returns `ACCOUNT_NOT_RESOLVED`.
- Statements are only available for closed months, so scenario coverage depends on historical test data.
