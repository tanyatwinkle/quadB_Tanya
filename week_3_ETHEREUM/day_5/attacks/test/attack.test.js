const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy Attack Simulation", function () {
    let vulnerable, attacker, owner;
    let vulnerableAddress, attackerAddress;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        // Deploy contracts
        const Vulnerable = await ethers.getContractFactory("VulnerableContract");
        vulnerable = await Vulnerable.deploy();
        vulnerableAddress = await vulnerable.getAddress();

        const Attacker = await ethers.getContractFactory("AttackerContract");
        attacker = await Attacker.deploy(vulnerableAddress);
        attackerAddress = await attacker.getAddress();
    });

    it("Should demonstrate complete fund drainage", async function () {
        // Log initial balances
        console.log("\n[Initial Balances]");
        const initialVulnerableBalance = await ethers.provider.getBalance(vulnerableAddress);
        const initialAttackerBalance = await ethers.provider.getBalance(attackerAddress);
        
        console.log(`Vulnerable Contract: ${ethers.formatEther(initialVulnerableBalance)} ETH`);
        console.log(`Attacker Contract:   ${ethers.formatEther(initialAttackerBalance)} ETH`);

        // Deposit 1 ETH to vulnerable contract
        const depositTx = await vulnerable.deposit({
            value: ethers.parseEther("1")
        });
        await depositTx.wait();

        console.log("\n[After Deposit]");
        const postDepositBalance = await ethers.provider.getBalance(vulnerableAddress);
        console.log(`Vulnerable Contract: ${ethers.formatEther(postDepositBalance)} ETH`);

        // Execute attack
        const attackTx = await attacker.attack({
            value: ethers.parseEther("1")
        });
        await attackTx.wait();

        // Get final balances
        console.log("\n[Final Balances]");
        const finalVulnerableBalance = await ethers.provider.getBalance(vulnerableAddress);
        const finalAttackerBalance = await ethers.provider.getBalance(attackerAddress);
        
        console.log(`Vulnerable Contract: ${ethers.formatEther(finalVulnerableBalance)} ETH`);
        console.log(`Attacker Contract:   ${ethers.formatEther(finalAttackerBalance)} ETH`);

        // Verify balances
        expect(finalVulnerableBalance).to.equal(0);
        expect(finalAttackerBalance).to.equal(ethers.parseEther("2"));
    });
});
