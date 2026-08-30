/**
 * Mermail Autonomous Treasury - Core Architecture & Engine Types
 * Production TypeScript definitions for MCP JSON-RPC 2.0 financial operations.
 */

export interface TokenAllocationRule {
  purpose: "OPERATING_RESERVE" | "OWNER_SURPLUS" | "EMERGENCY_BUFFER";
  percentage: number; // e.g. 25 for 25%
  minReserveUsd: number;
  maxCapUsd?: number;
}

export interface InboundRevenueEvent {
  id: string;
  source: string; // e.g. "Stripe", "RapidAPI", "Superteam", "Direct Invoice"
  senderEmail: string;
  senderAuth: {
    status: "pass" | "fail" | "neutral";
    spf: "pass" | "fail" | "neutral";
    dkim: "pass" | "fail" | "neutral";
  };
  scanStatus: "clean" | "suspicious" | "flagged";
  grossAmount: number;
  currency: "USDC" | "USDG" | "SOL" | "USDT" | "ETH";
  chain: "solana" | "base" | "ethereum" | "arbitrum" | "polygon";
  txHash?: string;
  receivedAt: string;
}

export interface TreasuryAuditReport {
  periodId: string;
  generatedAt: string;
  totalInflowUsd: number;
  allocatedReserves: {
    operatingExpenseReserveUsd: number;
    surplusProfitUsd: number;
  };
  destinationVaultAddress: string;
  payboxRequestId?: string;
  auditSignature: string;
}
