// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AdvancedDapp {
    uint256 public value;
    event ValueUpdated(uint256 newValue);

    function updateValue(uint256 _newValue) public {
        value = _newValue;
        emit ValueUpdated(_newValue);
    }
}
