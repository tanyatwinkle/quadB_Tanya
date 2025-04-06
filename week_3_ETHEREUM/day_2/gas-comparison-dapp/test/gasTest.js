const { expect } = require("chai");

describe("Gas Comparison", function () {
  let contract;

  beforeEach(async () => {
    const GasComparator = await ethers.getContractFactory("GasComparator");
    contract = await GasComparator.deploy();
  });

  it("Should compare gas costs", async () => {
    const simpleTx = await contract.simpleTransaction(42);
    const simpleReceipt = await simpleTx.wait();
    
    const complexTx = await contract.complexTransaction(10);
    const complexReceipt = await complexTx.wait();

    console.log("Simple Tx Gas Used:", simpleReceipt.gasUsed.toString());
    console.log("Complex Tx Gas Used:", complexReceipt.gasUsed.toString());
    
    expect(simpleReceipt.gasUsed).to.be.lessThan(complexReceipt.gasUsed);
  });
});
