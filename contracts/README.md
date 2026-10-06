# EduChain UMKM — Smart Contracts (WP1, Sepolia Testnet only)

- `EscrowMilestone.sol` — escrow crowdfunding per milestone (create, fund, evidence hash, verifier approve, release, cancel, refund, pause).
- `TrustRegistry.sol` — registry hash Trust Score & sertifikat edukasi (fondasi WP2/WP3, tanpa data pribadi).

## Test, coverage, Slither
```bash
cd contracts
npm install --legacy-peer-deps
npx hardhat test          # 33 passing
npx hardhat coverage      # stmts 100%, branch 92.86%, funcs 100%, lines 100%
npx hardhat clean && npx hardhat compile && slither . --hardhat-ignore-compile --filter-paths "node_modules|contracts/test"
```

## Deploy ke Sepolia (di komputer Anda sendiri)
1. Siapkan wallet KHUSUS deploy berisi SepoliaETH dari faucet (jangan wallet utama).
2. Set environment HANYA di terminal lokal (jangan commit, jangan pakai awalan VITE_):
   ```bash
   export DEPLOYER_PRIVATE_KEY=0x...      # jangan pernah dibagikan
   export SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
   export VERIFIER_ADDRESS=0x...          # opsional, default = deployer
   ```
3. `npm run deploy:sepolia` — script menolak jaringan selain Sepolia.
4. Salin output `VITE_ESCROW_CONTRACT_ADDRESS` dan `VITE_TRUST_REGISTRY_ADDRESS` ke pengaturan aplikasi.
