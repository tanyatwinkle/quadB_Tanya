// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StorageVsMemory {
    string public storedText;

    function updateWithMemory(string memory newText) public pure returns (string memory) {
        string memory tempText = newText;
        return tempText;
    }

    function updateWithStorage(string calldata newText) public {
        storedText = newText;
    }
}
