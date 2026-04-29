// Lightweight global store for simulated proposal submission.
// Persists to localStorage so Demo → Dashboard handoff works across navigation.

export type ProposalStatus = "draft" | "education" | "live" | "funded";

export interface Proposal {
  businessName: string;
  category: string;
  description: string;
  targetEth: number;
  modules: string[];
  status: ProposalStatus;
  submittedAt: number;
  raisedEth: number;
  investors: number;
}

const KEY = "educhain.proposal.v1";

const listeners = new Set<() => void>();

export const getProposal = (): Proposal | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Proposal) : null;
  } catch {
    return null;
  }
};

export const setProposal = (p: Proposal | null) => {
  if (p) localStorage.setItem(KEY, JSON.stringify(p));
  else localStorage.removeItem(KEY);
  listeners.forEach((fn) => fn());
};

export const subscribe = (fn: () => void) => {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) fn(); };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
};

import { useEffect, useState } from "react";

export const useProposal = () => {
  const [p, setP] = useState<Proposal | null>(() => getProposal());
  useEffect(() => subscribe(() => setP(getProposal())), []);
  return p;
};

export const AVAILABLE_MODULES = [
  { id: "finance", title: "Manajemen Keuangan UMKM", duration: "2 jam", required: true },
  { id: "marketing", title: "Pemasaran Digital Lanjutan", duration: "3 jam", required: true },
  { id: "expansion", title: "Strategi Ekspansi Pasar", duration: "2.5 jam", required: false },
  { id: "smartcontract", title: "Smart Contract untuk Bisnis", duration: "1.5 jam", required: false },
  { id: "branding", title: "Branding & Storytelling", duration: "2 jam", required: false },
];

export const CATEGORIES = ["F&B", "Fashion", "Kerajinan", "Agrikultur", "Teknologi", "Jasa"];
