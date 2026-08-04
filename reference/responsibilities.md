---
title: Responsibility split
description: What Shore owns, what the merchant owns, and what Shore does not model.
sidebar_position: 3
---

# Responsibility split

## Shore is responsible for

- Provider-neutral bank connectivity
- Virtual-account provisioning
- Verification of BVN and NIN supplied for sub-account issuance
- Pooled double-entry accounting
- Deposit fee allocation
- Payout fee freezing, holds, settlement, and pre-settlement release
- Safe payout submission and uncertain-outcome reconciliation
- API authentication, scopes, request signatures, and rate limits
- Business event creation and signed webhook delivery
- Tenant isolation between API businesses

## The merchant is responsible for

- Obtaining the customer's authority to collect and submit identity data
- Protecting BVN, NIN, API credentials, and webhook secrets
- Keeping the authoritative per-customer balance ledger
- Mapping `external_ref` to exactly one internal customer identity
- Crediting customers only after a confirmed deposit event or API reconciliation
- Designing beneficiary-name display and the payout confirmation ceremony
- Deciding whether a customer may withdraw
- Assigning a unique payout `reference` to every business instruction
- Consuming webhooks idempotently and tolerating out-of-order delivery
- Reconciling webhooks against Shore's read APIs
- Maintaining enough available balance or approved credit for principal plus fees
- Defining support and finance procedures for manual reconciliation cases

## What Shore does not model

An API customer's end user is not a Shore user. The end user has no Shore login, no Shore wallet, and no Shore-side balance. The customer sub-account is a routing device owned by the API business and associated with a verified identity for banking compliance.
