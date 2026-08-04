---
title: Endpoint index
description: Every public and dashboard route with scope, signing, and idempotency requirements.
sidebar_position: 1
---

# Endpoint index

## Public API (`/v1`, bearer API key)

| Method | Path | Scope | Signed | Idempotency key | Purpose | Docs |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/v1/balances` | `fiat:read` | No | No | Read pool and credit state | [Balances](../api/balances.md) |
| GET | `/v1/transactions` | `fiat:read` | No | No | Read ledger-derived activity | [Transactions](../api/transactions.md) |
| GET | `/v1/statements` | `fiat:read` | No | No | Read a closed monthly summary | [Statements](../api/statements.md) |
| GET | `/v1/banks` | `fiat:read` | No | No | List reachable banks | [Banks](../api/banks.md) |
| POST | `/v1/banks/resolve` | `fiat:read` | No | No | Resolve beneficiary name | [Banks](../api/banks.md) |
| GET | `/v1/virtual-accounts` | `fiat:read` | No | No | List vault and sub-accounts | [Virtual accounts](../api/virtual-accounts.md) |
| GET | `/v1/virtual-accounts/{id}` | `fiat:read` | No | No | Retrieve an account | [Virtual accounts](../api/virtual-accounts.md) |
| POST | `/v1/virtual-accounts` | `fiat:accounts:issue` | Yes | Yes | Issue/get a customer sub-account | [Virtual accounts](../api/virtual-accounts.md) |
| GET | `/v1/payouts` | `fiat:read` | No | No | List API payouts | [Payouts](../api/payouts.md) |
| GET | `/v1/payouts/{id}` | `fiat:read` | No | No | Retrieve a payout | [Payouts](../api/payouts.md) |
| POST | `/v1/payouts` | `fiat:payouts` | Yes | Yes | Accept and execute a payout | [Payouts](../api/payouts.md) |
| POST | `/v1/test/deposits` | `fiat:accounts:issue` | Yes | Yes | Simulate a sandbox deposit | [Sandbox](../api/sandbox.md) |
| GET | `/v1/webhooks` | `fiat:webhooks` | No | No | List active endpoints | [Webhook endpoints](../api/webhook-endpoints.md) |
| POST | `/v1/webhooks` | `fiat:webhooks` | Yes | Yes | Create endpoint and secret | [Webhook endpoints](../api/webhook-endpoints.md) |
| DELETE | `/v1/webhooks/{id}` | `fiat:webhooks` | Yes | No | Disable an endpoint | [Webhook endpoints](../api/webhook-endpoints.md) |
| POST | `/v1/webhooks/{id}/rotate-secret` | `fiat:webhooks` | Yes | Yes | Replace endpoint secret | [Webhook endpoints](../api/webhook-endpoints.md) |
| GET | `/v1/webhook-events` | `fiat:webhooks` | No | No | Inspect delivery state | [Webhook events](../api/webhook-events.md) |
| POST | `/v1/webhooks/{id}/redeliver` | `fiat:webhooks` | Yes | Yes | Start a new delivery cycle | [Webhook events](../api/webhook-events.md) |

## Dashboard API (`/api/v1`, merchant JWT, OWNER or ADMIN)

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/v1/fiat-rails/storefronts/{storefrontId}/keys` | Issue an API key |
| GET | `/api/v1/fiat-rails/storefronts/{storefrontId}/keys` | List keys |
| POST | `/api/v1/fiat-rails/storefronts/{storefrontId}/keys/{keyId}/rotate` | Rotate a key |
| DELETE | `/api/v1/fiat-rails/storefronts/{storefrontId}/keys/{keyId}` | Revoke a key |
| GET | `/api/v1/fiat-rails/storefronts/{storefrontId}/live-readiness` | Check live readiness |

See [Dashboard: keys and live-readiness](../api/dashboard-keys.md).
