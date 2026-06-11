// Sample marketplace data for the "Explore Projects" page.

export type SampleStatus = "Active" | "Funded" | "Pending";

export interface SampleProject {
  id: string;
  businessName: string;
  category: string;
  description: string;
  targetEth: number;
  raisedEth: number;
  investors: number;
  status: SampleStatus;
  createdAt: number; // timestamp, larger = newer
  location: string;
  owner: string;
  wallet: string;
  modules: string[];
}

const day = 86_400_000;
const now = Date.now();

export const SAMPLE_PROJECTS: SampleProject[] = [
  {
    id: "kopi-nusantara",
    businessName: "Kopi Nusantara",
    category: "F&B",
    description:
      "Ekspansi roastery specialty coffee asal Bali dengan rantai pasok petani lokal dan distribusi nasional berbasis smart contract.",
    targetEth: 55,
    raisedEth: 55,
    investors: 127,
    status: "Funded",
    createdAt: now - 28 * day,
    location: "Bali, Indonesia",
    owner: "Putu Wira",
    wallet: "0xa3f1...82bc",
    modules: ["Manajemen Keuangan UMKM", "Pemasaran Digital Lanjutan"],
  },
  {
    id: "batik-laras",
    businessName: "Batik Laras",
    category: "Fashion",
    description:
      "Produksi batik tulis pewarna alam dengan pengrajin perempuan di Pekalongan, target pasar ekspor Eropa.",
    targetEth: 40,
    raisedEth: 31.5,
    investors: 84,
    status: "Active",
    createdAt: now - 5 * day,
    location: "Pekalongan, Indonesia",
    owner: "Sri Laras",
    wallet: "0x7c92...41ac",
    modules: ["Branding & Storytelling", "Pemasaran Digital Lanjutan"],
  },
  {
    id: "tani-hidro",
    businessName: "TaniHidro",
    category: "Agrikultur",
    description:
      "Kebun hidroponik urban dengan IoT monitoring dan pasokan langsung ke restoran serta supermarket lokal.",
    targetEth: 70,
    raisedEth: 18,
    investors: 46,
    status: "Active",
    createdAt: now - 2 * day,
    location: "Bandung, Indonesia",
    owner: "Agus Pranata",
    wallet: "0xf910...09de",
    modules: ["Manajemen Keuangan UMKM", "Strategi Ekspansi Pasar"],
  },
  {
    id: "rajut-rupa",
    businessName: "Rajut Rupa",
    category: "Kerajinan",
    description:
      "Brand rajutan handmade dengan komunitas crafter rumahan; ekspansi ke marketplace global dan custom order.",
    targetEth: 25,
    raisedEth: 0,
    investors: 0,
    status: "Pending",
    createdAt: now - 1 * day,
    location: "Yogyakarta, Indonesia",
    owner: "Maya Putri",
    wallet: "0x4b77...77fa",
    modules: ["Branding & Storytelling"],
  },
  {
    id: "byte-warung",
    businessName: "ByteWarung",
    category: "Teknologi",
    description:
      "Aplikasi kasir & inventori untuk warung tradisional dengan integrasi pembayaran on-chain dan analitik penjualan.",
    targetEth: 90,
    raisedEth: 67,
    investors: 152,
    status: "Active",
    createdAt: now - 9 * day,
    location: "Jakarta, Indonesia",
    owner: "Rizki Saputra",
    wallet: "0xc123...3b8e",
    modules: ["Smart Contract untuk Bisnis", "Manajemen Keuangan UMKM"],
  },
  {
    id: "sambal-juara",
    businessName: "Sambal Juara",
    category: "F&B",
    description:
      "Produsen sambal kemasan siap saji dengan resep daerah; perluasan kapasitas produksi dan sertifikasi ekspor.",
    targetEth: 35,
    raisedEth: 35,
    investors: 98,
    status: "Funded",
    createdAt: now - 40 * day,
    location: "Surabaya, Indonesia",
    owner: "Dewi Anggraini",
    wallet: "0x2d44...51be",
    modules: ["Pemasaran Digital Lanjutan", "Strategi Ekspansi Pasar"],
  },
  {
    id: "kriya-kayu",
    businessName: "Kriya Kayu",
    category: "Kerajinan",
    description:
      "Furnitur kayu jati daur ulang dengan desain modern minimalis; ekspansi workshop dan kanal penjualan online.",
    targetEth: 50,
    raisedEth: 22.5,
    investors: 61,
    status: "Active",
    createdAt: now - 6 * day,
    location: "Jepara, Indonesia",
    owner: "Bambang Setyo",
    wallet: "0x8e21...90cd",
    modules: ["Manajemen Keuangan UMKM", "Branding & Storytelling"],
  },
  {
    id: "jasa-bersih",
    businessName: "BersihGo",
    category: "Jasa",
    description:
      "Platform layanan kebersihan on-demand dengan mitra terverifikasi dan sistem rating transparan berbasis blockchain.",
    targetEth: 30,
    raisedEth: 4,
    investors: 12,
    status: "Pending",
    createdAt: now - 12 * 3600 * 1000,
    location: "Medan, Indonesia",
    owner: "Hendra Wijaya",
    wallet: "0x5f88...12ab",
    modules: ["Pemasaran Digital Lanjutan"],
  },
];

