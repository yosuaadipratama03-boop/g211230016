import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Link2, Wallet, Check, Loader2, AlertTriangle, LogOut, Copy } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import { TARGET_CHAIN, WALLETCONNECT_PROJECT_ID } from "@/lib/wagmi";
import { friendlyWalletError, shortAddr } from "@/lib/walletErrors";

const links = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
];

const wallets = [
  { name: "MetaMask", desc: "Wallet browser paling populer", connectorId: "metaMask" },
  { name: "WalletConnect", desc: "Scan QR dari wallet mobile", connectorId: "walletConnect" },
  { name: "Coinbase Wallet", desc: "Terhubung ke Coinbase", connectorId: "coinbaseWalletSDK" },
];

const chainName = (id?: number) =>
  id === 11155111 ? "Sepolia Testnet" : id === 1 ? "Ethereum Mainnet" : id ? `Chain ${id}` : "-";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const { address, chainId, connector, isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: switching } = useSwitchChain();
  const wrongNetwork = isConnected && chainId !== TARGET_CHAIN.id;

  const prev = useRef<{ address?: string; chainId?: number }>({});
  useEffect(() => {
    const p = prev.current;
    if (isConnected && p.address && address && p.address !== address)
      toast.info("Akun wallet berubah", { description: shortAddr(address) });
    if (isConnected && p.chainId && chainId && p.chainId !== chainId)
      toast.info("Network berubah", { description: chainName(chainId) });
    prev.current = { address, chainId };
  }, [address, chainId, isConnected]);

  const handleConnect = async (w: (typeof wallets)[number]) => {
    const c = connectors.find((x) => x.id === w.connectorId);
    if (!c) {
      toast.error("WalletConnect belum dikonfigurasi", {
        description: "WalletConnect Project ID belum diisi oleh pemilik website.",
      });
      return;
    }
    setConnecting(w.name);
    try {
      if (w.connectorId === "metaMask") setOpen(true);
      if (w.connectorId === "walletConnect") setOpen(false); // let WC QR modal take focus
      const res = await connectAsync({ connector: c });
      setOpen(false);
      toast.success(`${w.name} terhubung`, { description: shortAddr(res.accounts[0]) });
    } catch (err) {
      console.warn(`[wallet] ${w.name} connect failed`, err);
      toast.error(friendlyWalletError(err, w.name));
    } finally {
      setConnecting(null);
    }
  };

  const handleSwitch = async () => {
    try {
      await switchChainAsync({ chainId: TARGET_CHAIN.id });
      toast.success("Berpindah ke Sepolia Testnet");
    } catch (err) {
      toast.error(friendlyWalletError(err, connector?.name ?? "Wallet"));
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setOpen(false);
    toast("Wallet diputus dari EduChain", {
      description: "Izin di aplikasi wallet Anda tetap bisa dicabut secara manual.",
    });
  };

  return (
  <motion.header
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
  >
    <nav className="container mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
      <a href="#" className="flex items-center gap-2">
        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center glow-mint">
          <Link2 className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="font-display font-bold text-lg leading-none">
          EduChain<span className="text-gradient-mint"> UMKM</span>
        </div>
      </a>
      <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
          </li>
        ))}
        <li>
          <Link to="/explore" className="hover:text-foreground transition-colors">Explore</Link>
        </li>
        <li>
          <Link to="/transactions" className="hover:text-foreground transition-colors">Transactions</Link>
        </li>
        <li>
          <Link to="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
        </li>
      </ul>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-105 ${wrongNetwork ? "bg-destructive text-destructive-foreground" : "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-mint"}`}>
            {isConnected
              ? wrongNetwork
                ? <><AlertTriangle className="h-4 w-4" /> Wrong Network</>
                : <><Check className="h-4 w-4" /> {shortAddr(address)}</>
              : <><Wallet className="h-4 w-4" /> Connect Wallet</>}
          </button>
        </DialogTrigger>
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{isConnected ? "Wallet Terhubung" : "Hubungkan Wallet"}</DialogTitle>
            <DialogDescription>
              {isConnected
                ? "Detail wallet aktif Anda di EduChain UMKM."
                : "Hubungkan wallet Anda ke EduChain UMKM untuk menggunakan fitur blockchain."}
            </DialogDescription>
          </DialogHeader>

          {isConnected ? (
            <div className="space-y-3 mt-2">
              <div className="rounded-2xl glass p-4 space-y-3 text-sm">
                <Row label="Status"><span className="text-primary font-semibold">Connected</span></Row>
                <Row label="Wallet">{connector?.name}</Row>
                <Row label="Alamat">
                  <button
                    className="font-mono text-xs inline-flex items-center gap-1.5 hover:text-primary"
                    onClick={() => { navigator.clipboard.writeText(address!); toast.success("Alamat disalin"); }}
                  >
                    {shortAddr(address)} <Copy className="h-3 w-3" />
                  </button>
                </Row>
                <Row label="Network">
                  <span className={wrongNetwork ? "text-destructive font-semibold" : "text-accent"}>
                    {chainName(chainId)} ({chainId})
                  </span>
                </Row>
              </div>
              {wrongNetwork && (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-destructive">
                    <AlertTriangle className="h-4 w-4" /> Wrong Network
                  </div>
                  <p className="text-muted-foreground">Silakan pindah ke Sepolia Testnet.</p>
                  <button
                    onClick={handleSwitch}
                    disabled={switching}
                    className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-glow px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60 inline-flex items-center justify-center gap-2"
                  >
                    {switching && <Loader2 className="h-4 w-4 animate-spin" />} Pindah ke Sepolia
                  </button>
                </div>
              )}
              <button
                onClick={handleDisconnect}
                className="w-full rounded-xl glass px-4 py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2 hover:border-destructive/40"
              >
                <LogOut className="h-4 w-4" /> Disconnect
              </button>
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              {wallets.map((w) => {
                const unavailable = w.connectorId === "walletConnect" && !WALLETCONNECT_PROJECT_ID;
                return (
                  <button
                    key={w.name}
                    onClick={() => handleConnect(w)}
                    disabled={!!connecting}
                    className="w-full flex items-center justify-between rounded-2xl glass p-4 text-left hover:border-primary/40 transition-colors disabled:opacity-60"
                  >
                    <div>
                      <div className="font-display font-bold">{w.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {unavailable ? "Perlu WalletConnect Project ID" : w.desc}
                      </div>
                    </div>
                    {connecting === w.name
                      ? <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      : <Wallet className="h-5 w-5 text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  </motion.header>
  );
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-muted-foreground">{label}</span>
    <span>{children}</span>
  </div>
);
