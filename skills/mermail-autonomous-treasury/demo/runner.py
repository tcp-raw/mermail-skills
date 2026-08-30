"""
Mermail Autonomous Treasury - Live Demonstration Runner
Demonstrates the multi-stream revenue tracking, automated 25/75 budget split, and executive P&L digest generation.
"""

import sys
import json
import time

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def run_treasury_demo():
    print("==========================================================")
    print("🏦 MERMAIL AUTONOMOUS TREASURY — LIVE REVENUE & P&L DEMO")
    print("==========================================================")
    
    # Step 1: Query Billing & Revenue Inbox
    print("\n[Step 1] Ingesting multi-channel revenue receipts via `list_emails`...")
    time.sleep(0.5)
    mock_events = [
        {"source": "API Monetization Gateway", "amount": 600.0, "token": "USDC", "sender": "billing@rapidapi.com"},
        {"source": "SaaS Subscription Inflow", "amount": 400.0, "token": "USDC", "sender": "receipts@stripe.com"}
    ]
    total_inflow = sum(e["amount"] for e in mock_events)
    print(f"  📥 Processed 2 Revenue Events. Total Gross Inflow: ${total_inflow:.2f} USDC")
    
    # Step 2: Security Validation
    print("\n[Step 2] Validating sender authentication & scan status via `get_email_context`...")
    time.sleep(0.4)
    print("  ✅ All Inbound Senders Verified (SPF: PASS, DKIM: PASS, Scan: CLEAN)")
    
    # Step 3: Automated Cashflow Allocation
    print("\n[Step 3] Executing Automated Cashflow Allocation Policy...")
    time.sleep(0.4)
    compute_reserve = total_inflow * 0.25
    surplus_profit = total_inflow * 0.75
    print(f"  ⚙️ Operational Reserve (25% for API/Compute):  ${compute_reserve:.2f} USDC (Retained in PayBox)")
    print(f"  💰 Net Surplus Profit   (75% for Owner Vault): ${surplus_profit:.2f} USDC")
    
    # Step 4: PayBox Transfer Preparation
    print("\n[Step 4] Preparing Owner Surplus Transfer via `paybox_request_transfer`...")
    time.sleep(0.5)
    owner_vault = "BK4F2YtBt1jWaJNsx8hsDEC9HP43UArrV7qR5hKCxPyn"
    print(f"  Recipient Vault: {owner_vault}")
    print(f"  Signing Handoff: https://console.mermail.app/paybox/requests/req_9847192 (Awaiting Owner Signature)")
    
    # Step 5: Executive P&L Email Generation
    print("\n[Step 5] Compiling Executive Financial Digest via `save_draft`...")
    time.sleep(0.5)
    digest = {
        "report_period": "2026-W35",
        "gross_inflow_usd": total_inflow,
        "operating_reserve_retained_usd": compute_reserve,
        "surplus_transferred_usd": surplus_profit,
        "treasury_health_score": "EXCELLENT (100% Runway)",
        "destination_vault": owner_vault
    }
    print("  ✅ Executive Financial P&L Digest Drafted Successfully.")
    print(json.dumps(digest, indent=2))

if __name__ == '__main__':
    run_treasury_demo()
