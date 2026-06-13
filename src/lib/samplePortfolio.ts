// Sample data for the Investor Portfolio Dashboard.

export type InvestmentStatus = "Active" | "Completed";

export interface Investment {
  id: string;
  projectName: string;
  category: string;
  invested: number; // ETH
  currentValue: number; // ETH (invested + accrued returns)
  status: InvestmentStatus;
  investedAt: number; // timestamp
  apy: number; // % estimated annual yield
}

const day = 86_400_000;
const now = Date.now();

export const SAMPLE_INVESTMENTS: Investment[] = [
  { id: "inv-01", projectName: "Kopi Nusantara", category: "F&B", invested: 8.5, currentValue: 10.2, status: "Completed", investedAt: now - 210 * day, apy: 14.2 },
  { id: "inv-02", projectName: "ByteWarung", category: "Teknologi", invested: 12.0, currentValue: 14.8, status: "Active", investedAt: now - 150 * day, apy: 18.6 },
  { id: "inv-03", projectName: "Batik Laras", category: "Fashion", invested: 5.0, currentValue: 5.7, status: "Active", investedAt: now - 95 * day, apy: 11.4 },
  { id: "inv-04", projectName: "Sambal Juara", category: "F&B", invested: 6.5, currentValue: 7.9, status: "Completed", investedAt: now - 180 * day, apy: 13.8 },
  { id: "inv-05", projectName: "TaniHidro", category: "Agrikultur", invested: 4.0, currentValue: 4.4, status: "Active", investedAt: now - 60 * day, apy: 9.8 },
  { id: "inv-06", projectName: "Kriya Kayu", category: "Kerajinan", invested: 3.5, currentValue: 3.9, status: "Active", investedAt: now - 40 * day, apy: 10.6 },
  { id: "inv-07", projectName: "Rajut Rupa", category: "Kerajinan", invested: 2.0, currentValue: 2.1, status: "Active", investedAt: now - 20 * day, apy: 8.2 },
];

export const portfolioSummary = () => {
  const totalInvested = SAMPLE_INVESTMENTS.reduce((s, i) => s + i.invested, 0);
  const totalValue = SAMPLE_INVESTMENTS.reduce((s, i) => s + i.currentValue, 0);
  const estimatedReturns = totalValue - totalInvested;
  const performance = totalInvested > 0 ? (estimatedReturns / totalInvested) * 100 : 0;
  const active = SAMPLE_INVESTMENTS.filter((i) => i.status === "Active").length;
  const completed = SAMPLE_INVESTMENTS.filter((i) => i.status === "Completed").length;
  return {
    totalInvested,
    totalValue,
    estimatedReturns,
    performance,
    fundedProjects: SAMPLE_INVESTMENTS.length,
    active,
    completed,
  };
};

// Investment distribution grouped by category (for pie/donut chart).
export const distributionByCategory = () => {
  const map = new Map<string, number>();
  SAMPLE_INVESTMENTS.forEach((i) => {
    map.set(i.category, (map.get(i.category) || 0) + i.invested);
  });
  return Array.from(map.entries()).map(([category, value]) => ({
    category,
    value: Number(value.toFixed(2)),
  }));
};

// Monthly investment activity for the last 8 months (for bar/area chart).
export const monthlyActivity = () => {
  const months = ["Nov", "Des", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
  const invested = [3.2, 5.8, 8.5, 4.0, 6.5, 7.2, 5.0, 3.5];
  const returns = [0.4, 0.9, 1.4, 0.7, 1.1, 1.3, 0.9, 0.6];
  return months.map((month, idx) => ({
    month,
    invested: invested[idx],
    returns: returns[idx],
  }));
};