---
title: Error codes
description: Every implemented error code with status and retry guidance.
sidebar_position: 2
---

# Error codes

Response shape and logging rules are in [Errors](../getting-started/errors.md).

| Code | HTTP | Meaning | Retry guidance |
| --- | ---: | --- | --- |
| `UNAUTHORIZED` | 401 | Missing, invalid, expired, environment-mismatched, or IP-blocked key | Fix credentials or source IP |
| `SIGNATURE_INVALID` | 401 | HMAC does not match the exact request | Rebuild from raw bytes; do not create a new business intent |
| `TIMESTAMP_OUT_OF_RANGE` | 401 | Request timestamp more than 300 seconds away | Fix clock and resign |
| `SCOPE_MISSING` | 403 | Key lacks the endpoint's required scope | Use or issue an appropriate key |
| `NOT_FOUND` | 404 | Resource absent or belongs to another business | Verify the ID and key |
| `IDEMPOTENCY_KEY_REQUIRED` | 409 | Durable POST omitted its key | Retry the same request with one stable key |
| `IDEMPOTENCY_KEY_REUSED` | 409 | Same key used for a different request | Investigate caller bug; new key only for a new intent |
| `IDEMPOTENCY_IN_PROGRESS` | 409 | Identical request still running | Back off and retry the same request/key |
| `DUPLICATE_REFERENCE` | 409 | Payout reference already belongs to another request | Retrieve the original or correct the new reference |
| `DUPLICATE_SUSPECTED` | 409 | Matching payout inside the duplicate window | Confirm whether a second payout is intentional |
| `ACCOUNT_NUMBER_UNAVAILABLE` | 409 | No free account number could be settled on for a new virtual account | Retry the same request and key; report if it persists |
| `ACCOUNT_NOT_RESOLVED` | 422 | Bank/account combination could not be verified | Ask the customer to correct it |
| `KYC_INVALID` | 422 | BVN or NIN did not verify | Correct data or follow the customer review process |
| `KYC_MISMATCH` | 422 | BVN and NIN identities differ, or an intent is bound elsewhere | Stop and investigate identity data |
| `AMOUNT_BELOW_MINIMUM` | 422 | Payout below business configuration | Change amount per product rules |
| `AMOUNT_ABOVE_MAXIMUM` | 422 | Payout above business configuration | Split only if commercially valid and independently approved |
| `INSUFFICIENT_AVAILABLE_BALANCE` | 422 | Available plus credit cannot cover principal and fee | Prefund and retry the same business intent safely |
| `STATEMENT_PERIOD_NOT_CLOSED` | 422 | Current or future month requested | Retry after period close |
| `RATE_LIMITED` | 429 | Per-key minute bucket exceeded | Respect `Retry-After` |
| `FEE_SCHEDULE_UNRESOLVED` | 503 | Fee configuration cannot quote the transaction | Retry same idempotency key after Shore resolves configuration |
| `IDENTITY_PROVIDER_UNAVAILABLE` | 503 | Identity provider temporarily unavailable | Retry same idempotency key |
| `SANDBOX_ONLY` | 503 | Test-deposit endpoint called outside sandbox | Remove the call from the live flow |
| `LIVE_NOT_READY` | 503 | One or more readiness checks failed | Resolve the failed readiness details |

Input DTO validation uses the platform validation code and message format rather than every domain-specific code above.
