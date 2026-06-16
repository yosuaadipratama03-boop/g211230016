import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Link2, Users, Coins, Wallet, MapPin, GraduationCap,
  CheckCircle2, Activity, Clock, ArrowUpRight, ShieldCheck, BarChart3, TrendingUp,
  Store, ShieldAlert, FileCheck2, Cpu, Copy, Circle, CircleDot,
} from "lucide-react";
import {
  getSampleProject, progressOf, milestonesOf, riskOf, contractStatusOf, ownerInitials,
  type SampleStatus, type RiskLevel,
} from "@/lib/sampleProjects";
import { CertificationCard, CertStatusBadge } from "@/components/CertificationCard";
import { trustScoreOfProject } from "@/lib/trustScore";
import { TrustScoreCard, TrustInline } from "@/components/TrustScore";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const statusStyle: Record<SampleStatus, string> = {
  Active: "bg-primary/15 text-primary",
  Funded: "bg-accent/15 text-accent",
  Pending: "bg-secondary text-muted-foreground",
};

const riskStyle: Record<RiskLevel, string> = {
  Rendah: "bg-primary/15 text-primary",
  Sedang: "bg-accent/15 text-accent",
  Tinggi: "bg-destructive/15 text-destructive",
};

const StatusIcon = ({ status }: { status: SampleStatus }) => {
  if (status === "Funded") return <CheckCircle2 className="h-4 w-4" />;
  if (status === "Active") return <Activity className="h-4 w-4" />;
  return <Clock className="h-4 w-4" />;
};

