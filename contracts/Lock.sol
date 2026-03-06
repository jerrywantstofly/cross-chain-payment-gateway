// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract Lock {

    // Token to be locked on Chain A
    IERC20 public token;

    // Track locked balances
    mapping(address => uint256) public lockedBalances;

    // Event emitted when tokens are locked
    event TokensLocked(
        address indexed sender,
        address indexed receiver,
        uint256 amount
    );

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function lock(uint256 amount, address receiver) public {

        require(amount > 0, "Amount must be greater than zero");
        require(receiver != address(0), "Invalid receiver");

        // Transfer tokens from sender to this contract
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        // Record locked balance
        lockedBalances[msg.sender] += amount;

        // Emit event for relayer
        emit TokensLocked(msg.sender, receiver, amount);
    }

}