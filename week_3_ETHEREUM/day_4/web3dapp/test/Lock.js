const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AdvancedDapp", function () {
  let advancedDapp;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    // Deploy contract without .deployed() call
    const AdvancedDapp = await ethers.getContractFactory("AdvancedDapp");
    advancedDapp = await AdvancedDapp.deploy();
  });

  it("should update the value", async function () {
    await advancedDapp.connect(owner).updateValue(42);
    expect(await advancedDapp.value()).to.equal(42);
  });

  it("should emit ValueUpdated event", async function () {
    await expect(advancedDapp.connect(owner).updateValue(42))
      .to.emit(advancedDapp, "ValueUpdated")
      .withArgs(42);
  });
});
