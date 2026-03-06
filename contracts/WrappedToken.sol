// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WrappedToken is ERC20, Ownable {

    constructor() 
        ERC20("WrappedDemoToken", "wDMT")
        Ownable(msg.sender)   // 🔥 FIX HERE
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}