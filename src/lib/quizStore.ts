// Education quiz data + localStorage-backed result tracking.
// Each required learning module (finance, marketing) has a 5-question quiz.
// Users must score >= PASSING_SCORE to unlock the funding stage.

import { useEffect, useState } from "react";

export const PASSING_SCORE = 80; // percent

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number; // index into options
  explanation: string;
}

export interface QuizDef {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  questions: QuizQuestion[];
}

export const QUIZZES: QuizDef[] = [
  {
    id: "finance",
    moduleId: "finance",
    title: "Kuis Manajemen Keuangan",
    subtitle: "Uji pemahaman pengelolaan keuangan UMKM",
    questions: [
      {
        q: "Apa fungsi utama arus kas (cash flow) dalam bisnis UMKM?",
        options: [
          "Menghitung jumlah karyawan",
          "Memantau uang masuk dan keluar agar bisnis tetap likuid",
          "Menentukan warna logo perusahaan",
          "Mengukur tinggi gedung kantor",
        ],
        correct: 1,
        explanation:
          "Arus kas memantau pergerakan uang masuk dan keluar sehingga bisnis tetap memiliki likuiditas untuk operasional.",
      },
      {
        q: "Mengapa pemisahan keuangan pribadi dan bisnis itu penting?",
        options: [
          "Agar laporan keuangan akurat dan keputusan bisnis tepat",
          "Agar pajak menjadi lebih mahal",
          "Supaya bisa membeli barang pribadi lebih banyak",
          "Tidak penting sama sekali",
        ],
        correct: 0,
        explanation:
          "Memisahkan keuangan pribadi dan bisnis membuat laporan akurat dan memudahkan evaluasi profitabilitas usaha.",
      },
      {
        q: "Apa yang dimaksud dengan margin keuntungan (profit margin)?",
        options: [
          "Total biaya operasional",
          "Jumlah total penjualan",
          "Persentase laba dari setiap penjualan",
          "Jumlah utang perusahaan",
        ],
        correct: 2,
        explanation:
          "Profit margin adalah persentase laba yang diperoleh dari setiap penjualan setelah dikurangi biaya.",
      },
      {
        q: "Dana darurat bisnis sebaiknya cukup untuk menutup biaya operasional selama?",
        options: ["1 hari", "3–6 bulan", "5 tahun", "Tidak perlu dana darurat"],
        correct: 1,
        explanation:
          "Idealnya dana darurat menutup 3–6 bulan biaya operasional untuk menghadapi kondisi tak terduga.",
      },
      {
        q: "Apa manfaat pencatatan keuangan yang rapi bagi UMKM yang mencari pendanaan?",
        options: [
          "Membuat investor sulit percaya",
          "Tidak ada manfaatnya",
          "Meningkatkan kepercayaan investor dan memudahkan akses modal",
          "Hanya untuk pajak besar",
        ],
        correct: 2,
        explanation:
          "Catatan keuangan yang rapi meningkatkan transparansi dan kepercayaan investor sehingga memudahkan akses pendanaan.",
      },
    ],
  },
  {
    id: "marketing",
    moduleId: "marketing",
    title: "Kuis Pemasaran Digital",
    subtitle: "Uji strategi pemasaran digital UMKM",
    questions: [
      {
        q: "Apa tujuan utama dari target audience (audiens sasaran)?",
        options: [
          "Menjual ke semua orang tanpa fokus",
          "Mengarahkan pesan pemasaran ke kelompok yang paling relevan",
          "Menghabiskan anggaran iklan secepatnya",
          "Menghindari pelanggan baru",
        ],
        correct: 1,
        explanation:
          "Menentukan audiens sasaran membuat pesan pemasaran lebih relevan dan efisien secara biaya.",
      },
      {
        q: "Apa yang dimaksud dengan konversi (conversion) dalam pemasaran digital?",
        options: [
          "Jumlah pengikut media sosial",
          "Pengunjung yang melakukan tindakan yang diinginkan, mis. membeli",
          "Banyaknya gambar di website",
          "Lama waktu loading halaman",
        ],
        correct: 1,
        explanation:
          "Konversi terjadi saat pengunjung melakukan tindakan yang diinginkan seperti membeli atau mendaftar.",
      },
      {
        q: "Mengapa konten yang konsisten penting di media sosial?",
        options: [
          "Agar algoritma dan audiens tetap terhubung dengan brand",
          "Agar akun cepat diblokir",
          "Supaya tidak perlu strategi",
          "Tidak berpengaruh apa pun",
        ],
        correct: 0,
        explanation:
          "Konsistensi konten menjaga keterlibatan audiens dan membantu brand tetap diingat serta disukai algoritma.",
      },
      {
        q: "Apa keunggulan utama pemasaran digital dibanding pemasaran tradisional bagi UMKM?",
        options: [
          "Selalu gratis tanpa biaya",
          "Tidak bisa diukur hasilnya",
          "Biaya lebih terjangkau dan hasil dapat diukur (terukur)",
          "Hanya untuk perusahaan besar",
        ],
        correct: 2,
        explanation:
          "Pemasaran digital relatif terjangkau dan hasilnya dapat diukur secara real-time melalui data.",
      },
      {
        q: "Apa fungsi call-to-action (CTA) dalam sebuah kampanye?",
        options: [
          "Menghias halaman",
          "Mendorong audiens melakukan langkah berikutnya",
          "Menambah jumlah kata",
          "Memperlambat website",
        ],
        correct: 1,
        explanation:
          "CTA mengarahkan audiens untuk mengambil tindakan, seperti 'Beli Sekarang' atau 'Daftar'.",
      },
    ],
  },
];

export const getQuizById = (id: string) => QUIZZES.find((q) => q.id === id);

export interface QuizResult {
  quizId: string;
  score: number; // percent
  correctCount: number;
  total: number;
  passed: boolean;
  attempts: number;
  answers: number[];
  completedAt: number;
}

export type QuizResults = Record<string, QuizResult>;

const KEY = "educhain.quiz.v1";
const listeners = new Set<() => void>();

export const getQuizResults = (): QuizResults => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QuizResults) : {};
  } catch {
    return {};
  }
};

export const getQuizResult = (id: string): QuizResult | undefined =>
  getQuizResults()[id];

export const saveQuizResult = (
  quizId: string,
  answers: number[],
): QuizResult => {
  const quiz = getQuizById(quizId);
  if (!quiz) throw new Error("Quiz not found: " + quizId);
  const correctCount = quiz.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0,
  );
  const total = quiz.questions.length;
  const score = Math.round((correctCount / total) * 100);
  const prev = getQuizResults();
  const attempts = (prev[quizId]?.attempts ?? 0) + 1;
  const result: QuizResult = {
    quizId,
    score,
    correctCount,
    total,
    passed: score >= PASSING_SCORE,
    attempts,
    answers,
    completedAt: Date.now(),
  };
  const next = { ...prev, [quizId]: result };
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((fn) => fn());
  return result;
};

export const resetQuiz = (quizId: string) => {
  const next = getQuizResults();
  delete next[quizId];
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((fn) => fn());
};

// Are all required-module quizzes passed for the given selected module ids?
export const requiredQuizzesPassed = (moduleIds: string[]): boolean => {
  const results = getQuizResults();
  const required = QUIZZES.filter((q) => moduleIds.includes(q.moduleId));
  if (required.length === 0) return true;
  return required.every((q) => results[q.id]?.passed);
};

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
};

export const useQuizResults = (): QuizResults => {
  const [results, setResults] = useState<QuizResults>(() => getQuizResults());
  useEffect(() => subscribe(() => setResults(getQuizResults())), []);
  return results;
};