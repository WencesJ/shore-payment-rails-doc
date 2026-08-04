---
title: Reconciliation
description: Daily checks, monthly close, and cases needing manual intervention.
sidebar_position: 5
---

# Reconciliation

## Real-time operations

Use webhooks for low-latency notification, then read APIs for confirmation:

```text
Webhook -> verify -> deduplicate -> persist -> acknowledge 2xx
        -> fetch/reconcile Shore state -> update merchant ledger/workflow
```

## Daily

Compare, at minimum:

- Merchant deposit records against `deposit` transactions
- Accepted payouts against hold and terminal transactions
- Terminal payout state against webhook records
- Pool `available` and `locked` totals against expected operations
- Every `RETRYING` or `EXHAUSTED` webhook delivery
- Long-running `PROCESSING` or `EXECUTED` payouts

## Monthly close

1. Retrieve the immutable [monthly statement](../api/statements.md).
2. Retrieve [line-item transactions](../api/transactions.md) for the period.
3. Compare deposit, payout, and fee totals.
4. Record any approved manual reconciliation items.
5. Retain Shore IDs, merchant references, bank references, and correlation IDs as evidence.

## Manual-intervention cases

Shore does **not** automatically mutate the ledger for:

- A payout that reached `SUCCESS` and is later reversed by a provider
- A deposit reversal, duplicate bank report, chargeback, or post-settlement correction

These raise critical internal reconciliation attention instead. Agree a manual incident and accounting process with Shore **before** live launch.
