// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract OrangeToken {
    string public name;
    string public symbol;

    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
    }
}
