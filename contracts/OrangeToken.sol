// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract OrangeToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint) balances;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 totalSupply_
    ) {
        name = name_;
        symbol = symbol_;
        decimals = decimals_;
        totalSupply = totalSupply_;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        balances[_to] += _value;
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
}
