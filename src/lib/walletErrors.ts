export function friendlyWalletError(err: unknown, walletName: string): string {
  const e = err as { name?: string; message?: string; shortMessage?: string; code?: number };
  const text = `${e?.name ?? ""} ${e?.shortMessage ?? ""} ${e?.message ?? ""}`.toLowerCase();
  if (e?.code === 4001 || text.includes("rejected") || text.includes("denied") || text.includes("user closed") || text.includes("cancel"))
    return "Koneksi dibatalkan atau ditolak di wallet.";
  if (text.includes("provider not found") || text.includes("providernotfound") || text.includes("not installed"))
    return `${walletName} tidak ditemukan di browser ini. Pasang ekstensinya terlebih dahulu.`;
  if (e?.code === -32002 || text.includes("already pending"))
    return `Permintaan koneksi sudah terbuka. Buka ${walletName} untuk menyetujuinya.`;
  if (text.includes("already connected")) return "Wallet sudah terhubung.";
  if (text.includes("chain") && text.includes("not configured")) return "Network wallet tidak didukung.";
  return `Gagal menghubungkan ${walletName}. Silakan coba lagi.`;
}

export const shortAddr = (a?: string) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "");
