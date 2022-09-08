const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const frontendAddress = (chainId == localChainId) ? "0xa74b2b930C030CA86c42C40b4Bdd9Ec470fFe6A6" : `0x${process.env.RINKEBY_FRONTEND_ADDRESS}`;

  const diceGame = await ethers.getContract("DiceGame", deployer);

  await deploy("RiggedRoll", {
   from: deployer,
   args: [diceGame.address],
   log: true,
  });

  const riggedRoll = await ethers.getContract("RiggedRoll", deployer);

  console.log("Transferring ownership to: ", frontendAddress);
  const ownershipTransaction = await riggedRoll.transferOwnership(frontendAddress);
  const ownershipResult = await ownershipTransaction.wait();

};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["RiggedRoll"];
