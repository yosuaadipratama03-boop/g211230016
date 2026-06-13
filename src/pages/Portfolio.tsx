import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Wallet, TrendingUp, TrendingDown, Coins, Layers,
  Activity, CheckCircle2, Clock, Copy, Check, PieChart as PieIcon,
  BarChart3, ArrowUpRight, Globe, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  SAMPLE_INVESTMENTS, portfolioSummary, distributionByCategory, monthlyActivity,
} from "@/lib/samplePortfolio";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const PIE_COLORS = [
  "hsl(158 84% 52%)",
  "hsl(35 95% 60%)",
  "hsl(180 80% 55%)",
  "hsl(265 80% 65%)",
  "hsl(200 85% 58%)",
  "hsl(20 90% 60%)",
];

const distChartConfig: ChartConfig = {
  value: { label: "ETH" },
};

const monthlyChartConfig: ChartConfig = {
  invested: { label: "Investasi", color: "hsl(158 84% 52%)" },
  returns: { label: "Estimasi Return", color: "hsl(35 95% 60%)" },
};

const Portfolio = () => {
  const [copied, setCopied] = useState(false);
  const summary = portfolioSummary();
  const distribution = distributionByCategory();
  const monthly = monthlyActivity();

  const walletAddress = "0xa3f1c8d2e4b9a7f6c5d4e3b2a1908f7e6d5c4b3a";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true);
      toast.success("Alamat wallet disalin");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const positive = summary.estimatedReturns >= 0;

  const stats = [
    { label: "Total Invested", value: `${summary.totalInvested.toFixed(2)} ETH`, sub: "Modal yang ditanamkan", icon: Wallet, accent: "primary" as const },
    { label: "Funded Projects", value: summary.fundedProjects.toString(), sub: "UMKM didanai", icon: Layers, accent: "primary" as const },
    { label: "Portfolio Performance", value: `${positive ? "+" : ""}${summary.performance.toFixed(1)}%`, sub: "Pertumbuhan total", icon: positive ? TrendingUp : TrendingDown, accent: "accent" as const },
    { label: "Estimated Returns", value: `${positive ? "+" : ""}${summary.estimatedReturns.toFixed(2)} ETH`, sub: "Imbal hasil estimasi", icon: Coins, accent: "accent" as const },
    { label: "Active Investments", value: summary.active.toString(), sub: "Sedang berjalan", icon: Activity, accent: "primary" as const },
    { label: "Completed", value: summary.completed.toString(), sub: "Telah selesai", icon: CheckCircle2, accent: "accent" as const },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
                <PieIcon className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div className="font-display font-bold leading-none">
                EduChain<span className="text-gradient-mint"> UMKM</span>
              </div>
            </div>
          </div>
          <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Explore Projects
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-8">
        {/* Title */}
        <motion.div {...fadeUp}>
          <div className="font-mono text-xs text-primary uppercase tracking-wider mb-2">
            Investor Dashboard
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl">
            Investor <span className="text-gradient-mint">Portfolio</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Pantau performa investasimu di seluruh UMKM, distribusi aset, dan estimasi imbal hasil secara real-time.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp} transition={{ delay: i * 0.05 }}>
              <Card className="glass border-border h-full">
                <CardContent className="p-5 sm:p-6">
                  <div className={cn(
                    "h-10 w-10 rounded-xl grid place-items-center mb-4",
                    s.accent === "primary" ? "bg-primary/10" : "bg-accent/10"
                  )}>
                    <s.icon className={cn("h-5 w-5", s.accent === "primary" ? "text-primary" : "text-accent")} strokeWidth={1.8} />
                  </div>
                  <div className="font-display font-bold text-2xl sm:text-3xl break-words">{s.value}</div>
                  <div className="text-sm font-medium mt-1">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Distribution */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Card className="glass border-border h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PieIcon className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg font-display">Investment Distribution</CardTitle>
                </div>
                <CardDescription>Alokasi modal per kategori bisnis (ETH).</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={distChartConfig} className="mx-auto aspect-square max-h-[280px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="category"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      strokeWidth={2}
                    >
                      {distribution.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} stroke="hsl(220 40% 9%)" />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {distribution.map((d, idx) => (
                    <div key={d.category} className="flex items-center gap-2 text-sm">
                      <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground truncate">{d.category}</span>
                      <span className="ml-auto font-mono text-xs">{d.value} ETH</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly activity */}
          <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
            <Card className="glass border-border h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  <CardTitle className="text-lg font-display">Monthly Investment Activity</CardTitle>
                </div>
                <CardDescription>Investasi & estimasi return per bulan (ETH).</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={monthlyChartConfig} className="aspect-auto h-[280px] w-full">
                  <BarChart data={monthly} margin={{ left: -16, right: 8, top: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="invested" fill="var(--color-invested)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="returns" fill="var(--color-returns)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Holdings + Wallet */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Holdings list */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <Card className="glass border-border h-full">
              <CardHeader>
                <CardTitle className="text-lg font-display">Your Investments</CardTitle>
                <CardDescription>Rincian setiap posisi investasi UMKM.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {SAMPLE_INVESTMENTS.map((inv) => {
                  const gain = inv.currentValue - inv.invested;
                  const gainPct = (gain / inv.invested) * 100;
                  return (
                    <div key={inv.id} className="rounded-2xl bg-background/40 border border-border p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center font-display font-bold text-sm text-primary">
                            {inv.projectName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-display font-semibold">{inv.projectName}</div>
                            <div className="text-xs text-muted-foreground">{inv.category}</div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "border",
                            inv.status === "Active"
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-accent/10 text-accent border-accent/30"
                          )}
                        >
                          {inv.status === "Active" ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {inv.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Invested</div>
                          <div className="font-mono font-medium">{inv.invested.toFixed(2)} ETH</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Value</div>
                          <div className="font-mono font-medium">{inv.currentValue.toFixed(2)} ETH</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Return</div>
                          <div className={cn("font-mono font-medium flex items-center gap-1", gain >= 0 ? "text-primary" : "text-destructive")}>
                            <ArrowUpRight className="h-3 w-3" />
                            {gain >= 0 ? "+" : ""}{gainPct.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Wallet info */}
          <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
            <Card className="glass border-primary/30 h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-display">Wallet Info</CardTitle>
                    <CardDescription>Detail koneksi wallet.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-background/40 border border-border p-4">
                  <div className="text-xs text-muted-foreground mb-1">Wallet Address</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs break-all">{`${walletAddress.slice(0, 14)}...${walletAddress.slice(-6)}`}</span>
                    <button
                      onClick={handleCopy}
                      className="h-7 w-7 rounded-md grid place-items-center hover:bg-muted transition-colors shrink-0"
                      title="Copy address"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-background/40 border border-border p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Wallet Status</span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/30 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-background/40 border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Network</span>
                  </div>
                  <span className="text-xs font-mono text-accent">Lovable Testnet</span>
                </div>

                <div className="rounded-xl bg-background/40 border border-border p-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Portfolio Value</span>
                    <span className="font-mono font-medium">{summary.totalValue.toFixed(2)} ETH</span>
                  </div>
                  <Progress value={Math.min(100, summary.performance)} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-2">
                    {positive ? "+" : ""}{summary.performance.toFixed(1)}% sejak awal investasi
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;