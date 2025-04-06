export const CONTRACT_ADDRESS = "0x48D9a9DDbeA9716263c57A4e2E3E819F68307363";

export const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "_newValue", "type": "uint256" }],
    "name": "updateValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "value",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newValue", "type": "uint256" }],
    "name": "ValueUpdated",
    "type": "event"
  }
];
