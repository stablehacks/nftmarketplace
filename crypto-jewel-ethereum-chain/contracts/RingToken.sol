//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/utils/Counters.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";
import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RingToken is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("RingToken", "RNT") {}

function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/QmZHUb7djULs2xwGYiK14L4VrTe2Tt6bdU1nw327ZDQnkM";
    }
    
      function claim(uint256 tokenId) public {
        require(tokenId > 0 && tokenId < 5000, "Exceeds token supply");
        _safeMint(_msgSender(), tokenId);
}

    function mint(uint256 tokenId) public payable {
    require(tokenId > 0 && tokenId < 5000, "Exceeds token supply");
    require(msg.value >= 0.05 ether, "Not enough ETH sent: check price.");
        _safeMint(_msgSender(), tokenId);
    }



    function mintNFT(address recipient, string memory tokenURI)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        // _mint(recipient, newItemId);
        mint(newItemId);
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
