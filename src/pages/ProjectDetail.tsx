import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Link2, Users, Coins, Wallet, MapPin, GraduationCap,
  CheckCircle2, Activity, Clock, ArrowUpRight, ShieldCheck, BarChart3, TrendingUp,
} from "lucide-react";
import { getSampleProject, progressOf, type SampleStatus } from "@/lib/sampleProjects";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const statusStyle: Record<SampleStatus, string> = {
  Active: "bg-primary/15 text-primary",
  Funded: "bg-accent/15 text-accent",
  Pending: "bg-secondary text-muted-foreground",
};

const StatusIcon = ({ status }: { status: SampleStatus }) => {
  if (status === "Funded") return <CheckCircle2 className="h-4 w-4" />;
  if (status === "Active") return <Activity className="h-4 w-4" />;
  return <Clock className="h-4 w-4" />;
};

const ProjectDetail = () => {
  const { id = "" } = useParams();
  const project = getSampleProject(id);

  if (!project) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="glass rounded-3xl p-12 text-center max-w-md">
          <h1 className="font-display font-bold text-2xl mb-2">Proyek tidak ditemukan</h1>
          <p className="text-sm text-muted-foreground mb-6">Proyek yang Anda cari mungkin sudah tidak tersedia.</p>
          <Link to="/explore" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform">
            <ArrowLeft className="h-4 w-4" /> Kembali ke marketplace
          </Link>
        </div>
      </div>
    );
  }

  const pct = progressOf(project);
  const created = new Date(project.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const stats = [
    { label: "Terkumpul", value: `${project.raisedEth} ETH`, icon: Wallet },
    { label: "Target", value: `${project.targetEth} ETH`, icon: Coins },
    { label: "Investor", value: project.investors.toLocaleString(), icon: Users },
    { label: "Progress", value: `${pct.toFixed(0)}%`, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen relative">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/explore" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Marketplace</span>
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
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div {...fadeUp} className="glass rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-secondary text-foreground/80">{project.category}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md ${statusStyle[project.status]}`}>
                  <StatusIcon status={project.status} /> {project.status}
                </span>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">{project.businessName}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {project.location}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> Sejak {created}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-5 max-w-2xl">{project.description}</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center mb-3">
                  <s.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                </div>
                <div className="font-display font-bold text-2xl">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2 mb-5">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Modul Edukasi Diselesaikan</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.modules.map((m) => (
                <span key={m} className="inline-flex items-center gap-1.5 text-sm font-mono px-3 py-1.5 rounded-lg bg-secondary text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {m}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Transparansi On-Chain</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border">
                <span className="text-muted-foreground">Pemilik</span>
                <span className="font-mono">{project.owner}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border">
                <span className="text-muted-foreground">Wallet</span>
                <span className="font-mono">{project.wallet}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border">
                <span className="text-muted-foreground">Smart Contract</span>
                <span className="font-mono text-primary">Verified</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar funding */}
        <div className="space-y-6">
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass rounded-3xl p-7 lg:sticky lg:top-24">
            <div className="font-mono text-xs text-muted-foreground mb-1">Terkumpul / Target</div>
            <div className="font-display font-bold text-3xl text-gradient-mint mb-4">
              {project.raisedEth} / {project.targetEth} <span className="text-base text-muted-foreground">ETH</span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-6">
              <span>{pct.toFixed(0)}% terdanai</span>
              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {project.investors} investor</span>
            </div>

            <button
              onClick={() =>
                project.status === "Funded"
                  ? toast.info("Proyek ini sudah terdanai penuh.")
                  : toast.success(`Berhasil mendanai ${project.businessName} (simulasi)`, {
                      description: "Transaksi dikirim ke smart contract EduChain.",
                    })
              }
              disabled={project.status === "Funded"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 font-semibold text-primary-foreground glow-mint hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {project.status === "Funded" ? "Funding Selesai" : <>Danai Proyek Ini <ArrowUpRight className="h-4 w-4" /></>}
            </button>

            <Link to="/dashboard" className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-xl glass border-border px-5 py-3 text-sm font-medium hover:border-primary/40 transition-colors">
              <BarChart3 className="h-4 w-4" /> Lihat Dashboard
            </Link>

            <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground font-mono flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> Dana dilepas per milestone & terlacak on-chain.
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;