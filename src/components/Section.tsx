import { motion } from "framer-motion";
import { ReactNode } from "react";

export const SectionHeader = ({ tag, title, desc }: { tag: string; title: ReactNode; desc?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6 }}
    className="max-w-3xl mb-16"
  >
    <div className="inline-block rounded-full glass px-4 py-1.5 mb-5 text-xs font-mono uppercase tracking-wider text-primary">
      {tag}
    </div>
    <h2 className="font-display font-bold text-4xl md:text-6xl leading-[1.05] tracking-tight">
      {title}
    </h2>
    {desc && <p className="text-lg text-muted-foreground mt-6 leading-relaxed">{desc}</p>}
  </motion.div>
);

export const Section = ({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) => (
  <section id={id} className={`relative py-24 md:py-32 ${className}`}>
    <div className="container mx-auto px-6 relative z-10">{children}</div>
  </section>
);
