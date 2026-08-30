import assert from "node:assert";
import test from "node:test";

// Mock implementation of Treasury Engine for Node test runner
class MermailTreasuryEngine {
  constructor(ownerVaultAddress, operatingReservePct = 25) {
    this.ownerVaultAddress = ownerVaultAddress;
    this.operatingReservePct = operatingReservePct;
  }

  validateInboundEvent(event) {
    if (event.senderAuth.status !== "pass" || event.senderAuth.spf !== "pass" || event.senderAuth.dkim !== "pass") {
      return { isValid: false, reason: "Sender SPF/DKIM verification failed." };
    }
    if (event.scanStatus !== "clean") {
      return { isValid: false, reason: "Security scan flagged suspicious content." };
    }
    if (event.grossAmount <= 0) {
      return { isValid: false, reason: "Invalid gross amount." };
    }
    return { isValid: true };
  }

  calculateAllocation(events) {
    let totalInflow = 0;
    for (const ev of events) {
      if (this.validateInboundEvent(ev).isValid) {
        totalInflow += ev.grossAmount;
      }
    }
    const operatingReserve = totalInflow * (this.operatingReservePct / 100);
    const surplusProfit = totalInflow - operatingReserve;
    return {
      totalInflowUsd: Number(totalInflow.toFixed(2)),
      operatingExpenseReserveUsd: Number(operatingReserve.toFixed(2)),
      surplusProfitUsd: Number(surplusProfit.toFixed(2)),
      destinationVault: this.ownerVaultAddress
    };
  }
}

test("Mermail Autonomous Treasury - Unit Test Suite", async (t) => {
  const VAULT = "0xefd8917437C1E9cB98f83A783F25AA1a2AC3bBC5";
  const engine = new MermailTreasuryEngine(VAULT, 25);

  await t.test("Validates authentic inbound revenue events", () => {
    const validEvent = {
      id: "ev_1",
      senderEmail: "billing@stripe.com",
      senderAuth: { status: "pass", spf: "pass", dkim: "pass" },
      scanStatus: "clean",
      grossAmount: 1000.0,
      currency: "USDC"
    };
    const res = engine.validateInboundEvent(validEvent);
    assert.strictEqual(res.isValid, true);
  });

  await t.test("Rejects spoofed / unauthenticated email payloads", () => {
    const spoofedEvent = {
      id: "ev_2",
      senderEmail: "fake-billing@stripe.com",
      senderAuth: { status: "fail", spf: "fail", dkim: "fail" },
      scanStatus: "clean",
      grossAmount: 500.0,
      currency: "USDC"
    };
    const res = engine.validateInboundEvent(spoofedEvent);
    assert.strictEqual(res.isValid, false);
    assert.match(res.reason, /SPF\/DKIM/);
  });

  await t.test("Rejects suspicious or malicious content scan payloads", () => {
    const maliciousEvent = {
      id: "ev_3",
      senderEmail: "billing@legit.com",
      senderAuth: { status: "pass", spf: "pass", dkim: "pass" },
      scanStatus: "flagged",
      grossAmount: 5000.0,
      currency: "USDC"
    };
    const res = engine.validateInboundEvent(maliciousEvent);
    assert.strictEqual(res.isValid, false);
    assert.match(res.reason, /Security scan/);
  });

  await t.test("Correctly executes 25% compute reserve and 75% surplus allocation math", () => {
    const events = [
      { id: "1", senderAuth: { status: "pass", spf: "pass", dkim: "pass" }, scanStatus: "clean", grossAmount: 800.0 },
      { id: "2", senderAuth: { status: "pass", spf: "pass", dkim: "pass" }, scanStatus: "clean", grossAmount: 1200.0 },
      // Spoofed event should be discarded from total
      { id: "3", senderAuth: { status: "fail", spf: "fail", dkim: "fail" }, scanStatus: "clean", grossAmount: 5000.0 }
    ];
    const report = engine.calculateAllocation(events);
    assert.strictEqual(report.totalInflowUsd, 2000.0);
    assert.strictEqual(report.operatingExpenseReserveUsd, 500.0); // 25% of 2000
    assert.strictEqual(report.surplusProfitUsd, 1500.0); // 75% of 2000
    assert.strictEqual(report.destinationVault, VAULT);
  });
});
