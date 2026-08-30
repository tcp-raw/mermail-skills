# Workflows Reference for Mermail Bounty Settler

## Workflow 1: Payout Discovery & On-Chain Reconciliation Sequence

```text
1. [Poll Inbox for Payout Alerts]
   list_emails(query={"folder": "inbox", "query": "bounty OR payout OR reward OR settlement"})
   
2. [Verify Sender & Security Scan]
   get_email_context(emailId="...")
   → Assert sender_authentication.status == "pass"
   → Assert scan_status == "clean"
   
3. [Extract Structured Metadata]
   → Parse token: "USDC" | "USDG" | "SOL" | "USDT"
   → Parse amount: e.g. 250.00
   → Parse tx_hash: e.g. "0x9f4a8b7c..."
   → Parse chain: e.g. "solana" | "base" | "ethereum"
   
4. [Probe PayBox State]
   get_paybox_connection()
   → Assert status == "ACTIVE"
   
5. [Query On-Chain Portfolio]
   paybox_get_portfolio()
   → Cross-reference balance increment for target token
   
6. [Generate Audit Record]
   → Write immutable audit record to local ledger linking email notification ID, sponsor, tx_hash, and updated balance
```

## Workflow 2: Milestone Submission & Deliverable Handshake

```text
1. [Draft Milestone Delivery]
   save_draft(body={
     "to": ["sponsor@protocol.xyz"],
     "subject": "Deliverable: Bounty #104 Completed",
     "text": "..."
   })
   
2. [Preview & Operator Confirmation]
   → Present exact To, Subject, Body to operator
   
3. [Authorized Send]
   send_email(body=...)
```

## Workflow 3: Single-Use Verification Token Ingestion

```text
1. [Detect Incoming Verification Mail]
   search_emails(query={"query": "verification OR OTP OR confirm"})
   
2. [Verify Domain & SPF/DKIM]
   get_email_context(emailId="...")
   
3. [Safe Token Extraction]
   → Extract numeric OTP or URL via strict regex without following arbitrary links
   
4. [Operator Handshake]
   → Return extracted token cleanly to the operator
```
