import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, FileText, GraduationCap, Coins, Sparkles, Loader2 } from "lucide-react";
import { AVAILABLE_MODULES, CATEGORIES, setProposal } from "@/lib/proposalStore";

const steps = [
  { n: 1, label: "Proposal", icon: FileText },
  { n: 2, label: "Edukasi", icon: GraduationCap },
  { n: 3, label: "Pendanaan", icon: Coins },
];

export const ProposalSimulator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState<string[]>(["finance", "marketing"]);
  const [target, setTarget] = useState(50);

  const requiredOk = AVAILABLE_MODULES.filter(m => m.required).every(m => modules.includes(m.id));
  const canNext1 = businessName.trim().length >= 2 && description.trim().length >= 10;
  const canNext2 = requiredOk;

  const toggleModule = (id: string) => {
    const m = AVAILABLE_MODULES.find(x => x.id === id);
    if (m?.required) return; // cannot uncheck required
    setModules(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulated on-chain confirmation
    await new Promise(r => setTimeout(r, 1600));
    const raised = +(target * 0.18).toFixed(2);
    setProposal({
      businessName: businessName.trim(),
      category,
      description: description.trim(),
      targetEth: target,
      modules,
      status: "live",
      submittedAt: Date.now(),
      raisedEth: raised,
      investors: Math.floor(target * 0.6) + 8,
    });
    setSubmitting(false);
    navigate("/dashboard");
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => {
          const active = step === s.n;
          const done = step > s.n;
          return (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-3 ${active || done ? "" : "opacity-50"}`}>
                <div className={`h-10 w-10 rounded-xl grid place-items-center transition-colors ${
                  done ? "bg-primary text-primary-foreground" :
                  active ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground glow-mint" :
                  "glass"
                }`}>
                  {done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <div className="hidden sm:block">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase">Step {s.n}</div>
                  <div className="font-display font-semibold text-sm">{s.label}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-border mx-3 md:mx-5 relative">
                  <div className="absolute inset-y-0 left-0 bg-primary transition-all" style={{ width: done ? "100%" : "0%" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Nama UMKM</label>
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Mis. Kopi Nusantara"
                className="w-full rounded-xl bg-background/50 border border-border px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Kategori</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      category === c ? "bg-primary text-primary-foreground" : "glass hover:border-primary/40"
                    }`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Deskripsi Proyek</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Jelaskan bisnis dan rencana penggunaan dana..."
                className="w-full rounded-xl bg-background/50 border border-border px-4 py-3 outline-none focus:border-primary transition-colors resize-none" />
              <div className="text-xs text-muted-foreground font-mono mt-1">{description.length} karakter (min 10)</div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Modul wajib otomatis dipilih. Tambahkan opsional untuk tingkatkan reputation score.
            </p>
            {AVAILABLE_MODULES.map(m => {
              const checked = modules.includes(m.id);
              return (
                <button key={m.id} type="button" onClick={() => toggleModule(m.id)}
                  disabled={m.required}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                    checked ? "border-primary bg-primary/5" : "border-border bg-background/40 hover:border-primary/40"
                  } ${m.required ? "cursor-default" : "cursor-pointer"}`}>
                  <div className={`h-6 w-6 rounded-md border-2 grid place-items-center shrink-0 ${
                    checked ? "bg-primary border-primary" : "border-border"
                  }`}>
                    {checked && <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold flex items-center gap-2 flex-wrap">
                      {m.title}
                      {m.required && <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">Wajib</span>}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{m.duration}</div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Target Pendanaan</label>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display font-bold text-5xl text-gradient-mint">{target}</span>
                <span className="font-mono text-muted-foreground">ETH</span>
                <span className="ml-auto text-sm text-muted-foreground">≈ ${(target * 3200).toLocaleString()}</span>
              </div>
              <input type="range" min={5} max={200} step={5} value={target}
                onChange={(e) => setTarget(+e.target.value)}
                className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground font-mono mt-2">
                <span>5 ETH</span><span>200 ETH</span>
              </div>
            </div>

            <div className="rounded-2xl bg-background/40 border border-border p-5 space-y-3">
              <div className="font-display font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Ringkasan Smart Contract
              </div>
              <div className="space-y-2 text-sm font-mono">
                <Row k="UMKM" v={businessName || "—"} />
                <Row k="Kategori" v={category} />
                <Row k="Target" v={`${target} ETH`} />
                <Row k="Modul edukasi" v={`${modules.length} modul`} />
                <Row k="Milestone" v="4 tahap rilis otomatis" />
                <Row k="Network" v="EduChain Mainnet" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <button type="button" onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1 || submitting}
          className="inline-flex items-center gap-2 rounded-xl glass px-5 py-2.5 text-sm font-medium hover:border-primary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        {step < 3 ? (
          <button type="button" onClick={() => setStep(s => s + 1)}
            disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-2.5 text-sm font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
            Lanjut <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-2.5 text-sm font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform disabled:opacity-70">
            {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Deploying contract...</>) : (<>Deploy & Lihat Dashboard <ArrowRight className="h-4 w-4" /></>)}
          </button>
        )}
      </div>
    </div>
  );
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{k}</span>
    <span className="text-foreground truncate">{v}</span>
  </div>
);
