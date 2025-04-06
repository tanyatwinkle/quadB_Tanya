const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken Contract", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the contract before each test
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy(1000000); // Deploy with an initial supply of 1 million tokens
    await token.waitForDeployment();
  });

  it("Should set the correct name and symbol", async function () {
    expect(await token.name()).to.equal("MyToken");
    expect(await token.symbol()).to.equal("MYT");
  });

  it("Should assign the total supply to the owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    // Transfer tokens from owner to addr1
    await token.transfer(addr1.address, 100);
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(100);

    // Transfer tokens from addr1 to addr2
    await token.connect(addr1).transfer(addr2.address, 50);
    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(50);
  });

  it("Should fail if sender doesn’t have enough tokens", async function () {
    const initialOwnerBalance = await token.balanceOf(owner.address);

    // Try to transfer more tokens than available in addr1's balance
    await expect(
      token.connect(addr1).transfer(owner.address, 100)
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");

    // Owner's balance shouldn't change
    expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });

  it("Should update balances after transfers", async function () {
    const initialOwnerBalance = await token.balanceOf(owner.address);

    // Transfer tokens from owner to addr1
    await token.transfer(addr1.address, 100);

    // Transfer tokens from owner to addr2
    await token.transfer(addr2.address, 50);

    // Check balances
    const finalOwnerBalance = await token.balanceOf(owner.address);
    expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150n);

    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(100n);

    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(50n);
  });
});
