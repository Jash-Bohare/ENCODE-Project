const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from address:", deployer.address);

  const Token = await hre.ethers.getContractFactory("EncodeToken");
  const token = await Token.deploy();

  await token.waitForDeployment();
  const addr = await token.getAddress();
  console.log("ENCODE Token deployed to:", addr);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
