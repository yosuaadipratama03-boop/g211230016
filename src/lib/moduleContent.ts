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
  overview: string;
  objectives: string[];
  sections: ModuleSection[];
  summary: string;
  takeaways: string[];
  quizId?: string;
}

export const MODULE_CONTENT: ModuleContent[] = [
  {
    id: "finance",
    title: "Manajemen Keuangan UMKM",
    duration: "25 Menit",
    difficulty: "Beginner",
    description:
      "Dasar pengelolaan keuangan usaha kecil: memisahkan kas pribadi dan bisnis, membaca arus kas, serta menyusun proyeksi sederhana sebelum mengajukan pendanaan.",
    overview:
      "Modul ini membedah lima pilar keuangan UMKM: arus kas, laba rugi, anggaran, pencatatan, dan modal kerja. Semua materi diarahkan agar Anda mampu menyusun laporan yang layak dibaca investor sebelum mengajukan pendanaan on-chain di EduChain UMKM.",
    objectives: [
      "Memahami perbedaan arus kas (cash flow) dan laba (profit) beserta dampaknya pada kelangsungan usaha",
      "Mempelajari cara menyusun laporan laba rugi sederhana dan anggaran bulanan usaha",
      "Menerapkan pencatatan keuangan rapi dan perhitungan kebutuhan modal kerja untuk target pendanaan",
    ],
    sections: [
      { title: "Section 1 — Cash Flow Management", body: "Arus kas adalah catatan uang masuk dan keluar per periode. Banyak UMKM tutup bukan karena rugi, tetapi karena kas kosong saat jatuh tempo bayar pemasok. Praktik dasarnya: pisahkan rekening pribadi dan usaha, buat proyeksi kas mingguan, percepat penerimaan (DP 50% untuk pesanan custom), dan negosiasi tempo bayar pemasok. Contoh: warung kopi dengan omzet Rp60 juta/bulan tetap bisa krisis bila Rp25 juta piutang katering baru cair 60 hari kemudian. Targetkan saldo kas minimal setara 3 bulan biaya tetap." },
      { title: "Section 2 — Profit & Loss dan Business Budgeting", body: "Laporan laba rugi menyusun omzet dikurangi HPP menjadi laba kotor, lalu dikurangi biaya operasional menjadi laba bersih. Jika omzet Rp60 juta, HPP Rp33 juta, dan biaya operasional Rp18 juta, laba bersih Rp9 juta atau margin 15%. Dari angka ini susun anggaran: alokasikan persentase tetap untuk bahan baku, gaji, pemasaran, dan dana darurat, lalu bandingkan realisasi dengan anggaran setiap akhir bulan (variance check) agar pembengkakan biaya terdeteksi lebih awal." },
      { title: "Section 3 — Financial Recording & Working Capital", body: "Pencatatan bisa dimulai dari buku kas sederhana atau spreadsheet harian berisi tanggal, keterangan, masuk, keluar, dan saldo; simpan nota sebagai bukti. Catatan rapi inilah yang menjadi lampiran proposal dan menaikkan Trust Score Anda di platform. Modal kerja dihitung sebagai aset lancar dikurangi utang lancar, dan kebutuhannya mengikuti siklus kas: lama stok + lama piutang - tempo utang. Semakin panjang siklus, semakin besar dana yang harus Anda ajukan agar operasional tidak tersendat." },
    ],
    summary:
      "Keuangan UMKM yang sehat dibangun dari kas yang terjaga, laba yang terukur, anggaran yang dipatuhi, pencatatan yang konsisten, dan modal kerja yang sesuai siklus usaha. Kelima hal ini adalah bukti kelayakan yang dinilai investor sebelum mendanai proposal Anda.",
    takeaways: [
      "Laba di atas kertas tidak menyelamatkan usaha tanpa kas; jaga buffer 3 bulan biaya tetap",
      "Rekening bisnis terpisah dan nota tersimpan membuat laporan kredibel di mata investor",
      "Anggaran hanya berguna jika realisasinya dibandingkan setiap bulan",
      "Besaran pendanaan harus dihitung dari siklus modal kerja, bukan perkiraan kasar",
    ],
    quizId: "finance",
  },
  {
    id: "marketing",
    title: "Pemasaran Digital Lanjutan",
    duration: "30 Menit",
    difficulty: "Intermediate",
    description:
      "Strategi pemasaran digital untuk UMKM: menentukan target audiens, membangun funnel konten, dan mengukur efektivitas iklan lewat metrik yang tepat.",
    overview:
      "Modul ini membahas branding, media sosial, optimasi marketplace, dasar SEO, dan iklan digital berbayar. Fokusnya adalah membangun permintaan yang bisa diukur, sehingga dana investor yang masuk benar-benar berubah menjadi penjualan berulang.",
    objectives: [
      "Memahami cara membangun identitas merek yang konsisten di seluruh kanal digital",
      "Mempelajari optimasi konten media sosial, listing marketplace, dan dasar SEO toko online",
      "Menerapkan pengukuran iklan berbayar lewat CAC, ROAS, dan nilai seumur hidup pelanggan",
    ],
    sections: [
      { title: "Section 1 — Branding & Social Media Marketing", body: "Merek bukan sekadar logo, melainkan janji yang konsisten: nama, palet warna, gaya bahasa, kemasan, dan pengalaman layanan. Tuliskan satu kalimat positioning, misalnya 'kopi robusta Temanggung roasting harian untuk pekerja remote'. Di media sosial, susun pilar konten 3-1-1: tiga konten edukasi/hiburan, satu bukti sosial (testimoni, proses produksi), satu penawaran. Konsistensi 4–5 unggahan per minggu, balas komentar dalam 24 jam, dan gunakan format video pendek untuk menaikkan jangkauan organik." },
      { title: "Section 2 — Marketplace Optimization & SEO Basics", body: "Di marketplace, judul produk yang efektif mengikuti pola: merek + jenis produk + varian + ukuran. Lengkapi foto minimal lima angle dengan latar bersih, tulis deskripsi berisi manfaat dan spesifikasi, jaga rating di atas 4,8 dan waktu balas chat di bawah satu jam karena keduanya memengaruhi peringkat pencarian internal. Untuk SEO situs sendiri, riset kata kunci turunan seperti 'keripik singkong pedas Semarang', pakai satu H1 per halaman, tulis meta description di bawah 160 karakter, kompres gambar, dan bangun halaman lokasi agar muncul di pencarian lokal." },
      { title: "Section 3 — Digital Advertising & Pengukuran", body: "Mulai iklan dengan anggaran uji kecil, misalnya Rp50 ribu per hari per set iklan, dan bandingkan minimal tiga materi kreatif. Hitung CAC = total belanja iklan dibagi jumlah pembeli baru; ROAS = pendapatan iklan dibagi belanja iklan. Iklan layak dilanjutkan bila ROAS di atas 3 dan CAC lebih kecil dari margin kotor per pelanggan. Gunakan retargeting untuk pengunjung yang belum membeli, lalu dorong pembelian kedua lewat WhatsApp atau daftar pelanggan agar LTV naik tanpa tambahan biaya iklan." },
    ],
    summary:
      "Pemasaran digital yang berhasil dimulai dari merek yang jelas, diperkuat konten sosial dan listing marketplace yang dioptimalkan, ditemukan lewat SEO, lalu diskalakan dengan iklan berbayar yang diukur menggunakan CAC dan ROAS.",
    takeaways: [
      "Positioning satu kalimat membuat seluruh konten dan iklan lebih murah dan terarah",
      "Rating, kecepatan balas, dan kualitas foto adalah faktor peringkat utama di marketplace",
      "SEO lokal memberi trafik gratis jangka panjang bagi UMKM",
      "Iklan sehat: ROAS di atas 3 dan CAC di bawah margin kotor per pelanggan",
    ],
    quizId: "marketing",
  },
  {
    id: "expansion",
    title: "Strategi Ekspansi Pasar",
    duration: "28 Menit",
    difficulty: "Advanced",
    description:
      "Kerangka memperluas usaha ke pasar baru: validasi permintaan, kesiapan operasional, dan manajemen risiko saat menambah cabang atau kanal distribusi.",
    overview:
      "Modul ini menyusun kerangka ekspansi berbasis data: analisis pasar, segmentasi pelanggan, penskalaan operasi, strategi bersaing, dan kemitraan. Tujuannya agar tambahan modal dari investor dipakai untuk pertumbuhan yang terukur, bukan spekulasi.",
    objectives: [
      "Memahami cara menghitung ukuran pasar dan membaca sinyal kesiapan ekspansi",
      "Mempelajari segmentasi pelanggan dan penyusunan strategi bersaing yang berkelanjutan",
      "Menerapkan penskalaan operasional dan kemitraan distribusi dengan risiko terkendali",
    ],
    sections: [
      { title: "Section 1 — Market Analysis & Customer Segmentation", body: "Mulai dari perkiraan ukuran pasar: jumlah calon pembeli di wilayah target dikali frekuensi beli dikali harga rata-rata, lalu tetapkan porsi realistis yang bisa Anda raih dalam 12 bulan. Lengkapi dengan analisis SWOT dan wawancara 10–15 calon pelanggan. Setelah itu, segmentasikan pelanggan berdasarkan kebutuhan, daya beli, dan kanal belanja, misalnya pembeli ritel harian, pelanggan korporat untuk hampers, dan reseller. Setiap segmen mendapat penawaran, harga, dan pesan yang berbeda." },
      { title: "Section 2 — Business Scaling", body: "Penskalaan layak dilakukan bila unit ekonomi sudah positif dan permintaan konsisten melebihi kapasitas selama minimal tiga bulan. Sebelum menambah cabang, standarkan dulu: SOP tertulis, resep atau spesifikasi produk terkunci, sistem kasir dan stok digital, serta pelatihan karyawan. Validasi pasar baru dengan biaya rendah lewat pre-order, pop-up store, atau reseller sebelum menyewa tempat permanen. Ukur keberhasilan cabang baru dengan target titik impas maksimal enam bulan." },
      { title: "Section 3 — Competitive Strategy & Partnership", body: "Bersaing di harga hampir selalu merugikan UMKM. Bangun keunggulan pada kualitas, kecepatan layanan, cerita produk, atau kedekatan komunitas. Petakan tiga pesaing terdekat dan tentukan satu hal yang Anda lakukan lebih baik. Kemitraan mempercepat ekspansi: distributor lokal, kafe atau toko oleh-oleh, hingga UMKM komplementer untuk bundling. Sepakati porsi margin, target volume, wilayah, dan masa evaluasi secara tertulis; di EduChain UMKM pembagian hasil semacam ini dapat dituangkan dalam smart contract." },
    ],
    summary:
      "Ekspansi yang aman berjalan berurutan: ukur pasar, pahami segmen, rapikan operasi, kunci keunggulan bersaing, lalu perluas jangkauan lewat mitra. Lompatan tanpa urutan ini biasanya berakhir pada krisis kas.",
    takeaways: [
      "Jangan ekspansi sebelum unit ekonomi pasar awal positif dan stabil",
      "Setiap segmen pelanggan butuh penawaran dan pesan yang berbeda",
      "SOP dan sistem digital harus siap sebelum cabang kedua dibuka",
      "Kemitraan tertulis dengan margin dan target jelas lebih murah daripada membangun kanal sendiri",
    ],
  },
  {
    id: "smartcontract",
    title: "Smart Contract untuk Bisnis",
    duration: "25 Menit",
    difficulty: "Intermediate",
    description:
      "Pengenalan smart contract dalam pendanaan UMKM: bagaimana dana dikunci, milestone dirilis otomatis, dan transparansi terjaga tanpa perantara.",
    overview:
      "Modul ini menjelaskan blockchain, dasar smart contract, penggunaan wallet Web3, alur crowdfunding di EduChain UMKM, serta bagaimana transparansi transaksi terjaga tanpa perantara. Materi disusun untuk pemilik usaha, bukan programmer.",
    objectives: [
      "Memahami konsep blockchain dan cara kerja smart contract sebagai escrow otomatis",
      "Mempelajari penggunaan wallet Web3 dan praktik keamanan dasarnya",
      "Menerapkan alur crowdfunding berbasis milestone dan pelaporan dana yang transparan",
    ],
    sections: [
      { title: "Section 1 — What is Blockchain & Smart Contract Basics", body: "Blockchain adalah buku besar digital yang disalin ke banyak komputer sekaligus, sehingga catatan transaksi tidak bisa diubah diam-diam oleh satu pihak. Smart contract adalah program yang berjalan di atasnya dengan logika sederhana 'jika syarat terpenuhi, maka dana dilepas'. Contoh untuk UMKM: kontrak menahan dana investor, dan hanya melepaskannya ketika bukti milestone diunggah dan diverifikasi. Karena aturannya publik dan tetap, investor tidak perlu percaya pada janji lisan, cukup pada kode dan rekam jejak on-chain." },
      { title: "Section 2 — Web3 Wallet", body: "Wallet adalah identitas sekaligus alat tanda tangan transaksi Anda. Alamat publik boleh dibagikan untuk menerima dana, tetapi seed phrase 12–24 kata tidak pernah boleh diberikan kepada siapa pun, termasuk pihak yang mengaku admin platform. Simpan seed phrase secara offline, gunakan wallet terpisah untuk operasional usaha dan penyimpanan jangka panjang, periksa alamat kontrak sebelum menyetujui transaksi, dan pahami bahwa setiap transaksi memerlukan biaya jaringan (gas) yang besarnya berubah mengikuti kepadatan jaringan." },
      { title: "Section 3 — Crowdfunding Workflow & Transparent Transactions", body: "Alur di EduChain UMKM: UMKM mendaftar dan menghubungkan wallet, menyelesaikan modul edukasi wajib hingga lulus kuis, mengunggah proposal berisi rencana penggunaan dana dan milestone, lalu kontrak crowdfunding di-deploy. Investor mendanai dan dana terkunci di escrow. Setiap milestone yang selesai diverifikasi memicu pencairan bertahap, misalnya 40% untuk pengadaan alat, 35% untuk bahan baku, dan 25% untuk pemasaran. Seluruh pergerakan dana tercatat sebagai hash transaksi yang bisa dicek siapa pun di halaman Transactions, sehingga pelaporan penggunaan dana berlangsung otomatis dan real-time." },
    ],
    summary:
      "Smart contract memindahkan kepercayaan dari perantara ke aturan yang transparan: dana dikunci di escrow, dilepas bertahap sesuai milestone, dan tercatat permanen di blockchain. Tugas pemilik usaha adalah menjaga keamanan wallet dan memenuhi milestone tepat waktu.",
    takeaways: [
      "Blockchain membuat catatan dana tidak bisa diubah sepihak",
      "Smart contract bekerja dengan logika jika-maka, tanpa perantara",
      "Seed phrase tidak pernah dibagikan; alamat kontrak selalu diverifikasi",
      "Pencairan bertahap berbasis milestone melindungi UMKM dan investor sekaligus",
      "Setiap transaksi punya hash yang bisa diaudit publik secara real-time",
    ],
  },
];

export const getModuleContent = (title: string) =>
  MODULE_CONTENT.find((m) => m.title === title);
