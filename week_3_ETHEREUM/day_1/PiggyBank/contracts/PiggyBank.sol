// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PiggyBank {
    address public owner;
    uint256 public savingsGoal;
    uint256 public totalDeposits;

    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed receiver, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier goalReached() {
        require(totalDeposits >= savingsGoal, "Savings goal not reached");
        _;
    }

    constructor(uint256 _savingsGoal) {
        require(_savingsGoal > 0, "Savings goal must be greater than zero");
        owner = msg.sender;
        savingsGoal = _savingsGoal;
    }

    function deposit() external payable onlyOwner {
        require(msg.value > 0, "Deposit must be greater than zero");
        totalDeposits += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner goalReached {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        payable(owner).transfer(balance);
        emit Withdrawn(owner, balance);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function hasReachedGoal() external view returns (bool) {
        return totalDeposits >= savingsGoal;
    }
}
