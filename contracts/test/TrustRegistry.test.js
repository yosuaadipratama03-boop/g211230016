const { expect } = require("chai");
const { ethers } = require("hardhat");

const H = (s) => ethers.keccak256(ethers.toUtf8Bytes(s));

describe("TrustRegistry", () => {
  async function deploy() {
    const [admin, registrar, umkm, stranger] = await ethers.getSigners();
    const R = await ethers.getContractFactory("TrustRegistry");
    const reg = await R.deploy(admin.address, registrar.address);
    return { reg, admin, registrar, umkm, stranger, R };
  }

  it("constructor validates admin and optional registrar", async () => {
    const { reg, R, admin } = await deploy();
    await expect(R.deploy(ethers.ZeroAddress, admin.address)).to.be.revertedWithCustomError(reg, "InvalidParams");
    const r2 = await R.deploy(admin.address, ethers.ZeroAddress);
    expect(await r2.hasRole(await r2.REGISTRAR_ROLE(), admin.address)).to.equal(false);
  });

  it("records trust score hash with incrementing version", async () => {
    const { reg, registrar, umkm } = await deploy();
    await expect(reg.connect(registrar).recordTrustScoreHash(umkm.address, H("s1"))).to.emit(reg, "TrustScoreRecorded");
    await reg.connect(registrar).recordTrustScoreHash(umkm.address, H("s2"));
    const r = await reg.getTrustScoreRecord(umkm.address);
    expect(r.scoreHash).to.equal(H("s2"));
    expect(r.version).to.equal(2);
    expect(r.recordedBy).to.equal(registrar.address);
  });

  it("rejects invalid trust input and unauthorized writers", async () => {
    const { reg, registrar, umkm, stranger } = await deploy();
    await expect(reg.connect(registrar).recordTrustScoreHash(ethers.ZeroAddress, H("s"))).to.be.revertedWithCustomError(reg, "InvalidParams");
    await expect(reg.connect(registrar).recordTrustScoreHash(umkm.address, ethers.ZeroHash)).to.be.revertedWithCustomError(reg, "InvalidParams");
    await expect(reg.connect(stranger).recordTrustScoreHash(umkm.address, H("s"))).to.be.revertedWithCustomError(reg, "AccessControlUnauthorizedAccount");
    await expect(reg.connect(stranger).recordEducationCertificate(umkm.address, H("c"), 1)).to.be.revertedWithCustomError(reg, "AccessControlUnauthorizedAccount");
  });

  it("records, then revokes an education certificate", async () => {
    const { reg, registrar, umkm } = await deploy();
    await expect(reg.connect(registrar).recordEducationCertificate(umkm.address, H("c"), 1)).to.emit(reg, "EducationCertificateRecorded");
    await reg.connect(registrar).recordEducationCertificate(umkm.address, ethers.ZeroHash, 2);
    const c = await reg.getEducationCertificate(umkm.address);
    expect(c.certificateHash).to.equal(H("c"));
    expect(c.status).to.equal(2);
  });

  it("rejects invalid certificate input", async () => {
    const { reg, registrar, umkm } = await deploy();
    await expect(reg.connect(registrar).recordEducationCertificate(ethers.ZeroAddress, H("c"), 1)).to.be.revertedWithCustomError(reg, "InvalidParams");
    await expect(reg.connect(registrar).recordEducationCertificate(umkm.address, H("c"), 0)).to.be.revertedWithCustomError(reg, "InvalidParams");
    await expect(reg.connect(registrar).recordEducationCertificate(umkm.address, ethers.ZeroHash, 1)).to.be.revertedWithCustomError(reg, "InvalidParams");
  });

  it("pause blocks writes; only admin can pause", async () => {
    const { reg, admin, registrar, umkm, stranger } = await deploy();
    await expect(reg.connect(stranger).pause()).to.be.revertedWithCustomError(reg, "AccessControlUnauthorizedAccount");
    await reg.connect(admin).pause();
    await expect(reg.connect(registrar).recordTrustScoreHash(umkm.address, H("s"))).to.be.revertedWithCustomError(reg, "EnforcedPause");
    await expect(reg.connect(registrar).recordEducationCertificate(umkm.address, H("c"), 1)).to.be.revertedWithCustomError(reg, "EnforcedPause");
    await reg.connect(admin).unpause();
    await reg.connect(registrar).recordTrustScoreHash(umkm.address, H("s"));
  });
});
