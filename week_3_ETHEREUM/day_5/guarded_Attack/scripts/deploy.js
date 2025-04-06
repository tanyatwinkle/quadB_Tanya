const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with account:", deployer.address);
    console.log(
        "Account balance:",
        ethers.formatEther(await deployer.provider.getBalance(deployer.address)), 
        "ETH"
    );

    // Deploy Vulnerable Contract (New Syntax)
    const vulnerable = await ethers.deployContract("VulnerableContract");
    await vulnerable.waitForDeployment();
    console.log("VulnerableContract deployed to:", await vulnerable.getAddress());

    // Deploy Attacker Contract
    const attacker = await ethers.deployContract("MaliciousAttacker", [
        await vulnerable.getAddress()
    ]);
    await attacker.waitForDeployment();
    console.log("AttackerContract deployed to:", await attacker.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
