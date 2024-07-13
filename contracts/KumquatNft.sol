// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// import "@openzeppelin/contracts/utils/Counters.sol";

contract KumquatNft is ERC721 {
    uint256 private _nextTokenId;

    constructor() public ERC721("KumquatNft", "KMQ") {}

    function awardItem(
        address _to,
        string memory tokenURI
    ) external returns (uint256) {
        // _tokenIds.increment();

        // uint256 newItemId = _tokenIds.current();
        // _mint(_to, newItemId);
        // _setTokenURI(newItemId, tokenURI);

        // return newItemId;
        return 0;
    }
}
