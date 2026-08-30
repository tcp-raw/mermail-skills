# Tools Reference for Mermail Autonomous Treasury

This skill orchestrates tools across several official Mermail domains without inventing tool names or bypassing schemas.

## Inbox & Discovery Tools
- `list_mailboxes`: Discover existing active mailboxes and resolve `public_id`.
- `list_emails`: Filter billing, invoice, and payment receipt messages with native JSON objects (e.g. `{"folder": "inbox", "query": "invoice OR payment OR payout OR receipt"}`).
- `get_email_context`: Inspect sender authentication status (`sender_authentication.status`), headers, and security scan flags (`scan_status`).
- `search_emails`: Search for specific invoice identifiers, customer reference numbers, or transaction hashes.

## Composition & Executive Reporting Tools
- `save_draft`: Save financial P&L executive digest drafts without sending (`body.body` string, explicit `to`/`cc`/`bcc`).
- `send_email`: Deliver approved financial reports to the workspace owner (requires prior user preview & confirmation).
- `schedule_email_send`: Schedule periodic weekly or monthly accounting digests.

## Treasury & Balance Reconciliation Tools (Full OAuth Profile)
- `get_paybox_connection`: Probe active PayBox connection state (`ACTIVE`, `REAUTH_REQUIRED`, `NOT_CONNECTED`). Always call once before inspecting portfolio.
- `paybox_get_portfolio`: Inspect current multi-chain token holdings (SOL, USDC, USDG, ETH, USDT) across supported networks (Solana, Base, Ethereum, Arbitrum, Polygon).
- `paybox_request_transfer`: Prepare bounded surplus transfers to owner cold vaults (generates `signing_handoff.console_url`).
- `paybox_get_request`: Reconcile specific asynchronous payment requests or verify on-chain settlement status.
