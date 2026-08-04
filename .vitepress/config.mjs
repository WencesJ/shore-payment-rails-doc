import { defineConfig } from 'vitepress';

const githubRepository = process.env.GITHUB_REPOSITORY;
const repositoryName = githubRepository?.split('/')[1];
const configuredBase = process.env.DOCS_BASE?.trim();
const defaultBase =
  process.env.GITHUB_ACTIONS === 'true' &&
  repositoryName &&
  !repositoryName.endsWith('.github.io')
    ? `/${repositoryName}/`
    : '/';

const editLink = githubRepository
  ? {
      pattern: `https://github.com/${githubRepository}/edit/main/:path`,
      text: 'Edit this page',
    }
  : undefined;

export default defineConfig({
  title: 'Shore Fiat Rails',
  description: 'Merchant documentation for the Shore Fiat Rails API (v1, NGN).',

  // Project Pages use /<repo>/ automatically. Set the DOCS_BASE repository
  // variable to / when serving from a custom domain.
  base: configuredBase || defaultBase,

  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md'],

  head: [['meta', { name: 'theme-color', content: '#0b0b0b' }]],

  themeConfig: {
    search: { provider: 'local' },

    nav: [
      { text: 'Getting started', link: '/getting-started/overview' },
      { text: 'API reference', link: '/api/balances' },
      { text: 'Guides', link: '/guides/deposits-and-crediting' },
      { text: 'Reference', link: '/reference/endpoint-index' },
    ],

    sidebar: [
      {
        text: 'Getting started',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/getting-started/overview' },
          { text: 'Quickstart', link: '/getting-started/quickstart' },
          { text: 'Environments', link: '/getting-started/environments' },
          { text: 'Authentication', link: '/getting-started/authentication' },
          { text: 'Request signing', link: '/getting-started/request-signing' },
          { text: 'Idempotency', link: '/getting-started/idempotency' },
          { text: 'Conventions', link: '/getting-started/conventions' },
          { text: 'Errors', link: '/getting-started/errors' },
        ],
      },
      {
        text: 'API reference',
        collapsed: false,
        items: [
          { text: 'Balances', link: '/api/balances' },
          { text: 'Transactions', link: '/api/transactions' },
          { text: 'Statements', link: '/api/statements' },
          { text: 'Banks', link: '/api/banks' },
          { text: 'Virtual accounts', link: '/api/virtual-accounts' },
          { text: 'Payouts', link: '/api/payouts' },
          { text: 'Webhook endpoints', link: '/api/webhook-endpoints' },
          { text: 'Webhook events and delivery', link: '/api/webhook-events' },
          { text: 'Sandbox endpoints', link: '/api/sandbox' },
          { text: 'Dashboard: keys and live-readiness', link: '/api/dashboard-keys' },
        ],
      },
      {
        text: 'Guides',
        collapsed: false,
        items: [
          { text: 'Deposits and customer crediting', link: '/guides/deposits-and-crediting' },
          { text: 'Liquidity and credit', link: '/guides/liquidity-and-credit' },
          { text: 'Fees', link: '/guides/fees' },
          { text: 'Webhook implementation', link: '/guides/webhook-implementation' },
          { text: 'Reconciliation', link: '/guides/reconciliation' },
          { text: 'Sandbox test plan', link: '/guides/sandbox-test-plan' },
          { text: 'Recommended architecture', link: '/guides/architecture' },
          { text: 'Security checklist', link: '/guides/security' },
          { text: 'Go-live checklist', link: '/guides/go-live-checklist' },
        ],
      },
      {
        text: 'Reference',
        collapsed: false,
        items: [
          { text: 'Endpoint index', link: '/reference/endpoint-index' },
          { text: 'Error codes', link: '/reference/error-codes' },
          { text: 'Responsibility split', link: '/reference/responsibilities' },
          { text: 'Out of scope in v1', link: '/reference/out-of-scope' },
          { text: 'Related technical references', link: '/reference/related-references' },
        ],
      },
    ],

    outline: { level: [2, 3] },
    ...(editLink ? { editLink } : {}),
    footer: { message: 'Shore Fiat Rails · API v1 · NGN' },
  },
});
