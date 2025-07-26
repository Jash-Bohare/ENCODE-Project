// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CustomNFT is ERC721URIStorage, Ownable(msg.sender) {
    IERC20 public encodeToken;
    uint256 public tokenCounter;
    uint256 public constant MINT_PRICE = 20 * 10 ** 18; // 20 ENCD (18 decimals)

    constructor(address _encodeTokenAddress) ERC721("Encode Custom NFT", "ECNFT") {
        encodeToken = IERC20(_encodeTokenAddress);
        tokenCounter = 0;
    }

    function mintNFT(string memory tokenURI) public {
        // Burn 20 ENCD from sender
        bool success = encodeToken.transferFrom(msg.sender, address(this), MINT_PRICE);
        require(success, "Token transfer failed");

        // Mint NFT
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter++;
    }

    // Allow owner to withdraw burned tokens if needed
    function withdrawTokens() external onlyOwner {
        uint256 balance = encodeToken.balanceOf(address(this));
        encodeToken.transfer(owner(), balance);
    }
}
