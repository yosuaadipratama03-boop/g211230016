import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Award, GraduationCap, CheckCircle2, Lock, Sparkles, ShieldCheck,
  CalendarDays, Hash, User, Copy, RotateCcw, ArrowRight,
} from "lucide-react";
import {
  useCertification, issueCertification, revokeCertification,
} from "@/lib/certStore";

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// Compact certification status badge for dashboards & detail pages.
export const CertStatusBadge = () => {
  const { cert, eligible } = useCertification();
  const certified = !!cert;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md ${
        certified
          ? "bg-primary/15 text-primary"
          : eligible
          ? "bg-accent/15 text-accent"
          : "bg-secondary text-muted-foreground"
      }`}
    >
      {certified ? (
        <><ShieldCheck className="h-3.5 w-3.5" /> Certified Entrepreneur</>
      ) : eligible ? (
        <><Sparkles className="h-3.5 w-3.5" /> Siap disertifikasi</>
      ) : (
        <><Lock className="h-3.5 w-3.5" /> Belum tersertifikasi</>
      )}
    </span>
  );
};

const ModuleRow = ({ label, ok }: { label: string; ok: boolean }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl bg-background/40 border border-border p-3">
    <span className="inline-flex items-center gap-2.5 text-sm">
      <GraduationCap className="h-4 w-4 text-primary shrink-0" /> {label}
    </span>
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md shrink-0 ${
        ok ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
      }`}
    >
      {ok ? <><CheckCircle2 className="h-3.5 w-3.5" /> Lulus</> : <><Lock className="h-3.5 w-3.5" /> Belum</>}
    </span>
  </div>
);

// Full certification module: claim flow + issued certificate card.
export const CertificationCard = ({ defaultName = "" }: { defaultName?: string }) => {
  const { cert, eligible, status } = useCertification();
  const [name, setName] = useState(defaultName);

  const handleClaim = () => {
    const issued = issueCertification(name || defaultName);
    if (issued) {
      toast.success("Sertifikat diterbitkan!", {
        description: `${issued.id} · Certified EduChain Entrepreneur`,
      });
    } else {
      toast.error("Selesaikan & lulus kuis Keuangan dan Pemasaran terlebih dahulu.");
    }
  };

  // Issued certificate
  if (cert) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass rounded-3xl p-7 overflow-hidden border-primary/40"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center glow-mint shrink-0">
                <Award className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-primary">Sertifikat Digital</div>
                <h3 className="font-display font-bold text-lg leading-tight">EduChain UMKM Academy</h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-primary/15 text-primary shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified
            </span>
          </div>

          {/* Badge */}
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary/15 to-accent/10 border border-primary/30 px-5 py-4 text-center">
            <Sparkles className="h-5 w-5 text-primary mx-auto mb-1.5" />
            <div className="font-display font-bold text-lg text-gradient-mint">
              Certified EduChain Entrepreneur
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            <Field icon={User} label="Nama" value={cert.userName} />
            <Field icon={CalendarDays} label="Tanggal Selesai" value={fmtDate(cert.issuedAt)} />
            <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-xl bg-background/40 border border-border p-3">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4 text-primary" /> Certificate ID
              </span>
              <button
                onClick={() => { navigator.clipboard?.writeText(cert.id); toast.success("Certificate ID disalin"); }}
                className="inline-flex items-center gap-1.5 font-mono text-sm text-primary hover:underline"
              >
                {cert.id} <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5 mb-5">
            <ModuleRow label="Modul Manajemen Keuangan" ok={cert.finance} />
            <ModuleRow label="Modul Pemasaran Digital" ok={cert.marketing} />
          </div>

          <button
            onClick={() => { revokeCertification(); toast.info("Sertifikat di-reset (simulasi)."); }}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors font-mono"
          >
            <RotateCcw className="h-3 w-3" /> Reset sertifikat
          </button>
        </div>
      </motion.div>
    );
  }

  // Not yet issued — show progress + claim CTA
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-7"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-11 w-11 rounded-2xl bg-primary/10 grid place-items-center shrink-0">
          <Award className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl leading-tight">Sertifikasi EduChain</h3>
          <p className="text-sm text-muted-foreground">Lulus kedua kuis untuk membuka sertifikat.</p>
        </div>
      </div>

      <div className="space-y-2.5 mb-5">
        <ModuleRow label="Modul Manajemen Keuangan" ok={status.finance} />
        <ModuleRow label="Modul Pemasaran Digital" ok={status.marketing} />
      </div>

      <AnimatePresence>
        {eligible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <label className="block text-xs font-mono text-muted-foreground mb-1.5">Nama untuk sertifikat</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap / nama UMKM"
              maxLength={60}
              className="w-full rounded-xl glass border-border bg-background/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50 mb-3"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleClaim}
        disabled={!eligible}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 font-semibold text-primary-foreground glow-mint transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
      >
        {eligible ? <>Terbitkan Sertifikat <ArrowRight className="h-4 w-4" /></> : <><Lock className="h-4 w-4" /> Selesaikan kuis dulu</>}
      </button>
    </motion.div>
  );
};

const Field = ({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) => (
  <div className="rounded-xl bg-background/40 border border-border p-3">
    <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-1">
      <Icon className="h-3.5 w-3.5 text-primary" /> {label}
    </div>
    <div className="font-medium text-sm truncate">{value}</div>
  </div>
);
