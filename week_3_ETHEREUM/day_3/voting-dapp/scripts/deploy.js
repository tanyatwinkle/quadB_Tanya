const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const Voting = await hre.ethers.getContractFactory("SecureVoting");
  const voting = await Voting.deploy(1440);
  
  console.log("Contract deployed to:", await voting.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
