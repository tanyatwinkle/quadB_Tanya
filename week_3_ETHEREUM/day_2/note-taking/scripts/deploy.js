// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const StorageVsMemory = await ethers.getContractFactory("StorageVsMemory");
  const contract = await StorageVsMemory.deploy();
  
  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
