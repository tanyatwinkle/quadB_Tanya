// test/secure.test.js
const { expect } = require("chai");

describe("SecureVault Security Test", function () {
    let vault, attacker, owner;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();
        const Vault = await ethers.getContractFactory("SecureVault");
        vault = await Vault.deploy();
        const Attacker = await ethers.getContractFactory("MaliciousAttacker");
        attacker = await Attacker.deploy(await vault.getAddress());
    });

    it("Should protect funds from reentrancy", async () => {
        // Owner deposits 1 ETH
        await vault.deposit({ value: ethers.parseEther("1") });

        // Attempt attack (should revert)
        await expect(
            attacker.attack({ value: ethers.parseEther("1") })
        ).to.be.reverted;

        // Verify vault balance remains intact
        const finalBalance = await vault.getBalance();
        expect(finalBalance).to.equal(ethers.parseEther("1")); // Owner's original 1 ETH
    });
});