const ProjectDetail = () => {
  const { id = "" } = useParams();
  const project = getSampleProject(id);
  const [funded, setFunded] = useState(false);

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
  const milestones = milestonesOf(project);
  const risk = riskOf(project);
  const contract = contractStatusOf(project);
  const trust = trustScoreOfProject(project);

  const stats = [
    { label: "Terkumpul", value: `${project.raisedEth} ETH`, icon: Wallet },
    { label: "Target", value: `${project.targetEth} ETH`, icon: Coins },
    { label: "Investor", value: project.investors.toLocaleString(), icon: Users },
    { label: "Progress", value: `${pct.toFixed(0)}%`, icon: BarChart3 },
  ];

  const handleFund = () => {
    if (project.status === "Funded") {
      toast.info("Proyek ini sudah terdanai penuh.");
      return;
    }
    setFunded(true);
    toast.success(`Berhasil mendanai ${project.businessName} (simulasi)`, {
      description: "Transaksi dikirim ke smart contract EduChain.",
    });
  };

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
          {/* Business profile */}
          <motion.div {...fadeUp} className="glass rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Logo placeholder */}
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center glow-mint">
                  <span className="font-display font-bold text-2xl text-primary-foreground">{ownerInitials(project.businessName)}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-secondary text-foreground/80">{project.category}</span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md ${statusStyle[project.status]}`}>
                      <StatusIcon status={project.status} /> {project.status}
                    </span>
                    <CertStatusBadge />
                    <TrustInline result={trust} />
                  </div>
                  <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">{project.businessName}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
                    <span className="inline-flex items-center gap-1.5"><Store className="h-4 w-4" /> {project.owner}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {project.location}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> Sejak {created}</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6 max-w-2xl">{project.description}</p>
            </div>
          </motion.div>

          {/* Stats */}
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

          {/* Milestones timeline */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass rounded-3xl p-7">
            {/* placeholder anchor */}
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Timeline Milestone Bisnis</h2>
            </div>
            <div className="relative pl-2">
              {milestones.map((m, i) => (
                <div key={m.title} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < milestones.length - 1 && (
                    <span className={`absolute left-[11px] top-7 bottom-0 w-0.5 ${m.status === "done" ? "bg-primary/60" : "bg-border"}`} />
                  )}
                  <div className="relative z-10 mt-0.5 shrink-0">
                    {m.status === "done" ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : m.status === "active" ? (
                      <CircleDot className="h-6 w-6 text-accent animate-pulse" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`font-semibold ${m.status === "upcoming" ? "text-muted-foreground" : ""}`}>{m.title}</span>
                      <span className="text-xs font-mono text-muted-foreground">{m.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risk assessment */}
          <motion.div {...fadeUp} transition={{ delay: 0.12 }} className="glass rounded-3xl p-7">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                <h2 className="font-display font-bold text-xl">Penilaian Risiko</h2>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg ${riskStyle[risk.overall]}`}>
                Risiko {risk.overall}
              </span>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>Skor Kepercayaan</span>
                <span>{risk.score}/100</span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${risk.score}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {risk.items.map((r) => (
                <div key={r.label} className="p-4 rounded-xl bg-background/40 border border-border">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-medium">{r.label}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${riskStyle[r.level]}`}>{r.level}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.note}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education certification */}
          <motion.div {...fadeUp} transition={{ delay: 0.14 }} className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2 mb-5">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Status Sertifikasi Edukasi</h2>
            </div>
            <div className="space-y-3">
              {project.modules.map((m) => (
                <div key={m} className="flex items-center justify-between gap-3 p-4 rounded-xl bg-background/40 border border-border">
                  <span className="inline-flex items-center gap-2.5 text-sm">
                    <FileCheck2 className="h-5 w-5 text-primary shrink-0" /> {m}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md bg-primary/15 text-primary shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Tersertifikasi
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Entrepreneur certification */}
          <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
            <CertificationCard defaultName={project.owner} />
          </motion.div>

          {/* Smart contract deployment */}
          <motion.div {...fadeUp} transition={{ delay: 0.16 }} className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2 mb-5">
              <Cpu className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Status Smart Contract</h2>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className="relative flex h-3 w-3">
                {contract.deployed && <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${contract.deployed ? "bg-primary" : "bg-muted-foreground"}`} />
              </span>
              <span className={`font-semibold ${contract.deployed ? "text-primary" : "text-muted-foreground"}`}>{contract.label}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border">
                <span className="text-muted-foreground">Jaringan</span>
                <span className="font-mono">{contract.network}</span>
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background/40 border border-border">
                <span className="text-muted-foreground shrink-0">Contract Address</span>
                <button
                  onClick={() => { navigator.clipboard?.writeText(contract.hash); toast.success("Alamat kontrak disalin"); }}
                  className="inline-flex items-center gap-1.5 font-mono text-primary hover:underline disabled:text-muted-foreground disabled:no-underline truncate"
                  disabled={!contract.deployed}
                >
                  <span className="truncate">{contract.hash}</span> {contract.deployed && <Copy className="h-3.5 w-3.5 shrink-0" />}
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background/40 border border-border">
                <span className="text-muted-foreground shrink-0">Pemilik / Wallet</span>
                <span className="font-mono truncate">{project.owner} · {project.wallet}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border">
                <span className="text-muted-foreground">Audit</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-primary"><ShieldCheck className="h-4 w-4" /> Verified</span>
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
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-6">
              <span>{pct.toFixed(0)}% terdanai</span>
              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {project.investors} investor</span>
            </div>

            <motion.button
              whileHover={{ scale: project.status === "Funded" ? 1 : 1.02 }}
              whileTap={{ scale: project.status === "Funded" ? 1 : 0.98 }}
              onClick={handleFund}
              disabled={project.status === "Funded"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 font-semibold text-primary-foreground glow-mint transition-transform disabled:opacity-50"
            >
              {project.status === "Funded"
                ? "Funding Selesai"
                : funded
                ? <>Pendanaan Terkirim <CheckCircle2 className="h-4 w-4" /></>
                : <>Fund Project <ArrowUpRight className="h-4 w-4" /></>}
            </motion.button>

            <Link to="/dashboard" className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-xl glass border-border px-5 py-3 text-sm font-medium hover:border-primary/40 transition-colors">
              <BarChart3 className="h-4 w-4" /> Lihat Dashboard
            </Link>

            <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground font-mono flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> Dana dilepas per milestone & terlacak on-chain.
            </div>
          </motion.div>

          {/* Quick trust summary */}
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="glass rounded-3xl p-7">
            <h3 className="font-display font-bold text-lg mb-4">Ringkasan Kepercayaan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Sertifikasi</span>
                <span className="font-mono">{project.modules.length} modul</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-primary" /> Risiko</span>
                <span className={`font-mono px-2 py-0.5 rounded-md ${riskStyle[risk.overall]}`}>{risk.overall}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" /> Kontrak</span>
                <span className={`font-mono ${contract.deployed ? "text-primary" : "text-muted-foreground"}`}>{contract.deployed ? "Aktif" : "Pending"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;