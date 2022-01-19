const Token = artifacts.require("TokenV2");
const farm = artifacts.require("FarmV2");

const delay = ms => new Promise(res => setTimeout(res, ms));
async function deployDelay() {
  await delay(2000);
}

async function deployERC20(deployer, name, farm) {
  const contract = artifacts.require(name);
  await deployer.deploy(contract);
  await deployDelay();
  const contractDetails = await contract.deployed();
  if (farm) {
    await contractDetails.passMinterRole(farm.address)
    await deployDelay();
  }
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

  const axeDeploy = await deployERC20(deployer, "Axe")
  await axeDeploy.contract.passMinterRole(farmContract.address)

  farmContract.createRecipe(axeDeploy.contract.address,[{materialAddress: token.address, amount: 1}])
  await deployDelay()
  out += axeDeploy.out

  out += (await deployERC20(deployer, "Stone")).out
  const woodDeploy = await deployERC20(deployer, "Wood", farmContract)
  out += woodDeploy.out
  farmContract.createResource(woodDeploy.contract.address, axeDeploy.contract.address)
  await deployDelay()

  out += (await deployERC20(deployer, "Iron")).out
  out += (await deployERC20(deployer, "Gold")).out

  let chickenCoopDeploy = await deployERC20(deployer, "ChickenCoop")
  out += chickenCoopDeploy.out

  let eggDeploy = await deployEgg(deployer, farmContract.address)
  out += eggDeploy.out

  let chickenDeploy = await deployChicken(deployer, chickenCoopDeploy.contract.address, eggDeploy.contract.address)
  out += chickenDeploy.out
  
  const pickAxeDeploy = await deployERC20(deployer, "PickAxe")
  await pickAxeDeploy.contract.passMinterRole(farmContract.address)
  out += pickAxeDeploy.out

  const ironPickAxeDeploy = await deployERC20(deployer, "IronPickAxe")
  await ironPickAxeDeploy.contract.passMinterRole(farmContract.address)
  out += ironPickAxeDeploy.out

  const stonePickAxeDeploy = await deployERC20(deployer, "StonePickAxe")
  await stonePickAxeDeploy.contract.passMinterRole(farmContract.address)
  out += stonePickAxeDeploy.out

  delay(2000)


  console.log(out + '};');
};
