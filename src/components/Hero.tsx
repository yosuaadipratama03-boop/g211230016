import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-blockchain.jpg";

export const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
    <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
    <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-3xl animate-pulse-glow" />

    <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:col-span-7"
      >
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-8 text-xs font-mono uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Web3 · Blockchain · Edukasi
        </div>
        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8">
          Modal & ilmu untuk <span className="text-gradient">UMKM</span>, langsung dari rantai blok.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Ekosistem terdesentralisasi yang menghubungkan UMKM dengan investor global —
          tanpa perantara, transparan di blockchain, dan diperkuat modul edukasi bisnis.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="#solution" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-7 py-4 font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform">
            Mulai Sebagai UMKM
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#how" className="inline-flex items-center gap-2 rounded-xl glass px-7 py-4 font-semibold hover:border-primary/40 transition-colors">
            Lihat Cara Kerja
          </a>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl">
          {[
            { v: "64M+", l: "UMKM Indonesia" },
            { v: "0%", l: "Perantara" },
            { v: "24/7", l: "On-chain" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient-mint">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="lg:col-span-5 relative"
      >
        <div className="relative rounded-3xl overflow-hidden glass p-2 glow-mint animate-float">
          <img src={heroImg} alt="Visualisasi jaringan blockchain EduChain UMKM" width={1920} height={1080} className="rounded-2xl w-full h-auto" />
        </div>
        <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 font-mono text-xs">
          <div className="text-primary">● TX confirmed</div>
          <div className="text-muted-foreground mt-1">0xa3f...82bc</div>
        </div>
        <div className="absolute -top-6 -right-6 glass rounded-2xl p-4">
          <div className="text-xs text-muted-foreground">Funded today</div>
          <div className="font-display font-bold text-2xl text-gradient-amber">+1,284 ETH</div>
        </div>
      </motion.div>
    </div>
  </section>
);
