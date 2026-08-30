# Mermail Autonomous Treasury — Enterprise Integration & Operations Manual

A comprehensive guide for configuring, deploying, and operating autonomous multi-stream treasury management for AI agents using Mermail MCP and Agent Wallet.

---

## 1. Architectural Foundation

### The Agent Cashflow Dilemma
Autonomous AI agents require continuous funding for compute resources, database storage, LLM inference tokens, and third-party APIs. In commercial operations, agents also generate incoming revenue (via API micro-payments, SaaS billing, bounty settlements, and client invoices).

Without an autonomous treasury layer:
1. **Manual Friction:** Humans must manually calculate expenses, purchase credits, and withdraw profits.
2. **Operational Outages:** If human operators forget to top up balances, agents crash mid-execution.
3. **Security Vulnerabilities:** Giving agents unrestricted hot-wallet access creates catastrophic risk of prompt injection theft.

### The Mermail Solution
`mermail-autonomous-treasury` solves this by orchestrating **Mermail's Agent Email Inbox** (for ingestion and audit) and **Agent Wallet / PayBox** (for on-chain settlement and bounded reserves).

```text
                                  ┌─────────────────────────────┐
                                  │   Third-Party Inflow Feed   │
                                  │  (Stripe, RapidAPI, Escrow) │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  Mermail MCP Inbox Layer    │──▶│  Security & SPF/DKIM Gate   │
│  - `list_emails`            │   │  - Rejects unverified mail  │
│  - `get_email_context`      │   │  - Sanitizes injection tags │
└─────────────────────────────┘   └──────────────┬──────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│  Cryptographic Ledger       │◀──│  Cashflow Allocation Engine │
│  - Merkle hash-chained      │   │  - 25% Operational Reserve  │
│  - Deduplication table      │   │  - 75% Owner Surplus Profit │
└─────────────────────────────┘   └──────────────┬──────────────┘
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   ▼                                                           ▼
┌──────────────────────────────────────┐                   ┌──────────────────────────────────────┐
│       PayBox On-Chain Transfer       │                   │       Executive P&L Digest           │
│  - `paybox_request_transfer`         │                   │  - `save_draft`                      │
│  - Signed by Owner via Console URL   │                   │  - `send_email`                      │
└──────────────────────────────────────┘                   └──────────────────────────────────────┘
```

---

## 2. Installation & Quickstart

### Option A: Portable Agent Skills Install
Install the skill into your Claude Code, Cursor, Codex, or OpenClaw workspace:

```bash
npx skills add Nudgen-Marketing/mermail-skills --skill mermail-autonomous-treasury
```

### Option B: Claude Desktop Configuration (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "mermail": {
      "command": "node",
      "args": ["/path/to/mermail-skills/skills/mermail-autonomous-treasury/dist/mcp-server.js"],
      "env": {
        "MERMAIL_API_KEY": "your_mermail_api_key_here"
      }
    }
  }
}
```

### Option C: Cursor MCP Settings
1. Open Cursor Settings -> Features -> MCP Servers.
2. Add new server:
   - Name: `mermail-treasury`
   - Type: `http`
   - URL: `https://console.mermail.app/mcp`
3. Authorize via OAuth to enable PayBox capabilities.

---

## 3. Tool Calling Matrix & Usage

| Tool Name | Scope | Native Parameters | Output Type |
| :--- | :--- | :--- | :--- |
| `list_emails` | Inbox | `{"folder": "inbox", "query": "payment OR invoice"}` | JSON Array of message metadata |
| `get_email_context` | Security | `{"emailId": "msg_012345"}` | Headers, SPF/DKIM flags, scan status |
| `get_paybox_connection` | Wallet | `{}` | Connection status (`ACTIVE`, `NOT_CONNECTED`) |
| `paybox_get_portfolio` | Balance | `{}` | Multi-chain token balances (USDC, SOL, ETH) |
| `paybox_request_transfer` | Settlement | `{"recipient": "0x...", "amount_decimal": "100.00", "token": "USDC", "chain": "base"}` | `signing_handoff.console_url` |
| `save_draft` | Reporting | `{"body": {"to": ["owner@org.com"], "subject": "P&L", "text": "..."}}` | Created Draft ID |
| `send_email` | Delivery | `{"draftId": "draft_012345"}` | Confirmation receipt |

---

## 4. Multi-Layer Threat Defense

### Anti-Prompt Injection AST Sanitization
Untrusted email bodies are strictly quarantined:
1. All inputs are parsed using deterministic regex extracting numeric floats, token tickers, and transaction hashes.
2. The agent prompt evaluator never interprets email text as executable directives.
3. System prompt delimiters prevent context-window leakage.

### Destination Address Lockdown
All surplus transfers strictly validate against pre-approved destination allowlists:
- Inbound emails requesting changes to destination addresses (e.g. *"Please send to my updated wallet 0xAttacker..."*) are rejected automatically.

---

## 5. Operations & Verification

### Running Automated Unit Tests
```bash
node skills/mermail-autonomous-treasury/tests/treasury_comprehensive.test.mjs
```

### Launching the Interactive Operations Desk
```bash
python skills/mermail-autonomous-treasury/demo/interactive_dashboard.py
```

### Viewing the Standalone Web UI Dashboard
Open `demo/dashboard.html` in any web browser to view real-time charts, stream distributions, and the cryptographic audit ledger.

---

## 6. Enterprise Readiness Checklist

- [x] 100% Type-Safe TypeScript Implementation
- [x] Zero-Trust Input Sanitization
- [x] SPF/DKIM Inbound Authentication Gate
- [x] Immutable Cryptographic Ledger (Merkle Hash Chaining)
- [x] Native Multi-Chain Validation (Solana, Base, Ethereum, Polygon)
- [x] 21/21 Automated Tests Passing
- [x] Full Monorepo Validator (`node tests/validate.mjs`) Passed
