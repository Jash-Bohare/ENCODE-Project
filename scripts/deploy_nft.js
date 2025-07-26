const hre = require("hardhat");

async function main() {
  const ENCD_TOKEN_ADDRESS = "0x0e1beeddb51cC592Be02Dba3bcE308d36b4d3D2b"; // replace if different

  const NFT = await hre.ethers.getContractFactory("CustomNFT");
  const nft = await NFT.deploy(ENCD_TOKEN_ADDRESS);

  await nft.waitForDeployment();

  console.log("✅ CustomNFT deployed at:", await nft.getAddress());
}

main().catch((error) => {
  console.error("❌ Error in deployment:", error);
  process.exitCode = 1;
});
