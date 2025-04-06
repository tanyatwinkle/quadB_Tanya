const hre = require("hardhat");

async function main() {
  // Deploy contract using new syntax
  const AdvancedDapp = await hre.ethers.deployContract("AdvancedDapp");
  
  // Wait for deployment confirmation
  await AdvancedDapp.waitForDeployment();

  // Get deployment address
  console.log("Contract deployed to:", await AdvancedDapp.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
