const Token = artifacts.require("TokenV2");
const farm = artifacts.require("FarmV2");

const delay = ms => new Promise(res => setTimeout(res, ms));
async function deployDelay() {
  await delay(2000);
}

async function deployERC20(deployer, name) {
  const contract = artifacts.require(name);
  await deployer.deploy(contract);
  await deployDelay();
  const contractDetails = await contract.deployed();
  return {
    out: `, "${name}": "${contractDetails.address}"`,
    contract: contractDetails
  }
}

async function deployEgg(deployer, farmAddress) {
  const name = "Egg"
  const contract = artifacts.require(name);
  await deployer.deploy(contract, farmAddress);
  await deployDelay();
  const contractDetails = await contract.deployed();
  return {
    out: `, "${name}": "${contractDetails.address}"`,
    contract: contractDetails
  }
}

async function deployChicken(deployer, coop, egg) {
  const name = "Chicken"
  const contract = artifacts.require(name);
  await deployer.deploy(contract, coop, egg);
  await deployDelay();
  const contractDetails = await contract.deployed();
  return {
    out: `, "${name}": "${contractDetails.address}"`,
    contract: contractDetails
  }
}

module.exports = async function (deployer) {

  //deploy Token
  await deployer.deploy(Token);
  await deployDelay();

  //assign token into variable to get it's address
  const token = await Token.deployed();

  //pass token address for contract(for future minting)
  await deployer.deploy(farm, token.address);
  await deployDelay();

  //assign contract into variable to get it's address
  const farmContract = await farm.deployed();
  //change token's owner/minter from deployer to farm
  await token.passMinterRole(farmContract.address);
  let out = `const deployAddresses = { "TokenV2" : "${token.address}", "FarmV2" : "${farmContract.address}"`

  out += (await deployERC20(deployer, "Axe")).out
  out += (await deployERC20(deployer, "Stone")).out
  out += (await deployERC20(deployer, "Wood")).out
  out += (await deployERC20(deployer, "Iron")).out
  out += (await deployERC20(deployer, "Gold")).out

  let chickenCoopDeploy = await deployERC20(deployer, "ChickenCoop")
  out += chickenCoopDeploy.out

  let eggDeploy = await deployEgg(deployer, farmContract.address)
  out += eggDeploy.out

  let chickenDeploy = await deployChicken(deployer, chickenCoopDeploy.contract.address, eggDeploy.contract.address)
  out += chickenDeploy.out
  


  delay(2000)


  console.log(out + '};');
};
