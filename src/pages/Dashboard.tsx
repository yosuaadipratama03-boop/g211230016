import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowUpRight, Wallet, TrendingUp, Users, GraduationCap,
  Coins, CheckCircle2, Clock, PlayCircle, Award, BarChart3, Activity,
  Link2, Bell, Search, Settings
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stats = [
  { label: "Total Funding", value: "247.8 ETH", change: "+12.4%", icon: Wallet, accent: "primary" },
  { label: "Active Investors", value: "1,284", change: "+89", icon: Users, accent: "primary" },
  { label: "EDU Tokens", value: "8,420", change: "+340", icon: Coins, accent: "accent" },
  { label: "Reputation Score", value: "94/100", change: "+2", icon: Award, accent: "accent" },
];

const milestones = [
  { name: "Riset pasar & validasi", status: "done", amount: "12.5 ETH", date: "12 Mar 2026" },
  { name: "Pengadaan bahan baku", status: "done", amount: "18.0 ETH", date: "28 Mar 2026" },
  { name: "Produksi batch pertama", status: "active", amount: "15.0 ETH", date: "In progress" },
  { name: "Distribusi & marketing", status: "pending", amount: "9.5 ETH", date: "—" },
];

const courses = [
  { title: "Manajemen Keuangan UMKM", progress: 100, status: "Sertifikasi NFT" },
  { title: "Pemasaran Digital Lanjutan", progress: 72, status: "Sedang berjalan" },
  { title: "Strategi Ekspansi Pasar", progress: 30, status: "Modul 3/10" },
  { title: "Smart Contract untuk Bisnis", progress: 0, status: "Belum dimulai" },
];

const txs = [
  { hash: "0xa3f...82bc", type: "Fund Released", amount: "+12.5 ETH", time: "2 menit lalu", positive: true },
  { hash: "0x8d2...41ac", type: "Investor Deposit", amount: "+0.8 ETH", time: "14 menit lalu", positive: true },
  { hash: "0xf91...09de", type: "Course Reward", amount: "+50 EDU", time: "1 jam lalu", positive: true },
  { hash: "0x4b7...77fa", type: "Milestone Locked", amount: "−9.5 ETH", time: "3 jam lalu", positive: false },
  { hash: "0xc12...3b8e", type: "Investor Deposit", amount: "+2.4 ETH", time: "5 jam lalu", positive: true },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
                <Link2 className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div className="font-display font-bold leading-none">
                EduChain<span className="text-gradient-mint"> UMKM</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input className="bg-transparent outline-none text-sm flex-1" placeholder="Cari proposal, kursus..." />
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 rounded-lg glass grid place-items-center hover:border-primary/40 transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <button className="h-9 w-9 rounded-lg glass grid place-items-center hover:border-primary/40 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 glass rounded-xl px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs">0xKopi...usantara</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-8">
        {/* Welcome */}
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs text-primary uppercase tracking-wider mb-2">UMKM Dashboard</div>
            <h1 className="font-display font-bold text-4xl md:text-5xl">
              Halo, <span className="text-gradient-mint">Kopi Nusantara</span>
            </h1>
            <p className="text-muted-foreground mt-2">Pantau funding, edukasi, dan transaksi on-chain Anda.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform text-sm">
            Buat Proposal Baru <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl grid place-items-center ${s.accent === "primary" ? "bg-primary/10" : "bg-accent/10"}`}>
                  <s.icon className={`h-5 w-5 ${s.accent === "primary" ? "text-primary" : "text-accent"}`} strokeWidth={1.8} />
                </div>
                <span className={`text-xs font-mono ${s.accent === "primary" ? "text-primary" : "text-accent"}`}>{s.change}</span>
              </div>
              <div className="font-display font-bold text-3xl">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Funding Progress */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="lg:col-span-2 glass rounded-3xl p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl">Funding Aktif</h2>
                <p className="text-sm text-muted-foreground mt-1">Proyek: Ekspansi Roastery Bali</p>
              </div>
              <div className="text-right">
                <div className="font-display font-bold text-2xl text-gradient-mint">55 / 55 ETH</div>
                <div className="text-xs text-muted-foreground font-mono">100% terkumpul · 127 investor</div>
              </div>
            </div>

            <div className="h-2 rounded-full bg-secondary overflow-hidden mb-8">
              <div className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full" style={{ width: "100%" }} />
            </div>

            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={m.name} className="flex items-center gap-4 p-4 rounded-xl bg-background/40 border border-border">
                  <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${
                    m.status === "done" ? "bg-primary/15 text-primary" :
                    m.status === "active" ? "bg-accent/15 text-accent" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {m.status === "done" ? <CheckCircle2 className="h-5 w-5" /> :
                     m.status === "active" ? <Activity className="h-5 w-5 animate-pulse" /> :
                     <Clock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">Milestone {i + 1}: {m.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{m.date}</div>
                  </div>
                  <div className="font-mono text-sm text-right">{m.amount}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Reputation */}
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="glass rounded-3xl p-7">
            <h2 className="font-display font-bold text-2xl mb-6">Reputasi On-Chain</h2>
            <div className="relative aspect-square max-w-[200px] mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="hsl(var(--secondary))" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="hsl(var(--primary))" strokeWidth="8" fill="none"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - 0.94)}`}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary)))" }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="font-display font-bold text-4xl text-gradient-mint">94</div>
                  <div className="text-xs text-muted-foreground font-mono">/ 100</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { l: "Transparansi", v: 98 },
                { l: "Penyelesaian milestone", v: 92 },
                { l: "Edukasi diselesaikan", v: 88 },
              ].map((r) => (
                <div key={r.l}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{r.l}</span>
                    <span className="font-mono">{r.v}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full" style={{ width: `${r.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Courses */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2 glass rounded-3xl p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl">Modul Edukasi</h2>
                <p className="text-sm text-muted-foreground mt-1">Selesaikan untuk membuka funding berikutnya</p>
              </div>
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div key={c.title} className="rounded-2xl bg-background/40 border border-border p-5 hover:border-primary/40 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <PlayCircle className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    <span className={`text-xs font-mono px-2 py-1 rounded-md ${
                      c.progress === 100 ? "bg-primary/15 text-primary" :
                      c.progress > 0 ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"
                    }`}>{c.status}</span>
                  </div>
                  <h3 className="font-display font-semibold mb-3 leading-snug">{c.title}</h3>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-2">{c.progress}% complete</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Transactions */}
          <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="glass rounded-3xl p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl">On-Chain Activity</h2>
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <div className="space-y-3">
              {txs.map((t) => (
                <div key={t.hash} className="flex items-center gap-3 p-3 rounded-xl hover:bg-background/40 transition-colors">
                  <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${t.positive ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                    <TrendingUp className={`h-4 w-4 ${!t.positive && "rotate-180"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{t.type}</div>
                    <div className="text-xs text-muted-foreground font-mono">{t.hash} · {t.time}</div>
                  </div>
                  <div className={`font-mono text-sm shrink-0 ${t.positive ? "text-primary" : "text-accent"}`}>{t.amount}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-5 rounded-xl glass border-border py-3 text-sm font-medium hover:border-primary/40 transition-colors">
              Lihat semua di explorer
            </button>
          </motion.div>
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

export default Dashboard;
