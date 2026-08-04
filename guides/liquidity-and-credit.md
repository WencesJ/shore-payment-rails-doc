---
title: Liquidity and credit
description: How payout holds are funded and how optional credit draws and repays.
sidebar_position: 2
---

# Liquidity and credit

Credit is optional and configured by Shore. You cannot change your credit limit through the public API.

## Rules

- Payout holds spend **own available funds first**.
- Any shortfall can draw approved credit.
- The exact own-funds/credit split is recorded on the payout.
- A failed or pre-settlement-reversed payout restores the same split.
- New deposit net amounts **repay drawn credit before** increasing available funds.

## Acceptance test

A payout is accepted when `available + credit_available` covers principal **plus** the frozen fee.

`INSUFFICIENT_AVAILABLE_BALANCE` (422) means that test failed. Prefund and safely retry the same business intent — reuse the payout reference; use a new idempotency key only if you have started a genuinely new intent.

## Monitoring

`balance_threshold` is a configured low-balance marker on the [balance response](../api/balances.md), but the reserved `balance.threshold` webhook event has **no emission path**. Poll `GET /v1/balances` for low-balance alerting.
