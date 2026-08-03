import { motion } from "framer-motion";
import { Award, CheckCircle2, Sparkles, Star, Trophy } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export interface ModuleCompletion {
  moduleTitle: string;
  score: number;
  xp: number;
  certId: string;
}

interface Props {
  completion: ModuleCompletion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONFETTI = Array.from({ length: 18 }, (_, i) => i);

export const ModuleCompletionDialog = ({ completion, open, onOpenChange }: Props) => {
  if (!completion) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-md border-border overflow-hidden">
        {/* success burst */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {CONFETTI.map((i) => (
            <motion.span
              key={i}
              className={`absolute left-1/2 top-16 h-1.5 w-1.5 rounded-full ${
                i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-accent" : "bg-primary-glow"
              }`}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos((i / CONFETTI.length) * Math.PI * 2) * 150,
                y: Math.sin((i / CONFETTI.length) * Math.PI * 2) * 120 + 40,
                scale: [0, 1.4, 0.6],
              }}
              transition={{ duration: 1.4, delay: 0.1 + i * 0.02, ease: "easeOut" }}
            />
          ))}
        </div>

        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Modul Selesai
          </DialogTitle>
        </DialogHeader>

        <div className="relative space-y-5">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground glow-mint"
          >
            <Trophy className="h-10 w-10" />
          </motion.div>

          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-mono text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </div>
            <h3 className="font-display text-xl font-bold mt-2 leading-snug">
              {completion.moduleTitle}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl border border-border bg-background/40 p-4 text-center"
            >
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Skor</div>
              <div className="font-display text-2xl font-bold text-gradient-mint">{completion.score}%</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="rounded-2xl border border-border bg-background/40 p-4 text-center"
            >
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">XP</div>
              <div className="font-display text-2xl font-bold text-accent flex items-center justify-center gap-1">
                <Star className="h-4 w-4" /> +{completion.xp}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-primary/30 bg-primary/10 p-4 flex items-center gap-3"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <Award className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="font-display font-semibold text-sm">NFT Certification Unlocked</div>
              <div className="text-xs text-muted-foreground font-mono truncate">
                {completion.certId} · simulasi (tanpa on-chain)
              </div>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-3 text-sm font-semibold text-primary-foreground glow-mint hover:scale-[1.02] transition-transform"
          >
            Lanjutkan
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
