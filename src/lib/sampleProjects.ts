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