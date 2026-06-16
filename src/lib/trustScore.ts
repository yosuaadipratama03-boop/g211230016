// Trust Score system for UMKM proposals.
// Produces a 0–100 score from five weighted factors and maps it to a trust level.
// Works both for marketplace sample projects and for the user's own live proposal
// (which can pull live education-certification status).

import type { SampleProject } from "./sampleProjects";
import { progressOf } from "./sampleProjects";

export type TrustLevel = "Excellent" | "Good" | "Average" | "Low";

export interface TrustFactor {
  key: string;
  label: string;
  score: number; // points earned
  max: number; // points possible
  detail: string;
}

export interface TrustResult {
  score: number; // 0–100
  level: TrustLevel;
  factors: TrustFactor[];
}

// ---- Level mapping ----
export const levelOf = (score: number): TrustLevel => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Average";
  return "Low";
};

export const LEVEL_LABEL_ID: Record<TrustLevel, string> = {
  Excellent: "Sangat Tepercaya",
  Good: "Tepercaya",
  Average: "Cukup",
  Low: "Rendah",
};

// Tailwind classes per level (semantic tokens only).
export const levelStyle = (level: TrustLevel) => {
  switch (level) {
    case "Excellent":
      return { text: "text-primary", bg: "bg-primary/15", stroke: "hsl(var(--primary))", chip: "bg-primary/15 text-primary" };
    case "Good":
      return { text: "text-accent", bg: "bg-accent/15", stroke: "hsl(var(--accent))", chip: "bg-accent/15 text-accent" };
    case "Average":
      return { text: "text-foreground", bg: "bg-secondary", stroke: "hsl(var(--muted-foreground))", chip: "bg-secondary text-foreground/80" };
    default:
      return { text: "text-destructive", bg: "bg-destructive/15", stroke: "hsl(var(--destructive))", chip: "bg-destructive/15 text-destructive" };
  }
};

// ---- Factor weights (sum = 100) ----
const W = {
  education: 25,
  completeness: 20,
  wallet: 15,
  verification: 20,
  funding: 20,
} as const;

export interface TrustInput {
  modules: string[];
  descriptionLength: number;
  hasTarget: boolean;
  hasCategory: boolean;
  walletConnected: boolean;
  verified: boolean; // business verification status
  progressPct: number; // 0–100
  investors: number;
}

const round = (n: number) => Math.round(n);

export const computeTrust = (input: TrustInput): TrustResult => {
  // 1. Education completed
  const eduCount = input.modules.length;
  const eduScore = eduCount >= 2 ? W.education : eduCount === 1 ? W.education * 0.6 : 0;
  const eduDetail =
    eduCount >= 2
      ? `${eduCount} modul edukasi diselesaikan & tersertifikasi.`
      : eduCount === 1
      ? "1 modul edukasi selesai — lengkapi modul wajib lainnya."
      : "Belum ada modul edukasi yang diselesaikan.";

  // 2. Proposal completeness
  let comp = 0;
  if (input.descriptionLength >= 120) comp += W.completeness * 0.5;
  else if (input.descriptionLength >= 40) comp += W.completeness * 0.3;
  if (input.hasTarget) comp += W.completeness * 0.3;
  if (input.hasCategory) comp += W.completeness * 0.2;
  const compDetail =
    comp >= W.completeness * 0.9
      ? "Proposal lengkap: deskripsi, target, dan kategori terisi."
      : "Beberapa bagian proposal masih bisa dilengkapi.";

  // 3. Wallet connected
  const walletScore = input.walletConnected ? W.wallet : 0;
  const walletDetail = input.walletConnected
    ? "Wallet terhubung & terverifikasi on-chain."
    : "Wallet belum terhubung.";

  // 4. Business verification status
  const verScore = input.verified ? W.verification : W.verification * 0.3;
  const verDetail = input.verified
    ? "Identitas bisnis terverifikasi."
    : "Verifikasi bisnis sedang menunggu peninjauan.";

  // 5. Funding activity
  const progPart = Math.min(1, input.progressPct / 100) * (W.funding * 0.6);
  const invPart = Math.min(1, input.investors / 80) * (W.funding * 0.4);
  const fundScore = progPart + invPart;
  const fundDetail = `${round(input.progressPct)}% target tercapai · ${input.investors} investor.`;

  const factors: TrustFactor[] = [
    { key: "education", label: "Edukasi Selesai", score: round(eduScore), max: W.education, detail: eduDetail },
    { key: "completeness", label: "Kelengkapan Proposal", score: round(comp), max: W.completeness, detail: compDetail },
    { key: "wallet", label: "Wallet Terhubung", score: round(walletScore), max: W.wallet, detail: walletDetail },
    { key: "verification", label: "Verifikasi Bisnis", score: round(verScore), max: W.verification, detail: verDetail },
    { key: "funding", label: "Aktivitas Pendanaan", score: round(fundScore), max: W.funding, detail: fundDetail },
  ];

  const score = Math.max(0, Math.min(100, round(factors.reduce((a, f) => a + f.score, 0))));
  return { score, level: levelOf(score), factors };
};

// Convenience: trust score for a marketplace sample project.
export const trustScoreOfProject = (p: SampleProject): TrustResult =>
  computeTrust({
    modules: p.modules,
    descriptionLength: p.description.length,
    hasTarget: p.targetEth > 0,
    hasCategory: !!p.category,
    walletConnected: !!p.wallet,
    verified: p.status !== "Pending",
    progressPct: progressOf(p),
    investors: p.investors,
  });
