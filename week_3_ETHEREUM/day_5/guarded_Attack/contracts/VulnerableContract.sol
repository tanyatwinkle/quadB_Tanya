// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VulnerableContract {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABLE WITHDRAW FUNCTION
    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        (bool success, ) = msg.sender.call{value: _amount}(""); // UNSAFE external call
        require(success, "Transfer failed");
        balances[msg.sender] -= _amount; // State update AFTER external call
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
