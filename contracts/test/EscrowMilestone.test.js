const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const E = (v) => ethers.parseEther(v);
const H = (s) => ethers.keccak256(ethers.toUtf8Bytes(s));
const DAY = 24 * 3600;

describe("EscrowMilestone", () => {
  async function deploy() {
    const [admin, verifier, owner, inv1, inv2, stranger] = await ethers.getSigners();
    const Escrow = await ethers.getContractFactory("EscrowMilestone");
    const escrow = await Escrow.deploy(admin.address, verifier.address);
    return { escrow, admin, verifier, owner, inv1, inv2, stranger };
  }
  async function withProject() {
    const f = await deploy();
    await f.escrow.connect(f.owner).createProject(E("1"), [3000, 3000, 4000], DAY, "ipfs://meta");
    return { ...f, pid: 1n };
  }
  async function funded() {
    const f = await withProject();
    await f.escrow.connect(f.inv1).fundProject(1, { value: E("0.6") });
    await f.escrow.connect(f.inv2).fundProject(1, { value: E("0.4") });
    return f;
  }
  async function approved() {
    const f = await funded();
    await f.escrow.connect(f.owner).submitMilestoneEvidence(1, 0, H("bukti-0"));
    await f.escrow.connect(f.verifier).approveMilestone(1, 0);
    return f;
  }

  describe("deployment", () => {
    it("assigns roles and rejects zero admin", async () => {
      const { escrow, admin, verifier } = await loadFixture(deploy);
      expect(await escrow.hasRole(await escrow.DEFAULT_ADMIN_ROLE(), admin.address)).to.equal(true);
      expect(await escrow.hasRole(await escrow.VERIFIER_ROLE(), verifier.address)).to.equal(true);
      const Escrow = await ethers.getContractFactory("EscrowMilestone");
      await expect(Escrow.deploy(ethers.ZeroAddress, verifier.address)).to.be.revertedWithCustomError(escrow, "InvalidParams");
      const e2 = await Escrow.deploy(admin.address, ethers.ZeroAddress);
      expect(await e2.hasRole(await e2.VERIFIER_ROLE(), ethers.ZeroAddress)).to.equal(false);
    });
  });

  describe("1-2. createProject", () => {
    it("creates a project with milestones", async () => {
      const { escrow, owner } = await loadFixture(deploy);
      await expect(escrow.connect(owner).createProject(E("1"), [5000, 5000], DAY, "m"))
        .to.emit(escrow, "ProjectCreated");
      const p = await escrow.getProject(1);
      expect(p.owner).to.equal(owner.address);
      expect(p.targetAmount).to.equal(E("1"));
      expect(p.milestoneCount).to.equal(2);
      expect(p.status).to.equal(0);
      expect((await escrow.getMilestone(1, 1)).percentageBps).to.equal(5000);
    });
    it("rejects invalid parameters", async () => {
      const { escrow, owner } = await loadFixture(deploy);
      const c = escrow.connect(owner);
      await expect(c.createProject(0, [10000], DAY, "")).to.be.revertedWithCustomError(escrow, "InvalidParams");
      await expect(c.createProject(E("1"), [], DAY, "")).to.be.revertedWithCustomError(escrow, "InvalidParams");
      await expect(c.createProject(E("1"), Array(11).fill(909), DAY, "")).to.be.revertedWithCustomError(escrow, "InvalidParams");
      await expect(c.createProject(E("1"), [10000], 60, "")).to.be.revertedWithCustomError(escrow, "InvalidParams");
      await expect(c.createProject(E("1"), [10000], 400 * DAY, "")).to.be.revertedWithCustomError(escrow, "InvalidParams");
      await expect(c.createProject(E("1"), [10000], DAY, "x".repeat(257))).to.be.revertedWithCustomError(escrow, "InvalidParams");
      await expect(c.createProject(E("1"), [0, 10000], DAY, "")).to.be.revertedWithCustomError(escrow, "InvalidParams");
      await expect(c.createProject(E("1"), [5000, 4000], DAY, "")).to.be.revertedWithCustomError(escrow, "InvalidParams");
    });
    it("16. rejects milestone total above 100%", async () => {
      const { escrow, owner } = await loadFixture(deploy);
      await expect(escrow.connect(owner).createProject(E("1"), [6000, 5000], DAY, "")).to.be.revertedWithCustomError(escrow, "InvalidParams");
    });
  });

  describe("3-5. funding & escrow", () => {
    it("investor funds, ETH sits in escrow, contribution tracked", async () => {
      const { escrow, inv1, owner } = await loadFixture(withProject);
      const before = await ethers.provider.getBalance(owner.address);
      await expect(escrow.connect(inv1).fundProject(1, { value: E("0.3") }))
        .to.emit(escrow, "ProjectFunded").withArgs(1, inv1.address, E("0.3"), E("0.3"));
      expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(E("0.3"));
      expect(await ethers.provider.getBalance(owner.address)).to.equal(before);
      expect(await escrow.getInvestorContribution(1, inv1.address)).to.equal(E("0.3"));
    });
    it("marks Funded when target reached", async () => {
      const { escrow } = await loadFixture(funded);
      expect((await escrow.getProject(1)).status).to.equal(1);
    });
    it("rejects zero, overfunding, owner self-funding, unknown project, expired", async () => {
      const { escrow, inv1, owner } = await loadFixture(withProject);
      await expect(escrow.connect(inv1).fundProject(1, { value: 0 })).to.be.revertedWithCustomError(escrow, "AmountInvalid");
      await expect(escrow.connect(inv1).fundProject(1, { value: E("1.1") })).to.be.revertedWithCustomError(escrow, "AmountInvalid");
      await expect(escrow.connect(owner).fundProject(1, { value: E("0.1") })).to.be.revertedWithCustomError(escrow, "InvalidParams");
      await expect(escrow.connect(inv1).fundProject(9, { value: E("0.1") })).to.be.revertedWithCustomError(escrow, "ProjectNotFound");
      await expect(escrow.connect(inv1).fundProject(0, { value: E("0.1") })).to.be.revertedWithCustomError(escrow, "ProjectNotFound");
      await time.increase(DAY + 1);
      await expect(escrow.connect(inv1).fundProject(1, { value: E("0.1") })).to.be.revertedWithCustomError(escrow, "InvalidStatus");
    });
    it("5. investor cannot pull funds directly (no withdraw, refund blocked while active)", async () => {
      const { escrow, inv1 } = await loadFixture(funded);
      expect(escrow.withdrawAll).to.equal(undefined);
      await expect(escrow.connect(inv1).claimRefund(1)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
      await expect(escrow.connect(inv1).releaseMilestone(1, 0)).to.be.revertedWithCustomError(escrow, "NotProjectOwner");
    });
    it("rejects plain ETH transfers", async () => {
      const { escrow, inv1 } = await loadFixture(deploy);
      await expect(inv1.sendTransaction({ to: await escrow.getAddress(), value: 1 })).to.be.revertedWithCustomError(escrow, "AmountInvalid");
    });
  });

  describe("6-7. evidence", () => {
    it("owner submits evidence hash (and may resubmit before approval)", async () => {
      const { escrow, owner } = await loadFixture(funded);
      await expect(escrow.connect(owner).submitMilestoneEvidence(1, 0, H("a")))
        .to.emit(escrow, "MilestoneEvidenceSubmitted").withArgs(1, 0, H("a"));
      await escrow.connect(owner).submitMilestoneEvidence(1, 0, H("b"));
      const m = await escrow.getMilestone(1, 0);
      expect(m.evidenceHash).to.equal(H("b"));
      expect(m.status).to.equal(1);
    });
    it("rejects empty hash, non-owner, bad milestone, not-funded project, already approved", async () => {
      const f = await loadFixture(withProject);
      await expect(f.escrow.connect(f.owner).submitMilestoneEvidence(1, 0, H("a"))).to.be.revertedWithCustomError(f.escrow, "InvalidStatus");
      const g = await loadFixture(approved);
      await expect(g.escrow.connect(g.owner).submitMilestoneEvidence(1, 1, ethers.ZeroHash)).to.be.revertedWithCustomError(g.escrow, "InvalidParams");
      await expect(g.escrow.connect(g.stranger).submitMilestoneEvidence(1, 1, H("a"))).to.be.revertedWithCustomError(g.escrow, "NotProjectOwner");
      await expect(g.escrow.connect(g.owner).submitMilestoneEvidence(1, 5, H("a"))).to.be.revertedWithCustomError(g.escrow, "InvalidMilestone");
      await expect(g.escrow.connect(g.owner).submitMilestoneEvidence(1, 0, H("a"))).to.be.revertedWithCustomError(g.escrow, "InvalidStatus");
    });
  });

  describe("8-9. approval", () => {
    it("verifier approves milestone", async () => {
      const { escrow, verifier } = await loadFixture(approved);
      const m = await escrow.getMilestone(1, 0);
      expect(m.status).to.equal(2);
      expect(m.approvedBy).to.equal(verifier.address);
    });
    it("non-verifier cannot approve; evidence required; bad ids rejected", async () => {
      const { escrow, owner, verifier, stranger } = await loadFixture(funded);
      await escrow.connect(owner).submitMilestoneEvidence(1, 0, H("a"));
      await expect(escrow.connect(stranger).approveMilestone(1, 0)).to.be.revertedWithCustomError(escrow, "AccessControlUnauthorizedAccount");
      await expect(escrow.connect(owner).approveMilestone(1, 0)).to.be.revertedWithCustomError(escrow, "AccessControlUnauthorizedAccount");
      await expect(escrow.connect(verifier).approveMilestone(1, 1)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
      await expect(escrow.connect(verifier).approveMilestone(1, 7)).to.be.revertedWithCustomError(escrow, "InvalidMilestone");
    });
    it("cannot approve on non-funded project", async () => {
      const { escrow, verifier } = await loadFixture(withProject);
      await expect(escrow.connect(verifier).approveMilestone(1, 0)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
    });
  });

  describe("10-12. release", () => {
    it("10. unapproved milestone cannot be released", async () => {
      const { escrow, owner } = await loadFixture(funded);
      await expect(escrow.connect(owner).releaseMilestone(1, 0)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
      await escrow.connect(owner).submitMilestoneEvidence(1, 0, H("a"));
      await expect(escrow.connect(owner).releaseMilestone(1, 0)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
      await expect(escrow.connect(owner).releaseMilestone(1, 9)).to.be.revertedWithCustomError(escrow, "InvalidMilestone");
    });
    it("12. owner receives milestone share after approval; 11. no double release", async () => {
      const { escrow, owner } = await loadFixture(approved);
      await expect(escrow.connect(owner).releaseMilestone(1, 0)).to.changeEtherBalances([owner, escrow], [E("0.3"), -E("0.3")]);
      const m = await escrow.getMilestone(1, 0);
      expect(m.released).to.equal(true);
      expect(m.releasedAmount).to.equal(E("0.3"));
      await expect(escrow.connect(owner).releaseMilestone(1, 0)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
    });
    it("verifier may trigger release; all milestones → Completed", async () => {
      const { escrow, owner, verifier } = await loadFixture(approved);
      await escrow.connect(verifier).releaseMilestone(1, 0);
      for (const i of [1, 2]) {
        await escrow.connect(owner).submitMilestoneEvidence(1, i, H("e" + i));
        await escrow.connect(verifier).approveMilestone(1, i);
        await escrow.connect(owner).releaseMilestone(1, i);
      }
      const p = await escrow.getProject(1);
      expect(p.status).to.equal(2);
      expect(p.releasedAmount).to.equal(E("1"));
      expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(0);
      await expect(escrow.connect(owner).releaseMilestone(1, 2)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
    });
    it("last milestone absorbs rounding dust", async () => {
      const { escrow, owner, verifier, inv1 } = await loadFixture(deploy);
      await escrow.connect(owner).createProject(10n, [3333, 3333, 3334], DAY, "");
      await escrow.connect(inv1).fundProject(1, { value: 10n });
      for (const i of [0, 1, 2]) {
        await escrow.connect(owner).submitMilestoneEvidence(1, i, H("d" + i));
        await escrow.connect(verifier).approveMilestone(1, i);
        await escrow.connect(owner).releaseMilestone(1, i);
      }
      expect((await escrow.getProject(1)).releasedAmount).to.equal(10n);
    });
    it("reverts with TransferFailed when owner rejects ETH", async () => {
      const { escrow, verifier, inv1 } = await loadFixture(deploy);
      const R = await ethers.getContractFactory("RejectingOwner");
      const r = await R.deploy(await escrow.getAddress());
      await r.create(E("1"), [10000]);
      await escrow.connect(inv1).fundProject(1, { value: E("1") });
      await r.submit(0, H("x"));
      await escrow.connect(verifier).approveMilestone(1, 0);
      await expect(r.release(0)).to.be.revertedWithCustomError(escrow, "TransferFailed");
    });
  });

  describe("13. access control", () => {
    it("restricted functions reject unauthorized accounts", async () => {
      const { escrow, stranger, owner } = await loadFixture(approved);
      await expect(escrow.connect(stranger).pause()).to.be.revertedWithCustomError(escrow, "AccessControlUnauthorizedAccount");
      await expect(escrow.connect(stranger).unpause()).to.be.revertedWithCustomError(escrow, "AccessControlUnauthorizedAccount");
      await expect(escrow.connect(stranger).releaseMilestone(1, 0)).to.be.revertedWithCustomError(escrow, "NotProjectOwner");
      await expect(escrow.connect(stranger).cancelProject(1)).to.be.revertedWithCustomError(escrow, "NotProjectOwner");
      await expect(escrow.connect(stranger).grantRole(await escrow.VERIFIER_ROLE(), stranger.address))
        .to.be.revertedWithCustomError(escrow, "AccessControlUnauthorizedAccount");
      await expect(escrow.connect(owner).pause()).to.be.revertedWithCustomError(escrow, "AccessControlUnauthorizedAccount");
    });
  });

  describe("14. reentrancy", () => {
    it("owner contract cannot re-enter releaseMilestone", async () => {
      const { escrow, verifier, inv1 } = await loadFixture(deploy);
      const A = await ethers.getContractFactory("ReentrancyAttacker");
      const a = await A.deploy(await escrow.getAddress());
      await a.create(E("1"), [5000, 5000]);
      await escrow.connect(inv1).fundProject(1, { value: E("1") });
      await a.submit(0, H("x"));
      await escrow.connect(verifier).approveMilestone(1, 0);
      await a.release(0, 1);
      expect(await a.reentered()).to.equal(true);
      expect(await a.reentrySucceeded()).to.equal(false);
      expect(await ethers.provider.getBalance(await a.getAddress())).to.equal(E("0.5"));
    });
    it("investor contract cannot re-enter claimRefund", async () => {
      const { escrow, owner, inv1 } = await loadFixture(withProject);
      const A = await ethers.getContractFactory("ReentrancyAttacker");
      const a = await A.deploy(await escrow.getAddress());
      await a.fund(1, { value: E("0.2") });
      await escrow.connect(inv1).fundProject(1, { value: E("0.3") });
      await escrow.connect(owner).cancelProject(1);
      await a.refund(2);
      expect(await a.reentered()).to.equal(true);
      expect(await a.reentrySucceeded()).to.equal(false);
      expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(E("0.3"));
    });
  });

  describe("15. pause", () => {
    it("pause blocks create/fund/evidence/approve/release; refunds still allowed", async () => {
      const { escrow, admin, owner, verifier, inv1 } = await loadFixture(approved);
      await escrow.connect(admin).pause();
      await expect(escrow.connect(owner).createProject(E("1"), [10000], DAY, "")).to.be.revertedWithCustomError(escrow, "EnforcedPause");
      await expect(escrow.connect(inv1).fundProject(1, { value: 1 })).to.be.revertedWithCustomError(escrow, "EnforcedPause");
      await expect(escrow.connect(owner).submitMilestoneEvidence(1, 1, H("a"))).to.be.revertedWithCustomError(escrow, "EnforcedPause");
      await expect(escrow.connect(verifier).approveMilestone(1, 1)).to.be.revertedWithCustomError(escrow, "EnforcedPause");
      await expect(escrow.connect(owner).releaseMilestone(1, 0)).to.be.revertedWithCustomError(escrow, "EnforcedPause");
      await escrow.connect(admin).cancelProject(1);
      await expect(escrow.connect(inv1).claimRefund(1)).to.changeEtherBalance(inv1, E("0.6"));
      await escrow.connect(admin).unpause();
      await expect(escrow.connect(owner).createProject(E("1"), [10000], DAY, "")).to.emit(escrow, "ProjectCreated");
    });
  });

  describe("17. cancel & refund", () => {
    it("cancelled project rejects new funding and lets investors refund once", async () => {
      const { escrow, owner, inv1, inv2 } = await loadFixture(withProject);
      await escrow.connect(inv1).fundProject(1, { value: E("0.5") });
      await expect(escrow.connect(owner).cancelProject(1)).to.emit(escrow, "ProjectCancelled").withArgs(1, owner.address);
      await expect(escrow.connect(inv2).fundProject(1, { value: E("0.1") })).to.be.revertedWithCustomError(escrow, "InvalidStatus");
      await expect(escrow.connect(inv1).claimRefund(1)).to.emit(escrow, "Refunded").withArgs(1, inv1.address, E("0.5"));
      await expect(escrow.connect(inv1).claimRefund(1)).to.be.revertedWithCustomError(escrow, "NothingToRefund");
      await expect(escrow.connect(owner).cancelProject(1)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
      expect((await escrow.getProject(1)).refundedAmount).to.equal(E("0.5"));
    });
    it("refund allowed after deadline if target not reached", async () => {
      const { escrow, inv1 } = await loadFixture(withProject);
      await escrow.connect(inv1).fundProject(1, { value: E("0.5") });
      await time.increase(DAY + 1);
      await expect(escrow.connect(inv1).claimRefund(1)).to.changeEtherBalance(inv1, E("0.5"));
    });
    it("cannot cancel after a milestone has been released", async () => {
      const { escrow, owner, admin } = await loadFixture(approved);
      await escrow.connect(owner).releaseMilestone(1, 0);
      await expect(escrow.connect(admin).cancelProject(1)).to.be.revertedWithCustomError(escrow, "InvalidStatus");
    });
    it("read helpers validate ids", async () => {
      const { escrow } = await loadFixture(withProject);
      await expect(escrow.getProject(2)).to.be.revertedWithCustomError(escrow, "ProjectNotFound");
      await expect(escrow.getMilestone(1, 3)).to.be.revertedWithCustomError(escrow, "InvalidMilestone");
    });
  });
});
