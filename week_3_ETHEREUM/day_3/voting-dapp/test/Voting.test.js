const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("SecureVoting", function () {
  let voting;
  let owner, voter;

  beforeEach(async () => {
    [owner, voter] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("SecureVoting");
    voting = await Voting.deploy();
  });

  it("Should create proposal and vote", async () => {
    await voting.connect(owner).createProposal(
      "Test Proposal",
      "Test Description",
      ["Option 1", "Option 2"],
      60
    );

    await voting.connect(voter).vote(0, "Option 1");
    const [options, votes] = await voting.getResults(0);
    
    expect(votes[0]).to.equal(1);
  });

  it("Should prevent double voting", async () => {
    await voting.connect(owner).createProposal("Test", "Desc", ["A", "B"], 60);
    await voting.connect(voter).vote(0, "A");
    await expect(voting.connect(voter).vote(0, "B")).to.be.revertedWith("Already voted");
  });
});
