# Tools Reference for Mermail Bounty Settler

This skill orchestrates tools across several official Mermail domains without inventing tool names or bypassing schemas.

## Inbox & Discovery Tools
- `list_mailboxes`: Discover existing active mailboxes and resolve `public_id`.
- `list_emails`: Filter messages with native JSON objects (e.g. `{"folder": "inbox", "query": "bounty OR reward"}`).
- `get_email_context`: Inspect sender authentication status (`sender_authentication.status`), headers, and security scan flags (`scan_status`).
- `search_emails`: Search for specific transaction hashes, platform notification IDs, or project slugs.

## Composition Tools
- `save_draft`: Save submission draft content without sending (`body.body` string, explicit `to`/`cc`/`bcc`).
- `send_email`: Transmit finalized delivery notifications (requires prior user preview & confirmation).
- `reply_to_email`: Reply to milestone threads.

## Treasury & Reconciliation Tools (Full OAuth Profile)
- `get_paybox_connection`: Probe active PayBox connection state (`ACTIVE`, `REAUTH_REQUIRED`, `NOT_CONNECTED`). Always call once before inspecting portfolio.
- `paybox_get_portfolio`: Inspect current token balances (SOL, USDC, USDG, ETH, USDT) across supported networks (Solana, Base, Ethereum, Arbitrum, Polygon).
- `get_agent_wallet`: Query wallet state and recent on-chain balance movements.
- `paybox_get_request`: Reconcile specific asynchronous payment requests or verify on-chain transaction status.
