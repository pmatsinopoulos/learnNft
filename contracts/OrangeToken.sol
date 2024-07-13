// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract OrangeToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    address private owner;

    mapping(address => uint) balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

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
        balances[msg.sender] = totalSupply;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(
            balances[msg.sender] >= _value,
            "caller does not have enough tokens to transfer"
        );

        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        success = true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        balance = balances[_owner];
    }
}
