# Workflows Reference for Mermail Bounty Settler

## Workflow 1: Payout Reconciliation Sequence

```text
1. [Poll Inbox]
   list_emails(query={"folder": "inbox", "query": "bounty OR payout OR reward"})
   
2. [Verify Sender & Security]
   get_email_context(emailId="...")
   → Assert sender_authentication.status == "pass"
   → Assert scan_status == "clean"
   
3. [Extract Structured Metadata]
   → Parse token: "USDC" | "USDG" | "SOL"
   → Parse amount: e.g. 250.00
   → Parse tx_hash: e.g. "0x9f4a8b7c..."
   
4. [Query On-Chain State]
   paybox_get_portfolio()
   → Cross-reference balance increment
   
5. [Generate Audit Record]
   → Output structured settlement receipt to operator log
```

## Workflow 2: Milestone Submission Sequence

```text
1. [Draft Milestone Delivery]
   save_draft(body={"to": ["sponsor@protocol.xyz"], "subject": "Deliverable: Bounty #104 Completed", "text": "..."})
   
2. [Preview & User Confirmation]
   → Present exact To, Subject, Body to operator
   
3. [Authorized Send]
   send_email(body=...)
```
