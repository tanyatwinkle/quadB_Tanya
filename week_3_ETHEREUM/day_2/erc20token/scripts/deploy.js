async function main() {
    const [deployer] = await ethers.getSigners();
    
    // Deployment Details
    console.log("🔨 Deployment Started");
    console.log("=====================");
    console.log("💼 Deployer Address:", deployer.address);
    console.log("⛽ Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  
    // Contract Deployment
    const initialSupply = 1000000;
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
  
    // Contract Verification
    console.log("\n✅ Deployment Successful");
    console.log("========================");
    console.log("📜 Contract Address:", await token.getAddress());
    console.log("🌐 Token Details:");
    console.log("   - Name:", await token.name());
    console.log("   - Symbol:", await token.symbol());
    console.log("   - Decimals:", await token.decimals());
    
    // Supply Details
    const rawSupply = await token.totalSupply();
    console.log("\n💰 Supply Details:");
    console.log("   - Raw Supply:", rawSupply.toString());
    console.log("   - Formatted Supply:", ethers.formatUnits(rawSupply, await token.decimals()), "MYT");
  
    // Deployer Balance
    const deployerBalance = await token.balanceOf(deployer.address);
    console.log("\n🏦 Deployer Token Balance:", 
      ethers.formatUnits(deployerBalance, await token.decimals()), "MYT");
  }
  
  main().catch((error) => {
    console.error("🚨 Deployment Failed:", error);
    process.exitCode = 1;
  });
  