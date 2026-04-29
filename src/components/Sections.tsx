import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle, BookOpen, Coins, Wallet, GraduationCap, BarChart3,
  Shield, Globe2, Award, Zap, FileCheck, Users, Trophy, TrendingUp,
  Cpu, Layers, Sparkles, ArrowRight, Check, X, Clock, Building2, Rocket
} from "lucide-react";
import { Section, SectionHeader } from "./Section";
import dashboardImg from "@/assets/dashboard-demo.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

/* ---------------- PROBLEM ---------------- */
export const Problem = () => {
  const items = [
    { icon: Wallet, title: "Akses Modal Terbatas", desc: "Bank menolak UMKM tanpa agunan; proses panjang dan birokratis menutup peluang pertumbuhan." },
    { icon: BookOpen, title: "Minim Literasi Digital", desc: "Mayoritas pelaku UMKM belum memahami strategi bisnis digital, keuangan modern, dan pemasaran online." },
    { icon: AlertTriangle, title: "Transparansi Rendah", desc: "Pengelolaan dana sering tidak terlacak; investor sulit memantau realisasi proyek yang mereka danai." },
  ];
  return (
    <Section id="problem">
      <SectionHeader
        tag="01 · Problem"
        title={<>UMKM jalan <span className="text-gradient-amber">menanjak</span>, sistem tradisional jalan di tempat.</>}
        desc="Tiga hambatan utama yang membuat 99% UMKM stagnan di skala mikro selama bertahun-tahun."
      />
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it, i) => (
          <motion.div key={it.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass rounded-3xl p-8 hover:border-accent/40 transition-colors group">
            <div className="h-14 w-14 rounded-2xl bg-accent/10 grid place-items-center mb-6 group-hover:bg-accent/20 transition-colors">
              <it.icon className="h-7 w-7 text-accent" strokeWidth={1.8} />
            </div>
            <h3 className="font-display font-bold text-2xl mb-3">{it.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

/* ---------------- URGENCY ---------------- */
export const Urgency = () => (
  <Section id="urgency">
    <div className="glass rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative grid lg:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
          <div className="inline-block rounded-full bg-accent/10 px-4 py-1.5 mb-5 text-xs font-mono uppercase tracking-wider text-accent">
            02 · Urgency
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl leading-[1.05] tracking-tight">
            Era digital tidak <span className="text-gradient-amber">menunggu</span>.
          </h2>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
            Ekonomi global telah bergeser. Tanpa adaptasi terhadap teknologi modern seperti
            blockchain dan smart contract, UMKM akan tertinggal dari pesaing yang sudah
            beroperasi tanpa batas geografis.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { v: "+312%", l: "Adopsi Web3 2024", icon: TrendingUp },
            { v: "73%", l: "UMKM tanpa pembiayaan", icon: Building2 },
            { v: "<3 dtk", l: "Settlement on-chain", icon: Zap },
            { v: "$8.7T", l: "Pasar UMKM global", icon: Globe2 },
          ].map((s, i) => (
            <motion.div key={s.l} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass rounded-2xl p-6">
              <s.icon className="h-5 w-5 text-primary mb-3" />
              <div className="font-display font-bold text-3xl text-gradient-mint">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

/* ---------------- SOLUTION ---------------- */
export const Solution = () => {
  const pillars = [
    { icon: Shield, title: "Smart Contract", desc: "Dana dikunci & dirilis otomatis sesuai milestone — tidak ada pihak ketiga, tidak ada penyelewengan." },
    { icon: GraduationCap, title: "Modul Edukasi Wajib", desc: "Manajemen keuangan, pemasaran digital, dan strategi bisnis yang harus diselesaikan sebelum funding." },
    { icon: Globe2, title: "Investor Tanpa Batas", desc: "Akses langsung ke kolam investor crypto global; deposito mulai dari pecahan kecil." },
  ];
  return (
    <Section id="solution">
      <SectionHeader
        tag="03 · Solution"
        title={<>Satu platform Web3, <span className="text-gradient-mint">dua kekuatan</span>: pendanaan dan pengetahuan.</>}
        desc="EduChain UMKM menyatukan crowdfunding berbasis smart contract dengan kurikulum bisnis yang harus diselesaikan untuk membuka funding."
      />
      <div className="grid md:grid-cols-3 gap-6">
        {pillars.map((p, i) => (
          <motion.div key={p.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative glass rounded-3xl p-8 overflow-hidden group">
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center mb-6 glow-mint">
                <p.icon className="h-7 w-7 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

/* ---------------- HOW IT WORKS ---------------- */
export const HowItWorks = () => {
  const steps = [
    { n: "01", icon: FileCheck, title: "UMKM Mendaftar", desc: "Verifikasi identitas dan upload data bisnis ke wallet on-chain." },
    { n: "02", icon: Rocket, title: "Submit Proposal", desc: "Detail proyek, target pendanaan, milestone, dan estimasi return." },
    { n: "03", icon: GraduationCap, title: "Selesaikan Edukasi", desc: "Wajib lulus modul keuangan, marketing & strategi sebelum live." },
    { n: "04", icon: Coins, title: "Investor Mendanai", desc: "Investor global mendanai dengan crypto / token EDU melalui smart contract." },
    { n: "05", icon: BarChart3, title: "Eksekusi & Lapor", desc: "Penggunaan dana tercatat real-time; investor pantau dari dashboard." },
  ];
  return (
    <Section id="how">
      <SectionHeader
        tag="04 · How it works"
        title={<>Lima langkah, <span className="text-gradient">satu rantai blok</span>.</>}
      />
      <div className="relative">
        <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="grid lg:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative">
              <div className="glass rounded-3xl p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-mono text-xs text-primary">{s.n}</div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center">
                    <s.icon className="h-6 w-6 text-primary" strokeWidth={1.8} />
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

/* ---------------- PRODUCT FEATURES ---------------- */
export const Features = () => {
  const items = [
    { icon: Layers, title: "Dashboard UMKM", desc: "Pantau funding, transaksi, dan performa bisnis dari satu tempat.", span: "lg:col-span-2 lg:row-span-2" },
    { icon: Cpu, title: "Smart Contract Crowdfunding", desc: "Escrow otomatis, milestone-based release." },
    { icon: GraduationCap, title: "Modul Interaktif", desc: "Video, kuis, dan sertifikasi NFT on-chain." },
    { icon: Award, title: "Rating & Reputasi", desc: "Skor UMKM transparan berdasarkan track record." },
    { icon: Trophy, title: "Token EDU Reward", desc: "Belajar dan investasi → dapat token reward." },
  ];
  return (
    <Section id="features">
      <SectionHeader
        tag="05 · Product"
        title={<>Fitur yang membuat <span className="text-gradient-mint">UMKM naik kelas</span>.</>}
      />
      <div className="grid lg:grid-cols-3 lg:grid-rows-2 gap-5">
        {items.map((it, i) => (
          <motion.div key={it.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`glass rounded-3xl p-7 hover:border-primary/40 transition-colors group ${it.span || ""}`}>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 grid place-items-center mb-5 group-hover:scale-110 transition-transform">
              <it.icon className="h-6 w-6 text-primary" strokeWidth={1.8} />
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl mb-2">{it.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{it.desc}</p>
            {it.span && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                {["Active", "Funded", "Investors"].map((l, j) => (
                  <div key={l} className="rounded-xl bg-background/40 border border-border p-3">
                    <div className="font-mono text-xs text-muted-foreground">{l}</div>
                    <div className="font-display font-bold text-lg text-gradient-mint">{[124, "892K", 3471][j]}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

/* ---------------- VALUE PROPOSITION ---------------- */
export const ValueProp = () => {
  const values = [
    { icon: Shield, t: "Transparansi Mutlak", d: "Setiap rupiah tercatat di blockchain publik." },
    { icon: GraduationCap, t: "Edukasi Terintegrasi", d: "Funding hanya untuk UMKM yang siap." },
    { icon: Globe2, t: "Akses Investor Global", d: "Lintas negara, lintas mata uang." },
    { icon: Shield, t: "Keamanan Kriptografi", d: "Dana terkunci di smart contract teraudit." },
  ];
  return (
    <Section id="value">
      <SectionHeader
        tag="06 · Value"
        title={<>Mengapa <span className="text-gradient-amber">EduChain</span>?</>}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {values.map((v, i) => (
          <motion.div key={v.t} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass rounded-3xl p-7">
            <v.icon className="h-8 w-8 text-primary mb-5" strokeWidth={1.6} />
            <h3 className="font-display font-bold text-xl mb-2">{v.t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

/* ---------------- MARKET ---------------- */
export const Market = () => (
  <Section id="market">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <SectionHeader
          tag="07 · Market"
          title={<>Peluang pasar <span className="text-gradient-mint">$8.7 triliun</span>.</>}
          desc="UMKM menyumbang 60% PDB Indonesia dan menyerap 97% tenaga kerja. Di negara berkembang, kesenjangan pendanaan UMKM diperkirakan US$5,2 triliun setiap tahun — sebuah pasar yang menanti solusi terdesentralisasi."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { v: "64,2 jt", l: "UMKM Indonesia" },
          { v: "60%", l: "Kontribusi PDB" },
          { v: "$5,2 T", l: "Funding gap global" },
          { v: "420 jt", l: "UMKM negara berkembang" },
        ].map((s, i) => (
          <motion.div key={s.l} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass rounded-3xl p-7">
            <div className="font-display font-bold text-4xl text-gradient">{s.v}</div>
            <div className="text-sm text-muted-foreground mt-2">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);

/* ---------------- COMPETITIVE ---------------- */
export const Competitive = () => {
  const rows = [
    ["Transparansi dana", true, false, "partial"],
    ["Tanpa perantara", true, false, false],
    ["Biaya operasional", "< 1%", "5-15%", "3-8%"],
    ["Akses investor global", true, false, "partial"],
    ["Modul edukasi terintegrasi", true, false, false],
    ["Settlement waktu", "Detik", "Hari", "Hari"],
  ];
  const Cell = ({ v }: { v: any }) => {
    if (v === true) return <Check className="h-5 w-5 text-primary mx-auto" />;
    if (v === false) return <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />;
    if (v === "partial") return <Clock className="h-5 w-5 text-accent mx-auto" />;
    return <span className="font-mono text-sm">{v}</span>;
  };
  return (
    <Section id="competitive">
      <SectionHeader
        tag="08 · Competitive"
        title={<>Lebih unggul dari <span className="text-gradient-amber">bank & crowdfunding tradisional</span>.</>}
      />
      <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="glass rounded-3xl overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-6 border-b border-border bg-background/30">
          <div className="font-mono text-xs text-muted-foreground uppercase">Kriteria</div>
          <div className="font-display font-bold text-center text-gradient-mint">EduChain</div>
          <div className="font-display font-bold text-center text-muted-foreground">Bank</div>
          <div className="font-display font-bold text-center text-muted-foreground">Crowdfunding</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-6 border-b border-border last:border-0 items-center">
            <div className="text-sm">{r[0]}</div>
            <div className="text-center"><Cell v={r[1]} /></div>
            <div className="text-center"><Cell v={r[2]} /></div>
            <div className="text-center"><Cell v={r[3]} /></div>
          </div>
        ))}
      </motion.div>
    </Section>
  );
};

/* ---------------- DEMO ---------------- */
export const Demo = () => {
  const flow = [
    { icon: FileCheck, t: "UMKM 'Kopi Nusantara' mendaftar", d: "Connect wallet, verifikasi KTP & NPWP on-chain." },
    { icon: GraduationCap, t: "Selesaikan kursus 'Pemasaran Digital'", d: "Sertifikasi NFT diterbitkan otomatis." },
    { icon: Rocket, t: "Ajukan funding 50 ETH", d: "Smart contract di-deploy dengan 4 milestone." },
    { icon: Users, t: "127 investor mendanai dalam 6 hari", d: "Dana terkunci di escrow on-chain." },
    { icon: BarChart3, t: "Laporan real-time", d: "Penggunaan dana, omzet, dan ROI tampil di dashboard." },
  ];
  return (
    <Section id="demo">
      <SectionHeader
        tag="09 · Demo"
        title={<>Lihat <span className="text-gradient-mint">platform bekerja</span>, langkah demi langkah.</>}
        desc="Simulasi alur lengkap dari pendaftaran UMKM hingga pelaporan dana ke investor."
      />
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-10 flex flex-wrap items-center gap-4">
        <Link to="/dashboard" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-3.5 font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform">
          Buka Live Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <span className="font-mono text-xs text-muted-foreground">Simulasi penuh — tidak perlu wallet</span>
      </motion.div>
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          {flow.map((f, i) => (
            <motion.div key={f.t} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-6 flex items-start gap-5 hover:border-primary/40 transition-colors">
              <div className="shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center glow-mint">
                <f.icon className="h-6 w-6 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-lg">{f.t}</div>
                <div className="text-sm text-muted-foreground mt-1">{f.d}</div>
              </div>
              <div className="font-mono text-xs text-primary mt-1">0{i + 1}</div>
            </motion.div>
          ))}
        </div>
        <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="glass rounded-3xl p-3 glow-mint">
            <div className="flex gap-1.5 px-3 py-2">
              <div className="h-3 w-3 rounded-full bg-destructive/70" />
              <div className="h-3 w-3 rounded-full bg-accent/70" />
              <div className="h-3 w-3 rounded-full bg-primary/70" />
            </div>
            <img src={dashboardImg} alt="Dashboard EduChain UMKM" loading="lazy" width={1600} height={1200} className="rounded-2xl w-full h-auto" />
          </div>
          <div className="mt-6 glass rounded-2xl p-5 font-mono text-xs leading-relaxed">
            <div className="text-primary mb-2">// smart contract event</div>
            <div className="text-muted-foreground">FundReleased(<span className="text-accent">milestone</span>: 2,</div>
            <div className="text-muted-foreground pl-6">amount: <span className="text-primary">12.5 ETH</span>,</div>
            <div className="text-muted-foreground pl-6">to: <span className="text-foreground">0xKopiNusantara</span>)</div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

/* ---------------- CTA + FOOTER ---------------- */
export const CTA = () => (
  <Section>
    <motion.div {...fadeUp} transition={{ duration: 0.7 }}
      className="relative glass rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[600px] bg-primary/30 blur-3xl rounded-full" />
      <div className="relative">
        <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
        <h2 className="font-display font-bold text-4xl md:text-6xl leading-tight tracking-tight max-w-3xl mx-auto">
          Saatnya UMKM Anda <span className="text-gradient">on-chain</span>.
        </h2>
        <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto">
          Bergabung dengan ekosistem terdesentralisasi pertama untuk pendanaan & edukasi UMKM.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <a href="#" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-7 py-4 font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform">
            Daftar UMKM <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-xl glass px-7 py-4 font-semibold hover:border-accent/40 transition-colors">
            Jadi Investor
          </a>
        </div>
      </div>
    </motion.div>
  </Section>
);

export const Footer = () => (
  <footer className="border-t border-border py-12 mt-12">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="font-display font-bold">EduChain<span className="text-gradient-mint"> UMKM</span></div>
      <div className="text-sm text-muted-foreground font-mono">© 2026 · Built on-chain for the next billion entrepreneurs.</div>
    </div>
  </footer>
);
