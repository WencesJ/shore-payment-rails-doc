---
title: Deposits and customer crediting
description: Prefunding the pool, customer deposit flow, and the merchant ledger rule.
sidebar_position: 1
---

# Deposits and customer crediting

## Prefunding the pool (vault deposits)

1. Your treasury transfers NGN from its bank account to the vault.
2. Shore receives and verifies the provider notification.
3. Shore applies the configured deposit fee.
4. If the business has drawn credit, the deposit's net amount repays that credit first.
5. Any remainder becomes available for payouts.
6. Shore emits `deposit.received` with `owner_type: MERCHANT`, `external_ref: null`.

Locate the vault via [`GET /v1/virtual-accounts`](../api/virtual-accounts.md#finding-the-business-vault). Use the [balance API](../api/balances.md) — not the bank's view of the vault — as the operational source of truth.

## Customer deposits

1. The customer transfers NGN to their sub-account.
2. Shore verifies and deduplicates the provider notification.
3. Shore freezes and charges the configured deposit fee.
4. The net amount repays drawn business credit first.
5. Any remainder increases available balance.
6. The deposit settles.
7. Shore creates and delivers `deposit.received`.

Allocation is atomic. **Never compute pool availability by summing webhook amounts locally** without reconciling against the balance API.

## Crediting your customer

A recommended customer-ledger transaction:

```text
unique key: Shore event ID or deposit ID
customer:   lookup by external_ref
amount:     the amount your commercial policy credits
evidence:   event ID, deposit ID, VA ID, gross, fee, net, bank reference
```

Whether you credit `gross` or `net` to your customer is your product decision. Shore's pool receives the result of Shore's configured fee and credit-repayment policy.

Before any consequential or irreversible action, reconcile the event against [`GET /v1/transactions`](../api/transactions.md) and [`GET /v1/balances`](../api/balances.md).

## Post-settlement corrections

Shore does not automatically correct the ledger for a deposit reversal, duplicate bank report, chargeback, or post-settlement correction. See [Reconciliation → manual-intervention cases](./reconciliation.md#manual-intervention-cases).
