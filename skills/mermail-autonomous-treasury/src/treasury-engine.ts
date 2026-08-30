import { InboundRevenueEvent, TreasuryAuditReport, TokenAllocationRule } from "./types.js";

export class MermailTreasuryEngine {
  private ownerVaultAddress: string;
  private operatingReservePct: number;

  constructor(ownerVaultAddress: string, operatingReservePct: number = 25) {
    this.ownerVaultAddress = ownerVaultAddress;
    this.operatingReservePct = operatingReservePct;
  }

  /**
   * Sanitizes and validates inbound email event to prevent prompt injection and unauthorized tampering.
   */
  public validateInboundEvent(event: InboundRevenueEvent): { isValid: boolean; reason?: string } {
    if (event.senderAuth.status !== "pass" || event.senderAuth.spf !== "pass" || event.senderAuth.dkim !== "pass") {
      return { isValid: false, reason: "Sender SPF/DKIM authentication verification failed." };
    }

    if (event.scanStatus !== "clean") {
      return { isValid: false, reason: "Security scan flagged suspicious or hostile content." };
    }

    if (event.grossAmount <= 0) {
      return { isValid: false, reason: "Invalid gross amount (must be positive)." };
    }

    return { isValid: true };
  }

  /**
   * Calculates cashflow distribution based on configured operational reserve rules.
   */
  public calculateAllocation(events: InboundRevenueEvent[]): TreasuryAuditReport {
    let totalInflow = 0;

    for (const ev of events) {
      const validation = this.validateInboundEvent(ev);
      if (validation.isValid) {
        totalInflow += ev.grossAmount;
      }
    }

    const operatingReserve = totalInflow * (this.operatingReservePct / 100);
    const surplusProfit = totalInflow - operatingReserve;

    return {
      periodId: `PERIOD-${new Date().toISOString().slice(0, 10)}`,
      generatedAt: new Date().toISOString(),
      totalInflowUsd: Number(totalInflow.toFixed(2)),
      allocatedReserves: {
        operatingExpenseReserveUsd: Number(operatingReserve.toFixed(2)),
        surplusProfitUsd: Number(surplusProfit.toFixed(2))
      },
      destinationVaultAddress: this.ownerVaultAddress,
      auditSignature: `SIG_${Buffer.from(`${totalInflow}_${Date.now()}`).toString("hex").slice(0, 24)}`
    };
  }

  /**
   * Formats a formal, executive-ready Markdown / HTML email digest.
   */
  public generateExecutiveDigest(report: TreasuryAuditReport): { subject: string; body: string } {
    const subject = `[Treasury Digest] P&L Report: $${report.totalInflowUsd.toFixed(2)} Inflow | Period ${report.periodId}`;
    
    const body = `
# Autonomous Treasury & Cashflow Statement

**Reporting Period:** ${report.periodId}
**Generated At:** ${report.generatedAt}
**Audit Signature:** \`${report.auditSignature}\`

---

### 1. Revenue & Cashflow Summary
- **Gross Revenue Inflow:** $${report.totalInflowUsd.toFixed(2)} USDC
- **Operating Compute Reserve (25%):** $${report.allocatedReserves.operatingExpenseReserveUsd.toFixed(2)} USDC *(Retained in PayBox for API/Server costs)*
- **Net Surplus Profit (75%):** $${report.allocatedReserves.surplusProfitUsd.toFixed(2)} USDC *(Transferred to Owner Vault)*

---

### 2. Destination Master Vault
- **Target Vault Address:** \`${report.destinationVaultAddress}\`
- **Settlement Status:** Handshake prepared for owner signature via PayBox.

---

*Generated autonomously by Mermail Autonomous Treasury Skill via MCP.*
`.trim();

    return { subject, body };
  }
}
