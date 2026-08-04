---
title: Fees
description: Fee models, when fees are frozen, and how they surface.
sidebar_position: 3
---

# Fees

Fees are configured by Shore using schedules selected by asset, direction, and amount. A business-specific schedule may override the platform default.

## Supported models

- Flat amount
- Rate in basis points, optionally capped

## How fees surface

| Direction | Behavior |
| --- | --- |
| Payout | Resolved and **frozen at acceptance**, returned as `fee` in the payout object; an additional debit on top of the principal |
| Deposit | Reported after settlement as `gross`, `fee`, and `net` in the `deposit.received` event |

## Limitations

- There is **no public fee-quote or fee-configuration endpoint**.
- `FEE_SCHEDULE_UNRESOLVED` (503) means Shore's configuration cannot quote the transaction. Retry with the same idempotency key once resolved.
- Agree commercial pricing during onboarding. Do not infer production pricing from sandbox fixtures.
