# Shore Fiat Rails — Merchant Documentation

**API version:** v1 · **Assets:** NGN · **Last verified against implementation:** 2026-08-04

A business-to-business API for collecting and disbursing Nigerian naira. Issue virtual bank accounts, attribute inbound deposits to your customers, send payouts to Nigerian bank accounts, and receive signed webhooks.

New here? Start with [Overview](./getting-started/overview.md), then [Quickstart](./getting-started/quickstart.md).

## Getting started

| Page | Covers |
| --- | --- |
| [Overview](./getting-started/overview.md) | Capabilities, the pooled account model, business isolation |
| [Quickstart](./getting-started/quickstart.md) | Provisioning and the recommended integration order |
| [Environments](./getting-started/environments.md) | Base URLs, credential prefixes, the `/v1` vs `/api/v1` split |
| [Authentication](./getting-started/authentication.md) | Bearer keys, scopes, IP allowlists, key limits and rotation |
| [Request signing](./getting-started/request-signing.md) | Which requests are signed and how to build the HMAC |
| [Idempotency](./getting-started/idempotency.md) | Where keys are required and how replay behaves |
| [Conventions](./getting-started/conventions.md) | Amounts, timestamps, pagination, rate limits |
| [Errors](./getting-started/errors.md) | Response shape and logging rules |

## API reference

| Resource | Endpoints |
| --- | --- |
| [Balances](./api/balances.md) | `GET /v1/balances` |
| [Transactions](./api/transactions.md) | `GET /v1/transactions` |
| [Statements](./api/statements.md) | `GET /v1/statements` |
| [Banks](./api/banks.md) | `GET /v1/banks`, `POST /v1/banks/resolve` |
| [Virtual accounts](./api/virtual-accounts.md) | `POST`/`GET /v1/virtual-accounts`, `GET /v1/virtual-accounts/{id}` |
| [Payouts](./api/payouts.md) | `POST`/`GET /v1/payouts`, `GET /v1/payouts/{id}` |
| [Webhook endpoints](./api/webhook-endpoints.md) | `POST`/`GET`/`DELETE /v1/webhooks`, rotate-secret |
| [Webhook events](./api/webhook-events.md) | Envelope, event catalogue, `GET /v1/webhook-events`, redeliver |
| [Sandbox](./api/sandbox.md) | `POST /v1/test/deposits`, deterministic outcomes |
| [Dashboard: keys & readiness](./api/dashboard-keys.md) | `/api/v1/fiat-rails/storefronts/{storefrontId}/...` |

## Guides

| Guide | Covers |
| --- | --- |
| [Deposits and crediting](./guides/deposits-and-crediting.md) | Prefunding, customer deposits, ledger crediting rule |
| [Liquidity and credit](./guides/liquidity-and-credit.md) | Hold funding, credit draw and repayment |
| [Fees](./guides/fees.md) | Fee models, when they are frozen, how they surface |
| [Webhook implementation](./guides/webhook-implementation.md) | Ingress flow, verification, deduplication, recovery |
| [Reconciliation](./guides/reconciliation.md) | Daily checks, monthly close, manual-intervention cases |
| [Sandbox test plan](./guides/sandbox-test-plan.md) | Twelve scenarios to pass before go-live |
| [Architecture](./guides/architecture.md) | Recommended component split |
| [Security](./guides/security.md) | Credential, signing, and logging checklist |
| [Go-live checklist](./guides/go-live-checklist.md) | Product, engineering, security, activation |

## Reference

- [Endpoint index](./reference/endpoint-index.md)
- [Error codes](./reference/error-codes.md)
- [Responsibility split](./reference/responsibilities.md)
- [Out of scope in v1](./reference/out-of-scope.md)
- [Related technical references](./reference/related-references.md)
