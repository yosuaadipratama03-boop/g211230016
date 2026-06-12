import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Check,
  Shield,
  FileCheck,
  Zap,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Filter,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { SAMPLE_TRANSACTIONS, type Transaction, type TxStatus, type TxType } from "@/lib/sampleTransactions";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 7;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const statusConfig: Record<
  TxStatus,
  { color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  Success: {
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    icon: CheckCircle2,
  },
  Pending: {
    color: "text-accent",
    bg: "bg-accent/10 border-accent/30",
    icon: Clock,
  },
  Failed: {
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
    icon: XCircle,
  },
};

const typeConfig: Record<
  TxType,
  { color: string; icon: typeof ArrowUpRight }
> = {
  Invest: { color: "text-primary", icon: ArrowUpRight },
  Withdraw: { color: "text-accent", icon: ArrowDownRight },
  "Milestone Release": { color: "text-primary", icon: Activity },
  Refund: { color: "text-destructive", icon: ArrowDownRight },
  Reward: { color: "text-accent", icon: ArrowUpRight },
};

const formatTimeAgo = (ts: number) => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
};

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const shortenHash = (hash: string) =>
  `${hash.slice(0, 8)}...${hash.slice(-6)}`;

const allTypes: ("Semua" | TxType)[] = [
  "Semua",
  "Invest",
  "Withdraw",
  "Milestone Release",
  "Refund",
  "Reward",
];
const allStatuses: ("Semua" | TxStatus)[] = ["Semua", "Success", "Pending", "Failed"];

