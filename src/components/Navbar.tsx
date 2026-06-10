import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Link2, Wallet, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";

const links = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
];

const wallets = [
  { name: "MetaMask", desc: "Wallet browser paling populer" },
  { name: "WalletConnect", desc: "Scan QR dari wallet mobile" },
  { name: "Coinbase Wallet", desc: "Terhubung ke Coinbase" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const handleConnect = (name: string) => {
    setConnecting(name);
    setTimeout(() => {
      setConnecting(null);
      setConnected(true);
      setOpen(false);
      toast.success(`${name} terhubung`, {
        description: "Wallet 0xa3f...82bc siap digunakan (simulasi).",
      });
    }, 1200);
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
      </ul>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform">
            {connected ? <><Check className="h-4 w-4" /> 0xa3f...82bc</> : <><Wallet className="h-4 w-4" /> Connect Wallet</>}
          </button>
        </DialogTrigger>
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Hubungkan Wallet</DialogTitle>
            <DialogDescription>Pilih wallet untuk terhubung ke EduChain UMKM (simulasi).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {wallets.map((w) => (
              <button
                key={w.name}
                onClick={() => handleConnect(w.name)}
                disabled={!!connecting}
                className="w-full flex items-center justify-between rounded-2xl glass p-4 text-left hover:border-primary/40 transition-colors disabled:opacity-60"
              >
                <div>
                  <div className="font-display font-bold">{w.name}</div>
                  <div className="text-xs text-muted-foreground">{w.desc}</div>
                </div>
                {connecting === w.name
                  ? <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  : <Wallet className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  </motion.header>
  );
};
