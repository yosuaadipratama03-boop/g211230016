// Education Certification System — localStorage-backed.
// A user becomes "Certified EduChain Entrepreneur" once they pass BOTH
// required education quizzes (finance + marketing).
// Certification data (name, id, date, module statuses) persists locally.

import { useEffect, useState } from "react";
import { getQuizResults } from "./quizStore";

export const REQUIRED_CERT_MODULES = ["finance", "marketing"] as const;

export interface Certification {
  id: string; // e.g. EDU-2026-A1B2C3
  userName: string;
  issuedAt: number;
  finance: boolean;
  marketing: boolean;
}

const KEY = "educhain.cert.v1";
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((fn) => fn());

// Per-module pass status pulled live from the quiz store.
export const moduleStatus = () => {
  const r = getQuizResults();
  return {
    finance: !!r.finance?.passed,
    marketing: !!r.marketing?.passed,
  };
};

// Eligible only when every required quiz is passed.
export const isEligible = (): boolean => {
  const s = moduleStatus();
  return REQUIRED_CERT_MODULES.every((m) => s[m]);
};

export const getCertification = (): Certification | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Certification) : null;
  } catch {
    return null;
  }
};

const genCertId = () => {
  const rand = Array.from({ length: 6 }, () =>
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)],
  ).join("");
  return `EDU-${new Date().getFullYear()}-${rand}`;
};

// Issue (or refresh module status on) a certification. Only succeeds if eligible.
export const issueCertification = (userName: string): Certification | null => {
  if (!isEligible()) return null;
  const s = moduleStatus();
  const existing = getCertification();
  const cert: Certification = {
    id: existing?.id ?? genCertId(),
    userName: userName.trim() || existing?.userName || "EduChain Entrepreneur",
    issuedAt: existing?.issuedAt ?? Date.now(),
    finance: s.finance,
    marketing: s.marketing,
  };
  localStorage.setItem(KEY, JSON.stringify(cert));
  emit();
  return cert;
};

export const revokeCertification = () => {
  localStorage.removeItem(KEY);
  emit();
};

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === "educhain.quiz.v1") fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
};

export const useCertification = () => {
  const [cert, setCert] = useState<Certification | null>(() => getCertification());
  const [eligible, setEligible] = useState<boolean>(() => isEligible());
  useEffect(
    () =>
      subscribe(() => {
        setCert(getCertification());
        setEligible(isEligible());
      }),
    [],
  );
  return { cert, eligible, status: moduleStatus() };
};
