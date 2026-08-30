# Tools Reference for Mermail Bounty Settler

This skill orchestrates tools across several official Mermail domains.

## Inbox & Discovery Tools
- `list_mailboxes`: Discover existing active mailboxes and resolve `public_id`.
- `list_emails`: Filter messages with native JSON objects (e.g. `{"folder": "inbox", "query": "bounty OR reward"}`).
- `get_email_context`: Inspect sender authentication status, headers, and security scan flags.
- `search_emails`: Search for specific transaction hashes or project slugs.

## Composition Tools
- `save_draft`: Save submission draft content without sending.
- `send_email`: Transmit finalized delivery notifications (requires prior user preview & confirmation).
- `reply_to_email`: Reply to milestone threads.

## Treasury & Reconciliation Tools (Full OAuth Profile)
- `paybox_get_portfolio`: Inspect current token holdings (SOL, USDC, USDG, ETH) across supported networks.
- `get_agent_wallet`: Query wallet state and recent on-chain balance movements.
