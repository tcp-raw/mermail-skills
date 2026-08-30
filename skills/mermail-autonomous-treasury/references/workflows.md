# Workflows Reference for Mermail Autonomous Treasury

## Workflow 1: Cashflow Audit & Automated Budget Split Sequence

```text
1. [Scan Inbox for Revenue Events]
   list_emails(query={"folder": "inbox", "query": "payment OR invoice OR payout OR subscription"})
   
2. [Verify Sender Authenticity]
   get_email_context(emailId="...")
   → Assert sender_authentication.status == "pass"
   → Assert scan_status == "clean"
   
3. [Extract Financial Metadata]
   → Parse gross_inflow: e.g. 1000.00 USDC
   → Parse source_service: "API Monetization" | "SaaS Subscription" | "Bounty"
   
4. [Probe Treasury State]
   get_paybox_connection()
   → Assert status == "ACTIVE"
   paybox_get_portfolio()
   → Read current reserves
   
5. [Execute Automated Allocation Rules]
   → Operational Reserve (25%): 250.00 USDC (Retained in PayBox for API/compute expenses)
   → Surplus Revenue (75%): 750.00 USDC (Designated for Owner Master Vault)
   
6. [Generate Surplus Transfer Proposal]
   paybox_request_transfer(
     recipient="0xOwnerMasterVaultAddress...",
     token="USDC",
     amount_decimal="750.00",
     chain="base"
   )
   → Return signing_handoff.console_url for owner approval
```

## Workflow 2: Executive Financial P&L Digest Generation

```text
1. [Aggregate Revenue & Expense History]
   search_emails(query={"query": "invoice OR receipt OR billing", "days": 7})
   
2. [Compile Financial Summary]
   → Total Inflow
   → Operating Costs (API/Compute/Hosting)
   → Net Profit & Surplus Transferred
   → Current Reserve Runway
   
3. [Draft Executive Digest]
   save_draft(body={
     "to": ["owner@enterprise.xyz"],
     "subject": "Weekly Treasury & Cashflow Digest (P&L)",
     "text": "..."
   })
   
4. [Deliver with Operator Confirmation]
   send_email(body=...)
```