const Transactions = () => {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"Semua" | TxType>("Semua");
  const [statusFilter, setStatusFilter] = useState<"Semua" | TxStatus>("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = SAMPLE_TRANSACTIONS.filter((t) => {
      const q = query.toLowerCase();
      const matchQuery =
        t.hash.toLowerCase().includes(q) ||
        t.wallet.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q);
      const matchType = typeFilter === "Semua" || t.type === typeFilter;
      const matchStatus = statusFilter === "Semua" || t.status === statusFilter;
      return matchQuery && matchType && matchStatus;
    });
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [query, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast.success("Hash disalin ke clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const successCount = filtered.filter((t) => t.status === "Success").length;
  const totalVolume = filtered.reduce((sum, t) => sum + t.amount, 0);
  const uniqueWallets = new Set(filtered.map((t) => t.wallet)).size;

  const contractCard = (
    <motion.div
      {...fadeUp}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6 border-primary/30"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">Smart Contract</h3>
          <p className="text-xs text-muted-foreground font-mono">Lovable Testnet</p>
        </div>
      </div>
      <div className="space-y-4">
        {[
          {
            label: "Contract Deployed",
            status: "Deployed",
            icon: FileCheck,
            active: true,
          },
          {
            label: "Contract Verified",
            status: "Verified",
            icon: CheckCircle2,
            active: true,
          },
          {
            label: "Contract Active",
            status: "Active",
            icon: Zap,
            active: true,
          },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-8 w-8 rounded-lg grid place-items-center",
                  item.active ? "bg-primary/10" : "bg-muted"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    item.active ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span
              className={cn(
                "text-xs font-mono px-2.5 py-1 rounded-md border",
                item.active
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 pt-5 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Contract Address</span>
          <span className="font-mono text-xs">0x7a8b...c3d4</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Network</span>
          <span className="font-mono text-xs text-primary">Lovable Testnet</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Block Height</span>
          <span className="font-mono text-xs">#18,492,331</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
                <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div className="font-display font-bold leading-none">
                EduChain<span className="text-gradient-mint"> UMKM</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-mono hidden sm:block">
            Block #18,492,331
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-8">
        {/* Title */}
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs text-primary uppercase tracking-wider mb-2">
              On-Chain Explorer
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl">
              Transaction <span className="text-gradient-mint">History</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Pantau semua transaksi on-chain UMKM dan investor secara transparan.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Transaksi",
              value: filtered.length.toLocaleString(),
              icon: Activity,
              accent: "primary" as const,
            },
            {
              label: "Volume (ETH)",
              value: `${totalVolume.toFixed(2)} ETH`,
              icon: ArrowUpRight,
              accent: "primary" as const,
            },
            {
              label: "Sukses",
              value: successCount.toLocaleString(),
              icon: CheckCircle2,
              accent: "accent" as const,
            },
            {
              label: "Unique Wallets",
              value: uniqueWallets.toLocaleString(),
              icon: Shield,
              accent: "accent" as const,
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl grid place-items-center",
                    s.accent === "primary" ? "bg-primary/10" : "bg-accent/10"
                  )}
                >
                  <s.icon
                    className={cn(
                      "h-5 w-5",
                      s.accent === "primary" ? "text-primary" : "text-accent"
                    )}
                    strokeWidth={1.8}
                  />
                </div>
              </div>
              <div className="font-display font-bold text-3xl">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Table Section */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 glass rounded-3xl p-6 md:p-8"
          >
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1 max-w-md">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  className="bg-transparent outline-none text-sm flex-1 w-full"
                  placeholder="Cari hash, wallet, atau nama proyek..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <select
                    className="appearance-none glass rounded-xl px-4 py-2 pr-8 text-sm bg-transparent outline-none cursor-pointer"
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value as TxType | "Semua");
                      setCurrentPage(1);
                    }}
                  >
                    {allTypes.map((t) => (
                      <option key={t} value={t}>
                        {t === "Semua" ? "Semua Tipe" : t}
                      </option>
                    ))}
                  </select>
                  <Filter className="h-3 w-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    className="appearance-none glass rounded-xl px-4 py-2 pr-8 text-sm bg-transparent outline-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as TxStatus | "Semua");
                      setCurrentPage(1);
                    }}
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s === "Semua" ? "Semua Status" : s}
                      </option>
                    ))}
                  </select>
                  <Filter className="h-3 w-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto -mx-2 px-2">
              <table className="w-full caption-bottom text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Transaction Hash
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Wallet
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Timestamp
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((tx) => {
                    const sc = statusConfig[tx.status];
                    const tc = typeConfig[tx.type];
                    const StatusIcon = sc.icon;
                    const TypeIcon = tc.icon;
                    return (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border/50 transition-colors hover:bg-muted/30"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">
                              {shortenHash(tx.hash)}
                            </span>
                            <button
                              onClick={() => handleCopy(tx.hash, tx.id)}
                              className="h-6 w-6 rounded-md grid place-items-center hover:bg-muted transition-colors"
                              title="Copy hash"
                            >
                              {copiedId === tx.id ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <Copy className="h-3 w-3 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <span className="font-mono text-xs">{tx.wallet}</span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <TypeIcon
                              className={cn("h-3.5 w-3.5", tc.color)}
                            />
                            <span className="text-xs">{tx.type}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <span className="font-mono text-xs font-medium">
                            {tx.amount.toFixed(2)} ETH
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="text-xs">
                              {formatTimeAgo(tx.timestamp)}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {formatDate(tx.timestamp)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md border",
                              sc.bg,
                              sc.color
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {tx.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pageItems.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Tidak ada transaksi yang cocok dengan filter.
                </p>
              </div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground font-mono">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} dari{" "}
                  {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 rounded-lg glass grid place-items-center hover:border-primary/40 transition-colors disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={cn(
                          "h-9 w-9 rounded-lg grid place-items-center text-sm font-mono transition-colors",
                          p === currentPage
                            ? "bg-primary text-primary-foreground"
                            : "glass hover:border-primary/40"
                        )}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 rounded-lg glass grid place-items-center hover:border-primary/40 transition-colors disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {contractCard}

            {/* Legend */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-display font-bold text-sm mb-4">Status Legend</h3>
              <div className="space-y-3">
                {Object.entries(statusConfig).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-md border",
                          cfg.bg,
                          cfg.color
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {key}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {key === "Success"
                          ? "Transaksi berhasil dikonfirmasi"
                          : key === "Pending"
                          ? "Menunggu konfirmasi jaringan"
                          : "Transaksi gagal/gagal verifikasi"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Network Info */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.25 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-display font-bold text-sm mb-4">Network Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-mono text-xs text-primary">Lovable Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas (Gwei)</span>
                  <span className="font-mono text-xs">12.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block Time</span>
                  <span className="font-mono text-xs">~3.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TPS</span>
                  <span className="font-mono text-xs">~1,240</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-6 text-center text-xs text-muted-foreground font-mono">
          Live on EduChain Mainnet · Block #18,492,331
        </div>
      </footer>
    </div>
  );
};

export default Transactions;
