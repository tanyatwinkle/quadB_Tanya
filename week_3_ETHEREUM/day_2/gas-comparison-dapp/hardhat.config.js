// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      ens: false // Disable ENS resolution
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    token: 'ETH',
    gasPrice: 21
  }
};
