---
title: Environments
description: Base URLs, credential prefixes, and route prefixes.
sidebar_position: 3
---

# Environments

| Environment | Base URL | Credential prefix | Money movement |
| --- | --- | --- | --- |
| Sandbox | `https://staging.shore.so/v1` | `sk_test_` | Simulated |
| Production | `https://api.shore.so/v1` | `sk_live_` | Live provider-backed |

## Route prefixes

Public Fiat Rails routes are mounted **directly at `/v1`**. Do not add the application's usual `/api/v1` prefix to public money APIs.

```text
Correct:   https://staging.shore.so/v1/balances
Incorrect: https://staging.shore.so/api/v1/v1/balances
```

Merchant dashboard and key-management routes are separate application routes and **do** use `/api/v1`:

```text
https://staging.shore.so/api/v1/fiat-rails/storefronts/{storefrontId}/keys
```

See [Dashboard: keys and live-readiness](../api/dashboard-keys.md).

## Key portability

Test keys work only in non-production deployments. Live keys work only in production. A key cannot be moved between environments; using one against the wrong environment returns `UNAUTHORIZED`.
