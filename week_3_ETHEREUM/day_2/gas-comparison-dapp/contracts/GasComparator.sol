// contracts/GasComparator.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GasComparator {
    uint256 public simpleValue;
    uint256[] public complexArray;

    event GasUsed(uint256 indexed transactionId, uint256 gasUsed);

    // Simple transaction (low gas)
    function simpleTransaction(uint256 _value) external {
        uint256 startGas = gasleft();
        simpleValue = _value;
        emit GasUsed(1, startGas - gasleft());
    }

    // Complex transaction (high gas)
    function complexTransaction(uint256 _count) external {
        uint256 startGas = gasleft();
        for(uint256 i = 0; i < _count; i++) {
            complexArray.push(i);
        }
        emit GasUsed(2, startGas - gasleft());
    }
}
