// Deploy EscrowMilestone + TrustRegistry to Sepolia.
// Usage (locally, in contracts/):  npx hardhat run scripts/deploy.js --network sepolia
// Optional env: VERIFIER_ADDRESS, REGISTRAR_ADDRESS (default = deployer)
const hre = require("hardhat");

async function main() {
  const { chainId } = await hre.ethers.provider.getNetwork();
  if (chainId !== 11155111n && chainId !== 31337n) {
    throw new Error(`Refusing to deploy: chainId ${chainId} is not Sepolia (11155111).`);
  }
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) throw new Error("DEPLOYER_PRIVATE_KEY is not set in your local environment.");
  const verifier = process.env.VERIFIER_ADDRESS || deployer.address;
  const registrar = process.env.REGISTRAR_ADDRESS || deployer.address;

  console.log("Network  :", hre.network.name, `(chainId ${chainId})`);
  console.log("Deployer :", deployer.address);
  console.log("Balance  :", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "SepoliaETH");

  const Escrow = await hre.ethers.getContractFactory("EscrowMilestone");
  const escrow = await Escrow.deploy(deployer.address, verifier);
  await escrow.waitForDeployment();
  console.log("EscrowMilestone :", await escrow.getAddress(), "tx", escrow.deploymentTransaction().hash);

  const Registry = await hre.ethers.getContractFactory("TrustRegistry");
  const registry = await Registry.deploy(deployer.address, registrar);
  await registry.waitForDeployment();
  console.log("TrustRegistry   :", await registry.getAddress(), "tx", registry.deploymentTransaction().hash);

  console.log("\nPaste these into the EduChain app settings:");
  console.log(`VITE_ESCROW_CONTRACT_ADDRESS=${await escrow.getAddress()}`);
  console.log(`VITE_TRUST_REGISTRY_ADDRESS=${await registry.getAddress()}`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
