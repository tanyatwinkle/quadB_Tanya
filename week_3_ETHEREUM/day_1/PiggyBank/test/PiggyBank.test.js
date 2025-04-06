const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PiggyBank Contract", function () {
  let PiggyBank, piggyBank;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    PiggyBank = await ethers.getContractFactory("PiggyBank");
    piggyBank = await PiggyBank.deploy(ethers.parseEther("5"));
  });

  it("Should deploy with correct initial values", async () => {
    expect(await piggyBank.owner()).to.equal(owner.address);
    expect(await piggyBank.savingsGoal()).to.equal(ethers.parseEther("5"));
    expect(await piggyBank.totalDeposits()).to.equal(0);
  });

  it("Should allow the owner to deposit funds", async () => {
    await piggyBank.deposit({ value: ethers.parseEther("2") });
    expect(await piggyBank.totalDeposits()).to.equal(ethers.parseEther("2"));
    expect(await piggyBank.getBalance()).to.equal(ethers.parseEther("2"));
  });

  it("Should not allow withdrawals before reaching the savings goal", async () => {
    await piggyBank.deposit({ value: ethers.parseEther("2") });
    await expect(piggyBank.withdraw()).to.be.revertedWith("Savings goal not reached");
  });

  it("Should allow withdrawals after reaching the savings goal", async () => {
    await piggyBank.deposit({ value: ethers.parseEther("5") });
    const provider = ethers.provider;
    const initialOwnerBalance = await provider.getBalance(owner.address);

    const tx = await piggyBank.withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    const finalOwnerBalance = await provider.getBalance(owner.address);
    
    // Calculate expected balance with gas consideration
    const expectedBalance = initialOwnerBalance + ethers.parseEther("5") - gasUsed;
    
    // Use closeTo with BigInt-safe comparison
    const tolerance = ethers.parseEther("0.001");
    expect(finalOwnerBalance).to.be.within(
      expectedBalance - tolerance,
      expectedBalance + tolerance
    );
  });

  it("Should not allow non-owners to deposit or withdraw", async () => {
    const [_, otherAccount] = await ethers.getSigners();

    await expect(piggyBank.connect(otherAccount).deposit({ value: ethers.parseEther("1") }))
      .to.be.revertedWith("Not the owner");

    await piggyBank.deposit({ value: ethers.parseEther("5") });
    await expect(piggyBank.connect(otherAccount).withdraw())
      .to.be.revertedWith("Not the owner");
  });
});
