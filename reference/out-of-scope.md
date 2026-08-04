---
title: Out of scope in v1
description: Capabilities intentionally not part of the current public API.
sidebar_position: 4
---

# Out of scope in v1

The following are intentionally outside the current public v1 capability:

- Merchant self-service business creation
- Merchant self-service fee or credit-limit configuration
- Multi-currency processing beyond NGN
- Trading, crypto, custody, or rate conversion
- Shore-managed per-customer balances
- A customer login or customer-facing Shore interface
- Payout cancellation after acceptance
- Public virtual-account closure or KYC update
- Public deposit-by-ID retrieval
- A public fee quote endpoint
- A `country` filter on the bank-list endpoint
- Emission of the reserved `balance.threshold` webhook event
- Automatic compensation after a payout reached `SUCCESS` and is later reversed by a provider
- Automatic ledger correction for a deposit reversal, duplicate bank report, chargeback, or post-settlement correction

The last two cases generate critical internal reconciliation attention rather than an automatic, unapproved ledger mutation. Agree a manual incident and accounting process with Shore before live launch — see [Reconciliation](../guides/reconciliation.md#manual-intervention-cases).
