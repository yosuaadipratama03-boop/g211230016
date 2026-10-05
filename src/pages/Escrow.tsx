import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useAccount, useReadContract, useReadContracts, useSwitchChain,
  useWaitForTransactionReceipt, useWriteContract,
} from "wagmi";
import { formatEther, keccak256, parseEther, toBytes, type Hash } from "viem";
import { toast } from "sonner";
import {
  ArrowLeft, ExternalLink, Loader2, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Wallet,
} from "lucide-react";
import { escrowAbi } from "@/lib/contractAbis";
import {
  ESCROW_ADDRESS, CONTRACT_CHAIN_ID, explorerTx, explorerAddress, PROJECT_STATUS, MILESTONE_STATUS,
} from "@/lib/contracts";
import { friendlyWalletError, shortAddr } from "@/lib/walletErrors";

const card = "glass rounded-3xl p-6";
const input = "w-full rounded-xl bg-background/60 border border-border px-3 py-2 text-sm";
const btn = "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50";

/** Shared tx lifecycle: wallet confirmation → submitted → confirmed/failed. */
function useTx(onConfirmed?: () => void) {
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<Hash>();
  const [err, setErr] = useState<string>();
  const receipt = useWaitForTransactionReceipt({ hash, chainId: CONTRACT_CHAIN_ID });
  useEffect(() => { if (receipt.isSuccess) onConfirmed?.(); }, [receipt.isSuccess]); // eslint-disable-line
  const send = async (args: Parameters<typeof writeContractAsync>[0]) => {
    setErr(undefined); setHash(undefined);
    try { setHash(await writeContractAsync(args)); }
    catch (e) { const m = friendlyWalletError(e); setErr(m); toast.error(m); }
  };
  const state = isPending ? "wallet" : hash && receipt.isLoading ? "submitted"
    : receipt.isSuccess ? (receipt.data.status === "success" ? "confirmed" : "failed")
    : err || receipt.isError ? "failed" : "idle";
  return { send, hash, state, err };
}

