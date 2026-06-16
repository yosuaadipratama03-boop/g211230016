import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Link2, Search, Users, TrendingUp, Compass, ArrowUpRight,
  CheckCircle2, Activity, Clock, SlidersHorizontal,
} from "lucide-react";
import {
  SAMPLE_PROJECTS, SAMPLE_CATEGORIES, progressOf, type SampleProject, type SampleStatus,
} from "@/lib/sampleProjects";
import { trustScoreOfProject } from "@/lib/trustScore";
import { TrustInline } from "@/components/TrustScore";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

type SortKey = "newest" | "most-funded" | "closest";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Terbaru" },
  { key: "most-funded", label: "Paling Banyak Didanai" },
  { key: "closest", label: "Mendekati Target" },
];

const statusStyle: Record<SampleStatus, string> = {
  Active: "bg-primary/15 text-primary",
  Funded: "bg-accent/15 text-accent",
  Pending: "bg-secondary text-muted-foreground",
};

const StatusIcon = ({ status }: { status: SampleStatus }) => {
  if (status === "Funded") return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === "Active") return <Activity className="h-3.5 w-3.5" />;
  return <Clock className="h-3.5 w-3.5" />;
};

const ProjectCard = ({ p, index }: { p: SampleProject; index: number }) => {
  const navigate = useNavigate();
  const pct = progressOf(p);
  const trust = trustScoreOfProject(p);
  return (
    <motion.button
      {...fadeUp}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => navigate(`/projects/${p.id}`)}
      className="group text-left glass rounded-3xl p-6 flex flex-col hover:border-primary/40 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-secondary text-foreground/80">{p.category}</span>
        <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md ${statusStyle[p.status]}`}>
          <StatusIcon status={p.status} /> {p.status}
        </span>
      </div>

      <h3 className="font-display font-bold text-2xl mb-2 group-hover:text-gradient-mint transition-colors">{p.businessName}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">{p.description}</p>
      <div className="mb-5"><TrustInline result={trust} /></div>

      <div className="mt-auto space-y-4">
        <div>
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="font-mono text-xs text-muted-foreground">Terkumpul</div>
              <div className="font-display font-bold text-xl text-gradient-mint">{p.raisedEth} ETH</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-muted-foreground">Target</div>
              <div className="font-display font-semibold text-base">{p.targetEth} ETH</div>
            </div>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all"
              style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs font-mono text-muted-foreground">
            <span>{pct.toFixed(0)}% terdanai</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {p.investors} investor</span>
          </div>
        </div>

        <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-4 py-2.5 text-sm font-semibold text-primary-foreground group-hover:scale-[1.02] transition-transform">
          Lihat Detail <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </motion.button>
  );
};

const Explore = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState<SortKey>("newest");

  const projects = useMemo(() => {
    let list = SAMPLE_PROJECTS.filter((p) => {
      const matchQuery = p.businessName.toLowerCase().includes(query.trim().toLowerCase());
      const matchCat = category === "Semua" || p.category === category;
      return matchQuery && matchCat;
    });
    list = [...list].sort((a, b) => {
      if (sort === "newest") return b.createdAt - a.createdAt;
      if (sort === "most-funded") return b.raisedEth - a.raisedEth;
      return progressOf(b) - progressOf(a);
    });
    return list;
  }, [query, category, sort]);

  return (
    <div className="min-h-screen relative">
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
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-8">
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-wider mb-3">
            <Compass className="h-4 w-4" /> Marketplace
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl">
            Jelajahi <span className="text-gradient-mint">Proyek UMKM</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Temukan proposal pendanaan UMKM yang transparan dan teredukasi. Danai langsung tanpa perantara.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="glass rounded-2xl p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 flex-1">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-sm flex-1"
              placeholder="Cari nama proyek..."
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-input border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors cursor-pointer"
            >
              {SAMPLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === "Semua" ? "Semua Kategori" : c}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-input border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors cursor-pointer text-foreground"
              >
                {sortOptions.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="text-sm text-muted-foreground font-mono">
          {projects.length} proyek ditemukan
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} p={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 text-center border-dashed border-2">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="font-display font-bold text-xl mb-1">Tidak ada proyek</h2>
            <p className="text-sm text-muted-foreground">Coba ubah kata kunci atau filter kategori.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-6 text-center text-xs text-muted-foreground font-mono">
          <TrendingUp className="inline h-3.5 w-3.5 mr-1" /> Live on EduChain Mainnet · Marketplace v1
        </div>
      </footer>
    </div>
  );
};

export default Explore;