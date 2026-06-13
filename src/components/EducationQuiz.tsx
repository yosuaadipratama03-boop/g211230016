import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Check,
  X,
  RotateCcw,
  Trophy,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PASSING_SCORE,
  saveQuizResult,
  type QuizDef,
  type QuizResult,
} from "@/lib/quizStore";

type Phase = "quiz" | "result";

interface Props {
  quiz: QuizDef | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EducationQuiz = ({ quiz, open, onOpenChange }: Props) => {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const reset = () => {
    setPhase("quiz");
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  };

  // Reset whenever a new quiz opens.
  useEffect(() => {
    if (open) reset();
  }, [open, quiz?.id]);

  const total = quiz?.questions.length ?? 0;
  const answered = answers.filter((a) => a !== undefined && a !== null).length;
  const progress = total ? Math.round((answered / total) * 100) : 0;

  const selectOption = (optIdx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optIdx;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!quiz) return;
    if (answers.filter((a) => a !== undefined && a !== null).length < total) {
      toast.error("Jawab semua pertanyaan terlebih dahulu.");
      return;
    }
    const r = saveQuizResult(quiz.id, answers);
    setResult(r);
    setPhase("result");
    if (r.passed) {
      toast.success(`Lulus! Skor ${r.score}%`, {
        description: "Modul edukasi ini telah selesai.",
      });
    } else {
      toast.error(`Belum lulus — skor ${r.score}% (min ${PASSING_SCORE}%)`, {
        description: "Pelajari pembahasan lalu coba lagi.",
      });
    }
  };

  if (!quiz) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-xl max-h-[88vh] overflow-y-auto border-border">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {quiz.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{quiz.subtitle}</p>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {phase === "quiz" ? (
            <QuizPhase
              key="quiz"
              quiz={quiz}
              current={current}
              answers={answers}
              total={total}
              progress={progress}
              onSelect={selectOption}
              onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
              onNext={() => setCurrent((c) => Math.min(total - 1, c + 1))}
              onSubmit={handleSubmit}
            />
          ) : (
            <ResultPhase
              key="result"
              quiz={quiz}
              result={result!}
              onRetake={reset}
              onClose={() => onOpenChange(false)}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

const QuizPhase = ({
  quiz,
  current,
  answers,
  total,
  progress,
  onSelect,
  onPrev,
  onNext,
  onSubmit,
}: {
  quiz: QuizDef;
  current: number;
  answers: number[];
  total: number;
  progress: number;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) => {
  const question = quiz.questions[current];
  const isLast = current === total - 1;
  const selected = answers[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
          <span>
            Pertanyaan {current + 1} / {total}
          </span>
          <span>{progress}% terjawab</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <motion.div
        key={current}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <h3 className="font-display font-semibold text-lg leading-snug">
          {question.q}
        </h3>
        <div className="space-y-2.5">
          {question.options.map((opt, i) => {
            const active = selected === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(i)}
                className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background/40 hover:border-primary/40"
                }`}
              >
                <span
                  className={`h-6 w-6 shrink-0 rounded-full border-2 grid place-items-center text-xs font-mono font-bold ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm">{opt}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={current === 0}
          className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm font-medium hover:border-primary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" /> Sebelumnya
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-2 text-sm font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform"
          >
            Selesai & Lihat Skor <Trophy className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-2 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform"
          >
            Berikutnya <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const ResultPhase = ({
  quiz,
  result,
  onRetake,
  onClose,
}: {
  quiz: QuizDef;
  result: QuizResult;
  onRetake: () => void;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      <div
        className={`rounded-2xl border p-5 text-center ${
          result.passed
            ? "border-primary/40 bg-primary/10"
            : "border-destructive/40 bg-destructive/10"
        }`}
      >
        <div
          className={`mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl ${
            result.passed
              ? "bg-primary text-primary-foreground glow-mint"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {result.passed ? (
            <Trophy className="h-7 w-7" />
          ) : (
            <AlertCircle className="h-7 w-7" />
          )}
        </div>
        <div className="font-display text-3xl font-bold">
          <span className={result.passed ? "text-gradient-mint" : "text-destructive"}>
            {result.score}%
          </span>
        </div>
        <p className="mt-1 text-sm font-medium">
          {result.passed ? "Selamat, Anda Lulus! 🎉" : "Belum Lulus"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground font-mono">
          {result.correctCount}/{result.total} benar · min {PASSING_SCORE}% · percobaan ke-
          {result.attempts}
        </p>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Pembahasan jawaban
        </div>
        {quiz.questions.map((q, i) => {
          const chosen = result.answers[i];
          const isCorrect = chosen === q.correct;
          return (
            <div
              key={i}
              className="rounded-2xl border border-border bg-background/40 p-4"
            >
              <div className="flex items-start gap-2">
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                    isCorrect
                      ? "bg-primary text-primary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    <X className="h-3 w-3" strokeWidth={3} />
                  )}
                </span>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-sm font-medium">{q.q}</p>
                  <p className="text-xs">
                    <span className="text-muted-foreground">Jawaban Anda: </span>
                    <span className={isCorrect ? "text-primary" : "text-destructive"}>
                      {chosen != null ? q.options[chosen] : "—"}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-xs">
                      <span className="text-muted-foreground">Jawaban benar: </span>
                      <span className="text-primary">{q.options[q.correct]}</span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground italic">
                    {q.explanation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2.5 text-sm font-medium hover:border-primary/40 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Ulangi Kuis
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-2.5 text-sm font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform"
        >
          {result.passed ? "Lanjutkan" : "Tutup"}
        </button>
      </div>
    </motion.div>
  );
};