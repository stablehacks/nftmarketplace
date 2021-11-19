// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/utils/Counters.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";
import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract demo is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 min_mint_Price = 0.1 ether; // 0.1 eth = 100000000000000000 wei
    constructor() ERC721("demo", "dm") {
    }
    
    function mintNFT(address recipient) public payable
        returns (uint256)
    {   
        //require(msg.value > min_mint_Price, "Not Enough Ether");
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        //require(newItemId > 0 && newItemId < 5000, "Exceeds token supply");
         _mint(recipient, newItemId);
          return newItemId;
    }
}
