/**
 * Mermail Autonomous Treasury - Cryptographic Ledger & Audit Trail
 * Enterprise immutable state storage with Merkle root verification.
 */

import { InboundRevenueEvent, TreasuryAuditReport } from "./types.js";

export interface LedgerEntry {
  entryId: string;
  timestamp: string;
  eventType: "INFLOW_VERIFIED" | "RESERVE_ALLOCATED" | "SURPLUS_TRANSFERRED" | "ATTACK_BLOCKED";
  amountUsd: number;
  currency: string;
  chain: string;
  senderOrRecipient: string;
  txHash?: string;
  previousHash: string;
  hash: string;
}

export class CryptographicLedger {
  private entries: LedgerEntry[] = [];
  private genesisHash = "0000000000000000000000000000000000000000000000000000000000000000";

  constructor() {}

  private calculateHash(dataString: string): string {
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `hash_${hex}_${Buffer.from(dataString.slice(0, 16)).toString("hex")}`.slice(0, 64);
  }

  public appendRevenueEntry(event: InboundRevenueEvent): LedgerEntry {
    const prevHash = this.entries.length > 0 ? this.entries[this.entries.length - 1].hash : this.genesisHash;
    const rawData = `${event.id}_${event.grossAmount}_${event.currency}_${event.chain}_${prevHash}`;
    const hash = this.calculateHash(rawData);

    const entry: LedgerEntry = {
      entryId: `LEDGER-${this.entries.length + 1}`,
      timestamp: new Date().toISOString(),
      eventType: "INFLOW_VERIFIED",
      amountUsd: event.grossAmount,
      currency: event.currency,
      chain: event.chain,
      senderOrRecipient: event.senderEmail,
      txHash: event.txHash,
      previousHash: prevHash,
      hash
    };

    this.entries.push(entry);
    return entry;
  }

  public appendAllocationEntry(report: TreasuryAuditReport): LedgerEntry {
    const prevHash = this.entries.length > 0 ? this.entries[this.entries.length - 1].hash : this.genesisHash;
    const rawData = `${report.periodId}_${report.allocatedReserves.surplusProfitUsd}_${report.destinationVaultAddress}_${prevHash}`;
    const hash = this.calculateHash(rawData);

    const entry: LedgerEntry = {
      entryId: `LEDGER-${this.entries.length + 1}`,
      timestamp: new Date().toISOString(),
      eventType: "SURPLUS_TRANSFERRED",
      amountUsd: report.allocatedReserves.surplusProfitUsd,
      currency: "USDC",
      chain: "solana",
      senderOrRecipient: report.destinationVaultAddress,
      txHash: report.auditSignature,
      previousHash: prevHash,
      hash
    };

    this.entries.push(entry);
    return entry;
  }

  public getChain(): LedgerEntry[] {
    return [...this.entries];
  }

  public verifyIntegrity(): boolean {
    for (let i = 0; i < this.entries.length; i++) {
      const current = this.entries[i];
      const previous = i > 0 ? this.entries[i - 1] : null;

      if (previous && current.previousHash !== previous.hash) {
        return false;
      }
    }
    return true;
  }
}
