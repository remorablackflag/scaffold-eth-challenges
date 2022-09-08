//
// this script executes when you run 'yarn test'
//
// you can also test remote submissions like:
// CONTRACT_ADDRESS=0x43Ab1FCd430C1f20270C2470f857f7a006117bbb yarn test --network rinkeby
//
// you can even run mint commands if the tests pass like:
// yarn test && echo "PASSED" || echo "FAILED"
//

const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { isCall } = require("hardhat/internal/hardhat-network/stack-traces/opcodes");

use(solidity);

describe("🚩 Challenge 3: 🏵 DiceGame 🤖", function () {
  let riggedRoll, diceGame;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  if(process.env.CONTRACT_ADDRESS){
    // live contracts, token already deployed
  }else{
    it("Should deploy DiceGame", async function () {
      const DiceGame = await ethers.getContractFactory("DiceGame");
      diceGame = await DiceGame.deploy({ value: ethers.utils.parseEther("0.05") });
    });
  }

  describe("RiggedRoll tests...", function () {

    if(process.env.CONTRACT_ADDRESS){
        it("Should connect to external contract", async function () {
            riggedRoll = await ethers.getContractAt("RiggedRoll", process.env.CONTRACT_ADDRESS);
            console.log(`\t`,"🛰 Connected to:",riggedRoll.address)

            console.log(`\t`,"📡 Loading the diceGame address from the RiggedRoll...")
            console.log(`\t`,"⚠️ Make sure *diceGame* is public in the RiggedRoll.sol!")
            let diceGameAddress = await RiggedRoll.diceGame();
            console.log('\t',"🏷 DiceGame Address:",diceGameAddress)

            diceGame = await ethers.getContractAt("DiceGame", diceGameAddress);
            console.log(`\t`,"🛰 Connected to DiceGame at:",diceGame.address)
        });
    }else{
        it("Should deploy RiggedRoll", async function () {
            const RiggedRoll = await ethers.getContractFactory("RiggedRoll");
            riggedRoll = await RiggedRoll.deploy(diceGame.address);
        });
    }

    describe("receive()", function () {
      it("Should be able to receive funds", async function () {
        const [owner] = await ethers.getSigners();
        const amount = ethers.utils.parseEther("0.01");
        const contractBalance = riggedRoll.balance;

        console.log('\t'," 💸 Sending tokens to RiggedRoll...")
        const transactionHash = await owner.sendTransaction({
            to: riggedRoll.address,
            value: amount,
        });

        console.log('\t'," ⏳ Waiting for confirmation...")
        const txResult = await transactionHash.wait();
        expect(txResult.status).to.equal(1);

      });

      // Uncomment the event and emit lines in YourContract.sol to make this test pass

      /*it("Should emit a SetPurpose event ", async function () {
        const [owner] = await ethers.getSigners();

        const newPurpose = "Another Test Purpose";

        expect(await myContract.setPurpose(newPurpose)).to.
          emit(myContract, "SetPurpose").
            withArgs(owner.address, newPurpose);
      });*/
    });
  });
});
