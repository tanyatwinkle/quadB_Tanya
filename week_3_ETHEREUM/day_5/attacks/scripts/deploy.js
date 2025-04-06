const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying from account:", deployer.address);

    // Deploy VulnerableContract using new syntax
    const Vulnerable = await ethers.deployContract("VulnerableContract");
    await Vulnerable.waitForDeployment();
    console.log("VulnerableContract address:", await Vulnerable.getAddress());

    // Deploy AttackerContract with updated syntax
    const Attacker = await ethers.deployContract("AttackerContract", [
        await Vulnerable.getAddress()
    ]);
    await Attacker.waitForDeployment();
    console.log("AttackerContract address:", await Attacker.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
