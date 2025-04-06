// scripts/deploy.js
async function main() {
  const GasComparator = await ethers.getContractFactory("GasComparator");
  const gasComparator = await GasComparator.deploy();
  
  await gasComparator.waitForDeployment();
  console.log("Contract deployed to:", await gasComparator.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
