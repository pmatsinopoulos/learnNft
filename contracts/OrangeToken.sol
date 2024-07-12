// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract OrangeToken {
    string private _name;

    constructor(string memory name_) {
        _name = name_;
    }

    function name() public view returns (string memory) {
        return _name;
    }
}
