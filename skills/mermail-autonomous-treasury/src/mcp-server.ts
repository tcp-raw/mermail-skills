/**
 * Mermail Autonomous Treasury - Native MCP Tool Server
 * Implements standard Model Context Protocol (JSON-RPC 2.0) interface for AI clients.
 */

import { MermailTreasuryEngine } from "./treasury-engine.js";
import { CryptographicLedger } from "./ledger.js";
import { MultiChainCryptoVerifier } from "./crypto-verifier.js";
import { InboundRevenueEvent } from "./types.js";

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required: string[];
  };
}

export class MermailTreasuryMcpServer {
  private engine: MermailTreasuryEngine;
  private ledger: CryptographicLedger;

  constructor(ownerVaultAddress: string, reservePercentage: number = 25) {
    this.engine = new MermailTreasuryEngine(ownerVaultAddress, reservePercentage);
    this.ledger = new CryptographicLedger();
  }

  public getToolDefinitions(): McpToolDefinition[] {
    return [
      {
        name: "treasury_audit_inflow",
        description: "Audit and validate inbound email billing and payment notifications with SPF/DKIM verification.",
        inputSchema: {
          type: "object",
          properties: {
            events: {
              type: "array",
              description: "List of parsed email revenue events",
              items: { type: "object" }
            }
          },
          required: ["events"]
        }
      },
      {
        name: "treasury_calculate_allocation",
        description: "Calculate automated 25% compute reserve retention and 75% owner surplus profit.",
        inputSchema: {
          type: "object",
          properties: {
            verifiedInflowTotal: { type: "number", description: "Total verified gross inflow amount in USD" }
          },
          required: ["verifiedInflowTotal"]
        }
      },
      {
        name: "treasury_verify_onchain_settlement",
        description: "Verify on-chain transaction hash or signature format across Solana, Base, Ethereum, Polygon.",
        inputSchema: {
          type: "object",
          properties: {
            txHashOrSignature: { type: "string", description: "The transaction hash or signature string" },
            chain: { type: "string", enum: ["solana", "base", "ethereum", "arbitrum", "polygon"] },
            recipientAddress: { type: "string", description: "The receiving wallet address" }
          },
          required: ["txHashOrSignature", "chain", "recipientAddress"]
        }
      },
      {
        name: "treasury_generate_digest",
        description: "Generate a formatted executive financial P&L digest email draft for workspace owner.",
        inputSchema: {
          type: "object",
          properties: {
            periodId: { type: "string", description: "Reporting period string (e.g. 2026-W35)" }
          },
          required: ["periodId"]
        }
      }
    ];
  }

  public async handleToolCall(name: string, args: any): Promise<any> {
    switch (name) {
      case "treasury_audit_inflow": {
        const events: InboundRevenueEvent[] = args.events || [];
        const validatedEvents = [];
        for (const ev of events) {
          const val = this.engine.validateInboundEvent(ev);
          if (val.isValid) {
            this.ledger.appendRevenueEntry(ev);
            validatedEvents.push(ev);
          }
        }
        return {
          totalEventsProcessed: events.length,
          verifiedEventsCount: validatedEvents.length,
          grossInflowUsd: validatedEvents.reduce((acc, curr) => acc + curr.grossAmount, 0),
          ledgerIntegrityPass: this.ledger.verifyIntegrity()
        };
      }

      case "treasury_calculate_allocation": {
        const total = Number(args.verifiedInflowTotal);
        const reserve = Number((total * 0.25).toFixed(2));
        const surplus = Number((total - reserve).toFixed(2));
        return {
          grossInflowUsd: total,
          operatingReserveRetainedUsd: reserve,
          surplusTransferredUsd: surplus,
          splitRatio: "25% Reserve / 75% Surplus"
        };
      }

      case "treasury_verify_onchain_settlement": {
        return MultiChainCryptoVerifier.verifySettlementReceipt(
          args.txHashOrSignature,
          args.chain,
          args.recipientAddress
        );
      }

      case "treasury_generate_digest": {
        const mockReport = this.engine.calculateAllocation([]);
        return this.engine.generateExecutiveDigest(mockReport);
      }

      default:
        throw new Error(`Unknown MCP Tool: ${name}`);
    }
  }
}
