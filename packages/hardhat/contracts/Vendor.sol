pragma solidity 0.8.4;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "./YourToken.sol";

contract Vendor is Ownable {

    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);
    event SellTokens(address seller, uint256 amountOfTokens, uint256 amountOfETH);

    YourToken public yourToken;

    uint256 public constant tokensPerEth = 100;

    constructor(address tokenAddress) {
        yourToken = YourToken(tokenAddress);
    }

    // ToDo: create a payable buyTokens() function:
    function buyTokens() public payable {
        address buyer = msg.sender;
        uint256 amountOfETH = msg.value;
        uint256 amountOfTokens = amountOfETH * tokensPerEth;

        yourToken.transfer(buyer, amountOfTokens);

        emit BuyTokens(buyer, amountOfETH, amountOfTokens);
    }

    // ToDo: create a withdraw() function that lets the owner withdraw ETH
    function withdraw() public pure {
        revert("Function is disabled");

        // if ( msg.sender != owner()) { 
        //     revert("Can only be called by owner");
        // }

        // yourToken.transfer(msg.sender, yourToken.balanceOf(address(this)));
    }

    // ToDo: create a sellTokens(uint256 _amount) function:
    function sellTokens(uint256 _amount) public {
        address seller = msg.sender;
        uint256 theAmount = _amount;
        uint256 amountOfETH = theAmount / tokensPerEth;

        yourToken.transferFrom(msg.sender, address(this), theAmount);

        payable(seller).transfer(amountOfETH);

        emit SellTokens(seller, theAmount, amountOfETH);
    }
}
