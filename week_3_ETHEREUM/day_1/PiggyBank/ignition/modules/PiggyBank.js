const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PiggyBankModule", (m) => {
  const savingsGoal = ethers.parseEther("5"); // Set savings goal to 5 ETH
  const piggyBank = m.contract("PiggyBank", [savingsGoal]);

  return { piggyBank };
});
