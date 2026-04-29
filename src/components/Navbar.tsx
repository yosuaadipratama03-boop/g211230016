import { motion } from "framer-motion";
import { Link2 } from "lucide-react";

const links = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
];

export const Navbar = () => (
  <motion.header
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
  >
    <nav className="container mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
      <a href="#" className="flex items-center gap-2">
        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center glow-mint">
          <Link2 className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="font-display font-bold text-lg leading-none">
          EduChain<span className="text-gradient-mint"> UMKM</span>
        </div>
      </a>
      <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
          </li>
        ))}
      </ul>
      <a href="#demo" className="rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-mint hover:scale-105 transition-transform">
        Connect Wallet
      </a>
    </nav>
  </motion.header>
);
