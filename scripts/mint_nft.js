const { ethers } = require("hardhat");

async function main() {
  const ENCD_TOKEN_ADDRESS = "0x0e1beeddb51cC592Be02Dba3bcE308d36b4d3D2b"; // Correct ENCD token contract address
  const NFT_CONTRACT_ADDRESS = "0x585BD798711821956AD38D30511A22c9a5076f74"; // NFT contract address
  const MINT_PRICE = ethers.parseEther("20"); // 20 ENCD with 18 decimals

  const [signer] = await ethers.getSigners();
  const walletAddress = await signer.getAddress();
  console.log("Using wallet:", walletAddress);

  // Load ENCD token and NFT contracts
  const encdToken = await ethers.getContractAt("IERC20", ENCD_TOKEN_ADDRESS, signer);
  const nftContract = await ethers.getContractAt("CustomNFT", NFT_CONTRACT_ADDRESS, signer);

  // Debug: Check ENCD balance and allowance
  const balance = await encdToken.balanceOf(walletAddress);
  console.log("ENCD Balance:", ethers.formatEther(balance));
  const allowance = await encdToken.allowance(walletAddress, NFT_CONTRACT_ADDRESS);
  console.log("ENCD Allowance:", ethers.formatEther(allowance));

  // Step 1: Approve NFT contract to spend 20 ENCD
  const approveTx = await encdToken.approve(NFT_CONTRACT_ADDRESS, MINT_PRICE);
  console.log("Approving 20 ENCD... tx:", approveTx.hash);
  await approveTx.wait();
  console.log("✅ Approved!");

  // Step 2: Mint the NFT
  const tokenURI = "ipfs://bafkreica7lpfc4ldjk3ankk6cafm44sttprwh2pythgpi4w5lgkv4qvmsi"; // Metadata JSON CID
  const mintTx = await nftContract.mintNFT(tokenURI);
  console.log("Minting NFT... tx:", mintTx.hash);
  const receipt = await mintTx.wait();
  console.log("✅ NFT minted! Transaction Hash:", receipt.transactionHash);
}

main().catch((error) => {
  console.error("❌ Error during NFT minting:", error);
  process.exit(1);
});
