// Trust Score UI: circular indicator, level badge, and full explanation card.
import { motion } from "framer-motion";
import { ShieldCheck, Info } from "lucide-react";
import {
  type TrustResult,
  type TrustLevel,
  LEVEL_LABEL_ID,
  levelStyle,
} from "@/lib/trustScore";

// ---- Circular score indicator ----
export const TrustRing = ({
  result,
  size = 120,
  stroke = 9,
  showLabel = true,
}: {
  result: TrustResult;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
}) => {
  const r = (size - stroke) / 2 - 1;
  const c = 2 * Math.PI * r;
  const style = levelStyle(result.level);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--secondary))" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={style.stroke}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - result.score / 100) }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${style.stroke})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <div className={`font-display font-bold ${style.text}`} style={{ fontSize: size * 0.28 }}>
            {result.score}
          </div>
          {showLabel && <div className="text-[10px] text-muted-foreground font-mono mt-0.5">/ 100</div>}
        </div>
      </div>
    </div>
  );
};

// ---- Trust level badge ----
export const TrustBadge = ({
  level,
  className = "",
}: {
  level: TrustLevel;
  className?: string;
}) => {
  const style = levelStyle(level);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md ${style.chip} ${className}`}>
      <ShieldCheck className="h-3.5 w-3.5" /> {level} · {LEVEL_LABEL_ID[level]}
    </span>
  );
};

// ---- Compact inline trust (for project cards) ----
export const TrustInline = ({ result }: { result: TrustResult }) => {
  const style = levelStyle(result.level);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md ${style.chip}`}>
      <ShieldCheck className="h-3.5 w-3.5" /> Trust {result.score} · {result.level}
    </span>
  );
};

// ---- Full trust score card with explanation ----
export const TrustScoreCard = ({
  result,
  title = "Trust Score",
  className = "",
}: {
  result: TrustResult;
  title?: string;
  className?: string;
}) => {
  const explanation: Record<TrustLevel, string> = {
    Excellent: "Profil bisnis sangat kuat di seluruh indikator. Risiko relatif rendah untuk investor.",
    Good: "Bisnis menunjukkan fondasi yang solid dengan beberapa area untuk ditingkatkan.",
    Average: "Beberapa indikator kepercayaan masih perlu dilengkapi sebelum mendanai.",
    Low: "Profil belum cukup lengkap. Lengkapi edukasi, verifikasi, dan proposal.",
  };

  return (
    <div className={`glass rounded-3xl p-7 ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h2 className="font-display font-bold text-xl">{title}</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <TrustRing result={result} size={130} />
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex justify-center sm:justify-start mb-2">
            <TrustBadge level={result.level} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{explanation[result.level]}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {result.factors.map((f) => {
          const pct = f.max > 0 ? (f.score / f.max) * 100 : 0;
          return (
            <div key={f.key}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium">{f.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{f.score}/{f.max}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 inline-flex items-start gap-1.5">
                <Info className="h-3 w-3 mt-0.5 shrink-0" /> {f.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