function TxStatus({ tx }: { tx: ReturnType<typeof useTx> }) {
  if (tx.state === "idle") return null;
  const map = {
    wallet: [<Loader2 key="i" className="h-4 w-4 animate-spin" />, "Menunggu konfirmasi wallet…", "text-muted-foreground"],
    submitted: [<Loader2 key="i" className="h-4 w-4 animate-spin" />, "Transaction Pending (terkirim ke Sepolia)", "text-accent"],
    confirmed: [<CheckCircle2 key="i" className="h-4 w-4" />, "Transaction Confirmed", "text-primary"],
    failed: [<XCircle key="i" className="h-4 w-4" />, `Transaction Failed${tx.err ? ` — ${tx.err}` : ""}`, "text-destructive"],
  } as const;
  const [icon, label, cls] = map[tx.state];
  return (
    <div className={`mt-3 text-xs font-mono space-y-1 ${cls}`}>
      <div className="inline-flex items-center gap-1.5">{icon} {label}</div>
      {tx.hash && (
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <span className="break-all">{tx.hash}</span>
          <a href={explorerTx(tx.hash)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
            Lihat di Sepolia Etherscan <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}

const Escrow = () => {
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync, isPending: switching } = useSwitchChain();
  const wrongNetwork = isConnected && chainId !== CONTRACT_CHAIN_ID;
  const canWrite = !!ESCROW_ADDRESS && isConnected && !wrongNetwork;
  const base = { address: ESCROW_ADDRESS!, abi: escrowAbi, chainId: CONTRACT_CHAIN_ID } as const;

  const count = useReadContract({ ...base, functionName: "projectCount", query: { enabled: !!ESCROW_ADDRESS } });
  const [pid, setPid] = useState("1");
  const pidN = BigInt(/^\d+$/.test(pid) ? pid : "0");
  const project = useReadContract({ ...base, functionName: "getProject", args: [pidN], query: { enabled: !!ESCROW_ADDRESS && pidN > 0n } });
  const contribution = useReadContract({ ...base, functionName: "getInvestorContribution", args: [pidN, address!], query: { enabled: !!ESCROW_ADDRESS && !!address && pidN > 0n } });
  const verifierRole = useReadContract({ ...base, functionName: "VERIFIER_ROLE", query: { enabled: !!ESCROW_ADDRESS } });
  const isVerifier = useReadContract({ ...base, functionName: "hasRole", args: [verifierRole.data!, address!], query: { enabled: !!verifierRole.data && !!address } });
  const mCount = project.data ? Number(project.data.milestoneCount) : 0;
  const milestones = useReadContracts({
    contracts: Array.from({ length: mCount }, (_, i) => ({ ...base, functionName: "getMilestone", args: [pidN, BigInt(i)] }) as const),
    query: { enabled: mCount > 0 },
  });

  const refresh = () => { count.refetch(); project.refetch(); contribution.refetch(); milestones.refetch(); };

  // create
  const [target, setTarget] = useState("0.01");
  const [bps, setBps] = useState("30,30,40");
  const [days, setDays] = useState("7");
  const [meta, setMeta] = useState("");
  const createTx = useTx(refresh);
  const onCreate = () => {
    const parts = bps.split(",").map((s) => Math.round(Number(s.trim()) * 100));
    const sum = parts.reduce((a, b) => a + b, 0);
    if (parts.some((p) => !Number.isFinite(p) || p <= 0) || sum !== 10000) return toast.error("Alokasi milestone harus berjumlah tepat 100%.");
    let t: bigint; try { t = parseEther(target); } catch { return toast.error("Target dana tidak valid."); }
    if (t <= 0n) return toast.error("Target dana harus > 0.");
    const d = Number(days); if (!(d >= 1 && d <= 365)) return toast.error("Durasi 1–365 hari.");
    createTx.send({ ...base, functionName: "createProject", args: [t, parts, BigInt(Math.round(d * 86400)), meta.slice(0, 256)] });
  };

  // fund
  const [amount, setAmount] = useState("0.001");
  const fundTx = useTx(refresh);
  const onFund = () => {
    let v: bigint; try { v = parseEther(amount); } catch { return toast.error("Jumlah tidak valid."); }
    if (v <= 0n) return toast.error("Jumlah harus > 0.");
    fundTx.send({ ...base, functionName: "fundProject", args: [pidN], value: v });
  };

  // milestone actions
  const [evidence, setEvidence] = useState<Record<number, string>>({});
  const msTx = useTx(refresh);
  const refundTx = useTx(refresh);

  const p = project.data;
  const isOwner = !!p && !!address && p.owner.toLowerCase() === address.toLowerCase();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/explore" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Marketplace
          </Link>
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-accent/15 text-accent">Sepolia Testnet · Token Uji</span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-6 max-w-5xl">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Escrow Milestone On-Chain</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Simulasi Lingkungan Testnet: dana investor (SepoliaETH, token uji tanpa nilai nyata) ditahan smart contract dan
            hanya dicairkan per milestone setelah bukti disetujui verifier.
          </p>
        </div>

        {/* Status bar */}
        <div className={`${card} flex flex-wrap items-center gap-3 text-sm`}>
          {!ESCROW_ADDRESS ? (
            <span className="inline-flex items-center gap-2 text-accent"><AlertTriangle className="h-4 w-4" /> Kontrak belum dideploy — alamat VITE_ESCROW_CONTRACT_ADDRESS belum diatur.</span>
          ) : (
            <a href={explorerAddress(ESCROW_ADDRESS)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-mono text-primary hover:underline">
              <ShieldCheck className="h-4 w-4" /> Kontrak {shortAddr(ESCROW_ADDRESS)} <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <span className="text-muted-foreground">·</span>
          {!isConnected ? (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Wallet className="h-4 w-4" /> Wallet belum terhubung (pakai tombol Connect Wallet di beranda)</span>
          ) : wrongNetwork ? (
            <span className="inline-flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" /> Wrong Network
              <button disabled={switching} onClick={() => switchChainAsync({ chainId: CONTRACT_CHAIN_ID }).catch((e) => toast.error(friendlyWalletError(e)))} className={btn}>
                Pindah ke Sepolia
              </button>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-primary"><CheckCircle2 className="h-4 w-4" /> Wallet Connected · {shortAddr(address!)}{isVerifier.data ? " · Verifier" : ""}</span>
          )}
          {ESROW_COUNT(count.data)}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create */}
          <div className={card}>
            <h2 className="font-display font-bold text-lg mb-4">1. Buat Project (UMKM)</h2>
            <div className="space-y-3 text-sm">
              <label className="block">Target dana (SepoliaETH)<input className={input} value={target} onChange={(e) => setTarget(e.target.value)} /></label>
              <label className="block">Alokasi milestone (%) dipisah koma, total 100<input className={input} value={bps} onChange={(e) => setBps(e.target.value)} /></label>
              <label className="block">Durasi pendanaan (hari)<input className={input} value={days} onChange={(e) => setDays(e.target.value)} /></label>
              <label className="block">Nama / metadata singkat (tanpa data pribadi)<input className={input} maxLength={256} value={meta} onChange={(e) => setMeta(e.target.value)} /></label>
              <button disabled={!canWrite || createTx.state === "wallet" || createTx.state === "submitted"} onClick={onCreate} className={btn}>createProject</button>
            </div>
            <TxStatus tx={createTx} />
          </div>

          {/* Read + fund */}
          <div className={card}>
            <h2 className="font-display font-bold text-lg mb-4">2. Lihat & Danai Project (Investor)</h2>
            <label className="block text-sm mb-3">Project ID<input className={input} value={pid} onChange={(e) => setPid(e.target.value)} /></label>
            {project.isLoading && <p className="text-xs text-muted-foreground">Membaca kontrak…</p>}
            {project.isError && <p className="text-xs text-destructive">Project tidak ditemukan di kontrak.</p>}
            {p && (
              <div className="space-y-1.5 text-xs font-mono mb-4">
                <div>Status: <b>{PROJECT_STATUS[p.status]}</b></div>
                <div>Pemilik: {shortAddr(p.owner)}{isOwner && " (Anda)"}</div>
                <div>Terkumpul: {formatEther(p.raisedAmount)} / {formatEther(p.targetAmount)} SepoliaETH</div>
                <div>Dicairkan: {formatEther(p.releasedAmount)} · Refund: {formatEther(p.refundedAmount)}</div>
                <div>Deadline: {new Date(Number(p.deadline) * 1000).toLocaleString("id-ID")}</div>
                {p.metadataURI && <div>Metadata: {p.metadataURI}</div>}
                {address && <div>Kontribusi Anda: {contribution.data !== undefined ? formatEther(contribution.data) : "…"} SepoliaETH</div>}
              </div>
            )}
            <div className="flex gap-2">
              <input className={input} value={amount} onChange={(e) => setAmount(e.target.value)} />
              <button disabled={!canWrite || !p || fundTx.state === "wallet" || fundTx.state === "submitted"} onClick={onFund} className={btn}>fundProject</button>
            </div>
            <TxStatus tx={fundTx} />
            {p && (p.status === 3 || (p.status === 0 && Date.now() / 1000 > Number(p.deadline))) && (contribution.data ?? 0n) > 0n && (
              <>
                <button disabled={!canWrite} onClick={() => refundTx.send({ ...base, functionName: "claimRefund", args: [pidN] })} className={`${btn} mt-3`}>claimRefund</button>
                <TxStatus tx={refundTx} />
              </>
            )}
          </div>
        </div>

        {/* Milestones */}
        {p && (
          <div className={card}>
            <h2 className="font-display font-bold text-lg mb-4">3. Milestone (bukti → approval verifier → pencairan)</h2>
            <div className="space-y-3">
              {milestones.data?.map((r, i) => {
                const m = r.result as { percentageBps: number; status: number; evidenceHash: string; approvedBy: string; releasedAmount: bigint; released: boolean } | undefined;
                if (!m) return null;
                return (
                  <div key={i} className="p-4 rounded-xl bg-background/40 border border-border text-xs font-mono space-y-2">
                    <div className="flex flex-wrap justify-between gap-2">
                      <b>Milestone #{i} · {m.percentageBps / 100}%</b>
                      <span className="text-primary">{MILESTONE_STATUS[m.status]}</span>
                    </div>
                    {m.evidenceHash !== "0x" + "0".repeat(64) && <div className="break-all text-muted-foreground">Evidence hash: {m.evidenceHash}</div>}
                    {m.released && <div>Dicairkan: {formatEther(m.releasedAmount)} SepoliaETH</div>}
                    <div className="flex flex-wrap gap-2">
                      {isOwner && p.status === 1 && m.status <= 1 && (
                        <>
                          <input className={`${input} flex-1 min-w-[180px]`} placeholder="Link/ID bukti off-chain (akan di-hash)" value={evidence[i] ?? ""} onChange={(e) => setEvidence({ ...evidence, [i]: e.target.value })} />
                          <button disabled={!canWrite || !(evidence[i] ?? "").trim()} className={btn}
                            onClick={() => msTx.send({ ...base, functionName: "submitMilestoneEvidence", args: [pidN, BigInt(i), keccak256(toBytes(evidence[i].trim()))] })}>
                            Submit bukti
                          </button>
                        </>
                      )}
                      {isVerifier.data && p.status === 1 && m.status === 1 && (
                        <button disabled={!canWrite} className={btn} onClick={() => msTx.send({ ...base, functionName: "approveMilestone", args: [pidN, BigInt(i)] })}>Approve (Verifier)</button>
                      )}
                      {(isOwner || isVerifier.data) && p.status === 1 && m.status === 2 && (
                        <button disabled={!canWrite} className={btn} onClick={() => msTx.send({ ...base, functionName: "releaseMilestone", args: [pidN, BigInt(i)] })}>Release dana</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <TxStatus tx={msTx} />
            {p.status === 0 && <p className="text-xs text-muted-foreground mt-3">Bukti milestone bisa dikirim setelah project terdanai penuh (status Funded).</p>}
          </div>
        )}
      </main>
    </div>
  );
};

const ESROW_COUNT = (n?: bigint) =>
  n === undefined ? null : <span className="ml-auto text-xs font-mono text-muted-foreground">Total project on-chain: {n.toString()}</span>;

export default Escrow;
