// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract OrangeToken {
    string public name;
    string public symbol;
    uint8 public decimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) {
        name = name_;
        symbol = symbol_;
        decimals = decimals_;
    }
}
