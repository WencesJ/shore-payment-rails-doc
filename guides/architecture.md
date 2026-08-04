---
title: Recommended architecture
description: Component split for a robust integration.
sidebar_position: 7
---

# Recommended architecture

| Component | Responsibility |
| --- | --- |
| Shore API client | Authentication, exact request signing, timeouts, idempotent retry, response parsing |
| Customer-account service | Stable mapping from customer ID to Shore `external_ref` and virtual account |
| Payout orchestrator | Merchant authorization, unique reference creation, name enquiry, payout submission, status workflow |
| Webhook ingress | Raw-body capture, signature verification, event deduplication, fast acknowledgement |
| Event processor | Customer crediting, payout status updates, support notifications |
| Reconciliation worker | Transactions, balances, statements, delivery health, stuck-payout checks |
| Secret-management process | Key and webhook-secret issuance, distribution, rotation, revocation |

Keep Shore API state and your customer ledger linked by durable IDs, but do not make webhook arrival order the source of truth.
