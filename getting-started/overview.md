---
title: Overview
description: What Shore Fiat Rails does, the pooled account model, and business isolation.
sidebar_position: 1
---

# Overview

Shore Fiat Rails is an API-first product for collecting and disbursing Nigerian naira. You own the customer-facing application, customer ledger, approval experience, and support experience. Shore provides the regulated banking integration, account routing, pooled ledger, payout execution, and event delivery.

## Capabilities

| Capability | What you can do | Why it exists |
| --- | --- | --- |
| Business vault | Receive treasury transfers into a persistent business virtual account | Prefund the pool used for payouts |
| Customer sub-accounts | Issue persistent NGN accounts tied to your own customer reference | Attribute inbound transfers without narration or payment references |
| Deposit attribution | Receive `deposit.received` events carrying the virtual account and `external_ref` | Credit the right customer in your ledger |
| Pool balance | Read available, locked, and credit balances | Decide whether payouts can be accepted; reconcile liquidity |
| Bank directory | List banks reachable by the active payout provider | Populate valid bank choices |
| Name enquiry | Resolve an account number + bank code to a name | Show the beneficiary before confirmation |
| Payouts | Send the full instructed amount to a Nigerian bank account | Withdrawals, supplier payments, refunds |
| Payout safeguards | Idempotency, unique references, duplicate detection | Prevent double payment on retries |
| Transaction history | Read deposits, holds, settlements, fees, releases | Ops views and near-real-time reconciliation |
| Monthly statements | Retrieve an immutable closed-month summary | Finance close |
| Webhooks | Subscribe to deposit and payout events; inspect delivery health | React without polling |
| Webhook recovery | Find exhausted deliveries and redeliver | Recover after endpoint downtime |
| Credential management | Issue, list, rotate, revoke business-scoped API keys | Least privilege and secret rotation |
| Sandbox simulation | Test accounts, simulated deposits, forced payout outcomes | Integrate without real money |
| Live-readiness check | See what blocks live credential issuance | Make go-live requirements explicit |

## The account model

Each API business has **one Shore-managed NGN operational pool**. Deposits into the business vault or into any customer sub-account ultimately affect that one pool.

```text
Merchant treasury transfer ──> business vault ───────┐
                                                     ├──> business NGN pool
Customer transfer ──────────> customer sub-account ──┘

business NGN pool ──> payout hold ──> Nigerian bank beneficiary
```

Virtual accounts identify **where money came from**. They do not create separate Shore-side balances for your customers.

> **Your end user is not a Shore user.** They have no Shore login, no Shore wallet, and no Shore-side balance. A customer sub-account is a routing device owned by your API business, associated with a verified identity for banking compliance. You keep the authoritative per-customer ledger.

## Business isolation

A merchant may own more than one API business. Each business is isolated and has its own:

- pool balance;
- vault and customer virtual accounts;
- API credentials;
- payout references;
- webhook endpoints and secrets;
- fee configuration;
- optional credit limit; and
- transaction and statement history.

An API key issued for one business cannot access a sibling business, even under the same merchant. A valid UUID owned by another business returns the same `NOT_FOUND` behavior as an absent resource.

## Next

- [Quickstart](./quickstart.md)
- [Responsibility split](../reference/responsibilities.md)
- [Out of scope in v1](../reference/out-of-scope.md)
