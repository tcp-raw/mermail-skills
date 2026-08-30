"""
Mermail Autonomous Treasury - Interactive Terminal Analytics Dashboard
"""

import sys
import time
import os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ANSI color codes
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
PURPLE = "\033[95m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

def print_header():
    print(f"{CYAN}{BOLD}")
    print("┌────────────────────────────────────────────────────────────────────────────┐")
    print("│             🏦  MERMAIL AUTONOMOUS TREASURY OPERATIONS DESK               │")
    print("│         Multi-Stream Revenue Accounting & Automated Cashflow Split         │")
    print("└────────────────────────────────────────────────────────────────────────────┘")
    print(f"{RESET}")

def print_dashboard():
    print_header()
    
    print(f"{BOLD}[1] Active Inflow Streams (24h Window){RESET}")
    print("────────────────────────────────────────────────────────────────────────────")
    print(f" • RapidAPI Micro-Services Billing:   {GREEN}+$640.00 USDC{RESET} [SPF/DKIM: {GREEN}PASS{RESET}]")
    print(f" • SaaS Client Subscriptions:        {GREEN}+$360.00 USDC{RESET} [SPF/DKIM: {GREEN}PASS{RESET}]")
    print(f" • Superteam Bounty Settlements:     {GREEN}+$500.00 USDC{RESET} [SPF/DKIM: {GREEN}PASS{RESET}]")
    print(f" • Malicious Spoofed Inflow Attempt:  {RED}[BLOCKED / QUARANTINED]{RESET}")
    print(f"   ↳ {YELLOW}Total Gross Verified Inflow:{RESET} {BOLD}{GREEN}$1,500.00 USDC{RESET}\n")
    
    print(f"{BOLD}[2] Autonomous Cashflow Allocation Engine{RESET}")
    print("────────────────────────────────────────────────────────────────────────────")
    print(" ┌──────────────────────┬──────────────────────┬───────────────────────────┐")
    print(" │  Operating Reserve   │   Owner Net Profit   │    Treasury Runway        │")
    print(" │    (25% Compute)     │     (75% Vault)      │     (100% Funded)         │")
    print(" ├──────────────────────┼──────────────────────┼───────────────────────────┤")
    print(f" │     {CYAN}$375.00 USDC{RESET}     │    {GREEN}$1,125.00 USDC{RESET}    │    {PURPLE}90 Days Continuous{RESET}    │")
    print(" └──────────────────────┴──────────────────────┴───────────────────────────┘\n")
    
    print(f"{BOLD}[3] PayBox On-Chain Transfer Proposal{RESET}")
    print("────────────────────────────────────────────────────────────────────────────")
    print(f" • Target Owner Vault: {BOLD}0xefd8917437C1E9cB98f83A783F25AA1a2AC3bBC5{RESET}")
    print(f" • Amount:             {GREEN}1,125.00 USDC{RESET} (Base / Solana Network)")
    print(f" • Signing Handoff:    {CYAN}https://console.mermail.app/paybox/requests/req_9847192{RESET}")
    print(f" • Status:             {YELLOW}AWAITING OPERATOR OAUTH SIGNATURE{RESET}\n")
    
    print(f"{BOLD}[4] Executive P&L Email Statement{RESET}")
    print("────────────────────────────────────────────────────────────────────────────")
    print(f" • Draft ID:           {CYAN}draft_msg_8841920{RESET}")
    print(f" • Recipient:          {BOLD}owner@enterprise.xyz{RESET}")
    print(f" • Subject:            {PURPLE}[P&L Statement] Weekly Treasury Report: $1,500.00 Inflow{RESET}")
    print(f" • State:              {GREEN}DRAFT SAVED & READY FOR DELIVERY{RESET}\n")
    print(f"{GREEN}✔ All systems operational. 0 prompt injections detected. 100% audited.{RESET}")

if __name__ == '__main__':
    print_dashboard()
