# Tool Reference for Mermail Bounty Settler

## Key MCP Tools Used

### 1. `list_emails`
- **Purpose**: Search for incoming bounty alerts, platform notifications, or payment confirmations.
- **Parameters**: Native JSON query object, e.g. `{"folder": "inbox", "query": "bounty OR submission"}`.
- **Note**: Do not pass a stringified JSON string. Pass a native JSON object.

### 2. `get_email_context`
- **Purpose**: Retrieve email body, headers, authentication status (`sender_authentication.status`), and timestamps.
- **Usage**: Used to parse structured data such as milestone approvals or payout transaction hashes.

### 3. `draft_email` / `send_email`
- **Purpose**: Prepare client communication or submission deliveries.
- **Safety**: Always generate an exact preview before calling `send_email`.

### 4. `paybox_get_balance` / `paybox_list_transactions`
- **Purpose**: Inspect the connected Agent Wallet / PayBox status to verify that the promised payout arrived.
- **Scope**: Requires full-profile OAuth connection.
