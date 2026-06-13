import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Check, FileText, GraduationCap, Coins, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { AVAILABLE_MODULES, CATEGORIES, setProposal } from "@/lib/proposalStore";
import { EducationQuiz } from "@/components/EducationQuiz";
import { QUIZZES, getQuizById, requiredQuizzesPassed, useQuizResults, PASSING_SCORE, type QuizDef } from "@/lib/quizStore";
import { Trophy, Lock, RotateCcw } from "lucide-react";

const steps = [
  { n: 1, label: "Proposal", icon: FileText },
  { n: 2, label: "Edukasi", icon: GraduationCap },
  { n: 3, label: "Pendanaan", icon: Coins },
];

const REQUIRED_MODULE_IDS = AVAILABLE_MODULES.filter(m => m.required).map(m => m.id);

const businessNameSchema = z
  .string()
  .trim()
  .min(3, { message: "Nama UMKM minimal 3 karakter." })
  .max(60, { message: "Nama UMKM maksimal 60 karakter." })
  .regex(/^[a-zA-Z0-9\s.,'&-]+$/, { message: "Nama hanya boleh huruf, angka, spasi, dan . , ' & -" });

const descriptionSchema = z
  .string()
  .trim()
  .min(30, { message: "Deskripsi minimal 30 karakter — jelaskan rencana bisnis Anda." })
  .max(500, { message: "Deskripsi maksimal 500 karakter." });

const categorySchema = z.enum(CATEGORIES as [string, ...string[]], {
  errorMap: () => ({ message: "Pilih kategori yang valid." }),
});

const modulesSchema = z
  .array(z.string())
  .refine(arr => REQUIRED_MODULE_IDS.every(id => arr.includes(id)), {
    message: "Semua modul wajib harus dipilih.",
  })
  .refine(arr => arr.length <= AVAILABLE_MODULES.length, { message: "Modul tidak valid." });

const targetSchema = z
  .number({ invalid_type_error: "Target harus berupa angka." })
  .finite("Target tidak valid.")
  .min(5, { message: "Target minimum 5 ETH." })
  .max(200, { message: "Target maksimum 200 ETH." })
  .refine(n => n % 1 === 0 || (n * 10) % 1 === 0, { message: "Maksimal 1 angka desimal." });

type Errors = Partial<Record<"businessName" | "category" | "description" | "modules" | "target", string>>;

export const ProposalSimulator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState<string[]>([...REQUIRED_MODULE_IDS]);
  const [target, setTarget] = useState(50);

  const setError = (key: keyof Errors, value?: string) =>
    setErrors(prev => ({ ...prev, [key]: value }));

  const validateField = (key: keyof Errors, value: unknown): string | undefined => {
    let result;
    switch (key) {
      case "businessName": result = businessNameSchema.safeParse(value); break;
      case "category": result = categorySchema.safeParse(value); break;
      case "description": result = descriptionSchema.safeParse(value); break;
      case "modules": result = modulesSchema.safeParse(value); break;
      case "target": result = targetSchema.safeParse(value); break;
    }
    return result?.success ? undefined : result?.error.issues[0]?.message;
  };

  const validateStep = (s: number): boolean => {
    const next: Errors = { ...errors };
    let ok = true;
    if (s === 1) {
      next.businessName = validateField("businessName", businessName);
      next.category = validateField("category", category);
      next.description = validateField("description", description);
      if (next.businessName || next.category || next.description) ok = false;
      setTouched(t => ({ ...t, businessName: true, category: true, description: true }));
    } else if (s === 2) {
      next.modules = validateField("modules", modules);
      if (next.modules) ok = false;
      setTouched(t => ({ ...t, modules: true }));
    } else if (s === 3) {
      next.target = validateField("target", target);
      if (next.target) ok = false;
      setTouched(t => ({ ...t, target: true }));
    }
    setErrors(next);
    return ok;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      toast.error("Periksa kembali isian Anda.");
      return;
    }
    setStep(s => s + 1);
  };

  const toggleModule = (id: string) => {
    const m = AVAILABLE_MODULES.find(x => x.id === id);
    if (m?.required) {
      toast.info(`"${m.title}" adalah modul wajib dan tidak dapat dilepas.`);
      return;
    }
    setModules(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (touched.modules) setError("modules", validateField("modules", next));
      return next;
    });
  };

  const handleSubmit = async () => {
    // Final full validation
    const full: Errors = {
      businessName: validateField("businessName", businessName),
      category: validateField("category", category),
      description: validateField("description", description),
      modules: validateField("modules", modules),
      target: validateField("target", target),
    };
    setErrors(full);
    setTouched({ businessName: true, category: true, description: true, modules: true, target: true });
    const firstErr = Object.entries(full).find(([, v]) => v);
    if (firstErr) {
      toast.error("Tidak bisa submit", { description: firstErr[1] });
      // Jump back to the offending step
      if (["businessName", "category", "description"].includes(firstErr[0])) setStep(1);
      else if (firstErr[0] === "modules") setStep(2);
      else setStep(3);
      return;
    }

    setSubmitting(true);
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
    toast.success("Smart contract berhasil di-deploy!", { description: `${businessName.trim()} kini live di EduChain.` });
    navigate("/dashboard");
  };

  const inputClass = (hasErr?: boolean) =>
    `w-full rounded-xl bg-background/50 border px-4 py-3 outline-none transition-colors ${
      hasErr ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
    }`;

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
            <Field label="Nama UMKM" error={touched.businessName ? errors.businessName : undefined}
              hint={`${businessName.length}/60`}>
              <input
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  if (touched.businessName) setError("businessName", validateField("businessName", e.target.value));
                }}
                onBlur={() => { setTouched(t => ({ ...t, businessName: true })); setError("businessName", validateField("businessName", businessName)); }}
                maxLength={60}
                placeholder="Mis. Kopi Nusantara"
                aria-invalid={!!errors.businessName}
                className={inputClass(touched.businessName && !!errors.businessName)} />
            </Field>

            <Field label="Kategori" error={touched.category ? errors.category : undefined}>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} type="button"
                    onClick={() => { setCategory(c); setError("category", validateField("category", c)); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      category === c ? "bg-primary text-primary-foreground" : "glass hover:border-primary/40"
                    }`}>{c}</button>
                ))}
              </div>
            </Field>

            <Field label="Deskripsi Proyek" error={touched.description ? errors.description : undefined}
              hint={`${description.length}/500 (min 30)`}>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (touched.description) setError("description", validateField("description", e.target.value));
                }}
                onBlur={() => { setTouched(t => ({ ...t, description: true })); setError("description", validateField("description", description)); }}
                rows={4}
                maxLength={500}
                placeholder="Jelaskan bisnis dan rencana penggunaan dana..."
                aria-invalid={!!errors.description}
                className={`${inputClass(touched.description && !!errors.description)} resize-none`} />
            </Field>
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
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                    checked ? "border-primary bg-primary/5" : "border-border bg-background/40 hover:border-primary/40"
                  } ${m.required ? "cursor-not-allowed" : "cursor-pointer"}`}>
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
            {touched.modules && errors.modules && <ErrorLine msg={errors.modules} />}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <Field label="Target Pendanaan" error={touched.target ? errors.target : undefined}>
              <div className="flex items-baseline gap-3 mb-4">
                <input
                  type="number"
                  min={5}
                  max={200}
                  step={0.1}
                  value={Number.isFinite(target) ? target : ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const n = raw === "" ? NaN : Number(raw);
                    setTarget(n);
                    setError("target", validateField("target", n));
                    setTouched(t => ({ ...t, target: true }));
                  }}
                  className="font-display font-bold text-5xl text-gradient-mint bg-transparent w-32 outline-none border-b border-border focus:border-primary"
                />
                <span className="font-mono text-muted-foreground">ETH</span>
                <span className="ml-auto text-sm text-muted-foreground">
                  ≈ ${Number.isFinite(target) ? (target * 3200).toLocaleString() : "—"}
                </span>
              </div>
              <input type="range" min={5} max={200} step={5}
                value={Number.isFinite(target) ? Math.min(200, Math.max(5, target)) : 5}
                onChange={(e) => { const n = +e.target.value; setTarget(n); setError("target", validateField("target", n)); }}
                className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground font-mono mt-2">
                <span>5 ETH</span><span>200 ETH</span>
              </div>
            </Field>

            <div className="rounded-2xl bg-background/40 border border-border p-5 space-y-3">
              <div className="font-display font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Ringkasan Smart Contract
              </div>
              <div className="space-y-2 text-sm font-mono">
                <Row k="UMKM" v={businessName.trim() || "—"} />
                <Row k="Kategori" v={category} />
                <Row k="Target" v={Number.isFinite(target) ? `${target} ETH` : "—"} />
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
          <button type="button" onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-2.5 text-sm font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform">
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

const Field = ({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</label>
      {hint && <span className={`text-xs font-mono ${error ? "text-destructive" : "text-muted-foreground"}`}>{hint}</span>}
    </div>
    {children}
    {error && <ErrorLine msg={error} />}
  </div>
);

const ErrorLine = ({ msg }: { msg: string }) => (
  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
    className="mt-2 flex items-center gap-2 text-xs text-destructive">
    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
    <span>{msg}</span>
  </motion.div>
);

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{k}</span>
    <span className="text-foreground truncate">{v}</span>
  </div>
);