export const getSampleProject = (id: string) =>
  SAMPLE_PROJECTS.find((p) => p.id === id);

export const SAMPLE_CATEGORIES = [
  "Semua",
  ...Array.from(new Set(SAMPLE_PROJECTS.map((p) => p.category))),
];

export const progressOf = (p: SampleProject) =>
  p.targetEth > 0 ? Math.min(100, (p.raisedEth / p.targetEth) * 100) : 0;

// ---- Derived demo content for the Project Detail page ----

export type MilestoneStatus = "done" | "active" | "upcoming";
export interface Milestone {
  title: string;
  desc: string;
  date: string;
  status: MilestoneStatus;
}

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export const milestonesOf = (p: SampleProject): Milestone[] => {
  const pct = progressOf(p);
  const base = p.createdAt;
  const steps: { title: string; desc: string; offset: number; at: number }[] = [
    { title: "Proposal Diajukan", desc: "UMKM menyelesaikan proposal pendanaan & verifikasi identitas.", offset: 0, at: 0 },
    { title: "Sertifikasi Edukasi", desc: "Modul edukasi bisnis wajib diselesaikan & diverifikasi on-chain.", offset: 7 * day, at: 5 },
    { title: "Smart Contract Deploy", desc: "Kontrak escrow pendanaan di-deploy ke jaringan.", offset: 14 * day, at: 15 },
    { title: "Penggalangan Dana", desc: "Investor mendanai proyek hingga target tercapai.", offset: 21 * day, at: 60 },
    { title: "Pencairan & Eksekusi", desc: "Dana dilepas per milestone untuk eksekusi bisnis.", offset: 45 * day, at: 100 },
  ];
  return steps.map((s) => ({
    title: s.title,
    desc: s.desc,
    date: fmtDate(base + s.offset),
    status: pct >= s.at ? "done" : pct >= s.at - 20 ? "active" : "upcoming",
  }));
};

export type RiskLevel = "Rendah" | "Sedang" | "Tinggi";
export interface RiskItem {
  label: string;
  level: RiskLevel;
  note: string;
}

export const riskOf = (p: SampleProject): { overall: RiskLevel; score: number; items: RiskItem[] } => {
  const pct = progressOf(p);
  const traction: RiskLevel = p.investors > 100 ? "Rendah" : p.investors > 40 ? "Sedang" : "Tinggi";
  const funding: RiskLevel = pct >= 80 ? "Rendah" : pct >= 40 ? "Sedang" : "Tinggi";
  const education: RiskLevel = p.modules.length >= 2 ? "Rendah" : "Sedang";
  const market: RiskLevel = ["F&B", "Teknologi", "Agrikultur"].includes(p.category) ? "Rendah" : "Sedang";
  const items: RiskItem[] = [
    { label: "Validasi Pasar", level: market, note: `Kategori ${p.category} dengan permintaan terverifikasi.` },
    { label: "Traksi Investor", level: traction, note: `${p.investors} investor telah berpartisipasi.` },
    { label: "Progres Pendanaan", level: funding, note: `${pct.toFixed(0)}% dari target tercapai.` },
    { label: "Kesiapan Manajemen", level: education, note: `${p.modules.length} modul edukasi tersertifikasi.` },
  ];
  const map: Record<RiskLevel, number> = { Rendah: 1, Sedang: 2, Tinggi: 3 };
  const avg = items.reduce((a, b) => a + map[b.level], 0) / items.length;
  const overall: RiskLevel = avg <= 1.5 ? "Rendah" : avg <= 2.3 ? "Sedang" : "Tinggi";
  const score = Math.round((1 - (avg - 1) / 2) * 100);
  return { overall, score, items };
};

export const contractStatusOf = (p: SampleProject) => {
  if (p.status === "Pending")
    return { label: "Menunggu Deploy", deployed: false, network: "Lovable Testnet", hash: "—" };
  return {
    label: "Terdeploy & Aktif",
    deployed: true,
    network: "Lovable Testnet",
    hash: `0x${p.id.replace(/[^a-z0-9]/g, "").slice(0, 6)}9f${p.investors}c4e1`,
  };
};

export const ownerInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();