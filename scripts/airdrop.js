const { Contract, JsonRpcProvider, Wallet, parseUnits } = require("ethers");
const fs = require("fs");
require("dotenv").config();

const walletList = require("../airdrop/wallets.json");
const abi = require("../artifacts/contracts/EncodeToken.sol/EncodeToken.json").abi;
const CONTRACT_ADDRESS = "0x0e1beeddb51cC592Be02Dba3bcE308d36b4d3D2b";

const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
const contract = new Contract(CONTRACT_ADDRESS, abi, wallet);

// CSV header
let log = "wallet,address,amount,status,error\n";

async function main() {
  console.log(`🚀 Airdropping from: ${wallet.address}`);

  for (let i = 0; i < walletList.length; i++) {
    const { address, amount } = walletList[i];

    if (!address || !amount) {
      const row = `${i + 1},INVALID,0,skipped,invalid entry\n`;
      log += row;
      console.log(`⚠️ Skipped invalid entry: ${JSON.stringify(walletList[i])}`);
      continue;
    }

    try {
      const tx = await contract.transfer(address, parseUnits(amount.toString(), 18));
      await tx.wait();
      console.log(`✅ Sent ${amount} ENCD to ${address}`);
      log += `${i + 1},${address},${amount},success,\n`;
    } catch (err) {
      console.error(`❌ Failed for ${address}: ${err.message}`);
      log += `${i + 1},${address},${amount},failed,${err.message.replace(/,/g, ";")}\n`;
    }
  }

  fs.writeFileSync("airdrop-log.csv", log);
  console.log("📝 Log written to airdrop-log.csv");
  console.log("🎯 Airdrop completed.");
}

main().catch((err) => {
  console.error("💥 Script crashed:", err);
});
