import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

// Public WalletConnect Cloud project ID (https://cloud.reown.com). Not a secret.
export const WALLETCONNECT_PROJECT_ID =
  (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined)?.trim() ||
  "770d0e31e43c9546ff55c536115fb18b";

export const TARGET_CHAIN = sepolia;

const appMeta = {
  name: "EduChain UMKM",
  description: "Ekosistem Smart Economy Berbasis Web3 untuk UMKM",
  url: typeof window !== "undefined" ? window.location.origin : "https://g211230016.lovable.app",
  icons: [] as string[],
};

const connectors = [
  injected({ target: "metaMask" }),
  coinbaseWallet({ appName: appMeta.name, preference: "all" }),
  ...(WALLETCONNECT_PROJECT_ID
    ? [walletConnect({ projectId: WALLETCONNECT_PROJECT_ID, metadata: appMeta, showQrModal: true })]
    : []),
];

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors,
  transports: { [sepolia.id]: http() },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
