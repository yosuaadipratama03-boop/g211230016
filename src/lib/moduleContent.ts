// Reusable education module content used by the module detail dialog.
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ModuleSection {
  title: string;
  body: string;
}

export interface ModuleContent {
  id: string;
  title: string;
  duration: string;
  difficulty: Difficulty;
  description: string;
  objectives: string[];
  sections: ModuleSection[];
  takeaways: string[];
  quizId?: string;
}

export const MODULE_CONTENT: ModuleContent[] = [
  {
    id: "finance",
    title: "Manajemen Keuangan UMKM",
    duration: "15 Menit",
    difficulty: "Beginner",
    description:
      "Dasar pengelolaan keuangan usaha kecil: memisahkan kas pribadi dan bisnis, membaca arus kas, serta menyusun proyeksi sederhana sebelum mengajukan pendanaan.",
    objectives: [
      "Memahami konsep arus kas dan likuiditas usaha",
      "Mempelajari cara memisahkan keuangan pribadi dan bisnis",
      "Menerapkan perhitungan margin dan titik impas (BEP)",
    ],
    sections: [
      { title: "Section 1 — Dasar Arus Kas", body: "Arus kas mencatat setiap uang masuk dan keluar. UMKM sehat bukan yang omzetnya besar, melainkan yang kasnya selalu cukup untuk kebutuhan operasional 1–3 bulan ke depan." },
      { title: "Section 2 — Pemisahan Rekening", body: "Gunakan rekening terpisah untuk usaha. Ini membuat laporan akurat, memudahkan audit investor, dan mempercepat verifikasi saat mengajukan proposal pendanaan on-chain." },
      { title: "Section 3 — Margin & Break-Even", body: "Hitung margin dari setiap produk, lalu tentukan berapa unit yang harus terjual untuk menutup biaya tetap. Angka ini menjadi dasar target pendanaan yang realistis." },
    ],
    takeaways: [
      "Kas lebih penting daripada omzet",
      "Rekening bisnis terpisah = laporan kredibel",
      "Target dana harus berbasis BEP, bukan perkiraan",
    ],
    quizId: "finance",
  },
  {
    id: "marketing",
    title: "Pemasaran Digital Lanjutan",
    duration: "20 Menit",
    difficulty: "Intermediate",
    description:
      "Strategi pemasaran digital untuk UMKM: menentukan target audiens, membangun funnel konten, dan mengukur efektivitas iklan lewat metrik yang tepat.",
    objectives: [
      "Memahami funnel pemasaran dari awareness hingga retensi",
      "Mempelajari cara menyusun konten sesuai persona pembeli",
      "Menerapkan pengukuran ROAS dan biaya akuisisi pelanggan",
    ],
    sections: [
      { title: "Section 1 — Persona & Segmentasi", body: "Tentukan siapa pembeli ideal Anda: usia, lokasi, masalah yang ingin dipecahkan. Semakin spesifik persona, semakin murah biaya iklannya." },
      { title: "Section 2 — Funnel Konten", body: "Bangun konten berlapis: edukasi untuk awareness, bukti sosial untuk pertimbangan, dan penawaran untuk konversi. Jangan menjual di sentuhan pertama." },
      { title: "Section 3 — Mengukur Performa", body: "Pantau CAC (biaya akuisisi) dan ROAS. Iklan yang menang adalah yang menghasilkan pembelian berulang, bukan sekadar banyak klik." },
    ],
    takeaways: [
      "Persona spesifik menurunkan biaya iklan",
      "Konten berlapis mengonversi lebih baik daripada hard selling",
      "Ukur CAC dan ROAS, bukan sekadar like",
    ],
    quizId: "marketing",
  },
  {
    id: "expansion",
    title: "Strategi Ekspansi Pasar",
    duration: "18 Menit",
    difficulty: "Advanced",
    description:
      "Kerangka memperluas usaha ke pasar baru: validasi permintaan, kesiapan operasional, dan manajemen risiko saat menambah cabang atau kanal distribusi.",
    objectives: [
      "Memahami kriteria kesiapan ekspansi usaha",
      "Mempelajari metode validasi pasar baru dengan biaya rendah",
      "Menerapkan mitigasi risiko rantai pasok saat scale-up",
    ],
    sections: [
      { title: "Section 1 — Sinyal Kesiapan", body: "Ekspansi hanya layak jika unit ekonomi di pasar awal sudah positif dan permintaan melebihi kapasitas produksi secara konsisten." },
      { title: "Section 2 — Validasi Pasar Baru", body: "Uji pasar baru lewat pre-order, reseller, atau pop-up sebelum membangun cabang permanen. Biaya kecil, data nyata." },
      { title: "Section 3 — Risiko Operasional", body: "Ekspansi menggandakan kompleksitas rantai pasok. Siapkan pemasok cadangan, SOP tertulis, dan buffer kas minimal 3 bulan." },
    ],
    takeaways: [
      "Jangan ekspansi sebelum unit ekonomi positif",
      "Validasi murah dulu, investasi besar kemudian",
      "Buffer kas 3 bulan adalah syarat minimum",
    ],
  },
  {
    id: "smartcontract",
    title: "Smart Contract untuk Bisnis",
    duration: "15 Menit",
    difficulty: "Intermediate",
    description:
      "Pengenalan smart contract dalam pendanaan UMKM: bagaimana dana dikunci, milestone dirilis otomatis, dan transparansi terjaga tanpa perantara.",
    objectives: [
      "Memahami cara kerja smart contract escrow",
      "Mempelajari struktur pencairan dana berbasis milestone",
      "Menerapkan praktik keamanan dasar saat berinteraksi on-chain",
    ],
    sections: [
      { title: "Section 1 — Apa Itu Smart Contract", body: "Kode yang berjalan otomatis di blockchain sesuai aturan yang disepakati. Tidak bisa diubah sepihak, sehingga investor dan UMKM sama-sama terlindungi." },
      { title: "Section 2 — Milestone Escrow", body: "Dana investor dikunci di kontrak lalu dirilis bertahap saat milestone terverifikasi. Ini menekan risiko penyalahgunaan dana." },
      { title: "Section 3 — Keamanan Wallet", body: "Jaga seed phrase, verifikasi alamat kontrak, dan gunakan kontrak yang sudah diaudit sebelum menandatangani transaksi apa pun." },
    ],
    takeaways: [
      "Smart contract menggantikan perantara, bukan kepercayaan",
      "Pencairan bertahap melindungi kedua pihak",
      "Seed phrase tidak pernah dibagikan kepada siapa pun",
    ],
  },
];

export const getModuleContent = (title: string) =>
  MODULE_CONTENT.find((m) => m.title === title);
