import { motion } from "framer-motion";
import { Clock, Gauge, Target, BookOpen, Sparkles, PlayCircle, GraduationCap } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import type { ModuleContent } from "@/lib/moduleContent";

interface Props {
  module: (ModuleContent & { progress: number }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTakeQuiz?: (quizId: string) => void;
  onStartLearning?: (moduleId: string) => void;
}

const difficultyClass: Record<string, string> = {
  Beginner: "bg-primary/15 text-primary",
  Intermediate: "bg-accent/15 text-accent",
  Advanced: "bg-destructive/15 text-destructive",
};

const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export const ModuleDetailDialog = ({ module, open, onOpenChange, onTakeQuiz, onStartLearning }: Props) => {
  if (!module) return null;
  const done = module.progress >= 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto glass border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl leading-snug pr-6">{module.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{module.description}</DialogDescription>
        </DialogHeader>

        <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.06 }} className="space-y-6">
          {/* Meta */}
          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-background/40 border border-border p-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5" /> Estimasi Durasi
              </div>
              <div className="font-display font-semibold">{module.duration}</div>
            </div>
            <div className="rounded-2xl bg-background/40 border border-border p-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                <Gauge className="h-3.5 w-3.5" /> Tingkat Kesulitan
              </div>
              <span className={`inline-block text-xs font-mono px-2 py-1 rounded-md ${difficultyClass[module.difficulty]}`}>
                {module.difficulty}
              </span>
            </div>
          </motion.div>

          {/* Objectives */}
          <motion.section variants={item}>
            <SectionTitle icon={Target}>Learning Objectives</SectionTitle>
            <ul className="space-y-2">
              {module.objectives.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">•</span><span>{o}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Material */}
          <motion.section variants={item}>
            <SectionTitle icon={BookOpen}>Learning Material</SectionTitle>
            <div className="space-y-3">
              {module.sections.map((s) => (
                <div key={s.title} className="rounded-2xl bg-background/40 border border-border p-4">
                  <div className="font-display font-semibold text-sm mb-1.5">{s.title}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Takeaways */}
          <motion.section variants={item}>
            <SectionTitle icon={Sparkles}>Key Takeaways</SectionTitle>
            <ul className="space-y-2">
              {module.takeaways.map((t) => (
                <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-accent">•</span><span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Progress */}
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Progress</span>
              <span className="font-mono text-sm text-primary">{module.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${module.progress}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </motion.section>

          {/* Action */}
          <motion.div variants={item} className="pt-1">
            {done && module.quizId ? (
              <button
                type="button"
                onClick={() => onTakeQuiz?.(module.quizId!)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-3 text-sm font-semibold text-primary-foreground glow-mint hover:scale-[1.02] transition-transform"
              >
                <GraduationCap className="h-4 w-4" /> Take Quiz
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onStartLearning?.(module.id)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-3 text-sm font-semibold text-primary-foreground glow-mint hover:scale-[1.02] transition-transform"
              >
                <PlayCircle className="h-4 w-4" />
                {module.progress > 0 ? "Continue Learning" : "Start Learning"}
              </button>
            )}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

const SectionTitle = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon className="h-4 w-4 text-primary" />
    <h3 className="font-display font-semibold">{children}</h3>
  </div>
);
