import { isAddress, type Address } from "viem";
import { TARGET_CHAIN } from "@/lib/wagmi";

// Frontend only ever knows public data: addresses, ABI, chain ID. No private keys.
const read = (v: unknown): Address | undefined => {
  const s = typeof v === "string" ? v.trim() : "";
  return isAddress(s) ? (s as Address) : undefined;
};

export const ESCROW_ADDRESS = read(import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS);
export const TRUST_REGISTRY_ADDRESS = read(import.meta.env.VITE_TRUST_REGISTRY_ADDRESS);
export const CONTRACT_CHAIN_ID = TARGET_CHAIN.id; // 11155111 (Sepolia)

export const explorerTx = (hash: string) => `https://sepolia.etherscan.io/tx/${hash}`;
export const explorerAddress = (a: string) => `https://sepolia.etherscan.io/address/${a}`;

export const PROJECT_STATUS = ["Active", "Funded", "Completed", "Cancelled"] as const;
export const MILESTONE_STATUS = ["Pending", "Evidence Submitted", "Approved", "Released"] as const;
