// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/utils/Counters.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";
import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract demo is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("demo", "dm") {}
    
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
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        // _mint(recipient, newItemId);
         mint(newItemId);
        _safeMint(recipient, newItemId);
       // _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
