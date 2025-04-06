// test/storage.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StorageVsMemory Contract", function () {
  let contract;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const StorageVsMemory = await ethers.getContractFactory("StorageVsMemory");
    contract = await StorageVsMemory.deploy();
  });

  it("Should initialize with empty storedText", async () => {
    expect(await contract.storedText()).to.equal("");
  });

  it("Should return temporary text without modifying storage (memory)", async () => {
    const testText = "Memory Test";
    const result = await contract.updateWithMemory.staticCall(testText);
    
    expect(result).to.equal(testText);
    expect(await contract.storedText()).to.equal("");
  });

  it("Should permanently store new text (storage)", async () => {
    const testText = "Storage Test";
    await contract.updateWithStorage(testText);
    
    expect(await contract.storedText()).to.equal(testText);
  });

  // Modify gas comparison test
it("Should show gas difference between memory and storage", async function () {
  // Memory operation (static call)
  const memGas = await contract.updateWithMemory.estimateGas("test");
  
  // Storage operation
  const storageTx = await contract.updateWithStorage("test");
  const storageReceipt = await storageTx.wait();
  const storageGas = storageReceipt.gasUsed;

  console.log(`
    Gas Consumption Comparison:
    Memory Operation: ${memGas}
    Storage Operation: ${storageGas}
    Difference: ${storageGas - memGas}
  `);

  expect(memGas).to.be.lessThan(storageGas);
});

// Update long text test
it("Should handle long text inputs efficiently", async function () {
  const longText = "Lorem ipsum ".repeat(100);
  
  // Memory test
  const memGas = await contract.updateWithMemory.estimateGas(longText);

  // Storage test
  const storageTx = await contract.updateWithStorage(longText);
  const storageReceipt = await storageTx.wait();

  expect(storageReceipt.gasUsed).to.be.greaterThan(memGas);
});
});
