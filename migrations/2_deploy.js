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

async function createResource(farmContract, resourceDeploy, resourceCreatorDeploy) {
  farmContract.createResource(resourceDeploy.contract.address, resourceCreatorDeploy.contract.address)
  await deployDelay()
}

async function createRecipe(farmContract, craftingOutputDeploy, ingredients) {
  farmContract.createRecipe(craftingOutputDeploy.contract.address, ingredients)
  await deployDelay()
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
  let out = {message: `const deployAddresses = { "TokenV2" : "${token.address}", "FarmV2" : "${farmContract.address}"`}

  const axeDeploy = await deployERC20(deployer, "Axe")
  await axeDeploy.contract.passMinterRole(farmContract.address)

  await createRecipe(farmContract, axeDeploy, [{materialAddress: token.address, amount: 1}], out)
  out += axeDeploy.out

  out += (await deployERC20(deployer, "Stone")).out
  const woodDeploy = await deployERC20(deployer, "Wood", farmContract)
  out += woodDeploy.out
  await createResource(farmContract, woodDeploy, axeDeploy)

  const ironDeploy = await deployERC20(deployer, "Iron", farmContract)
  out += ironDeploy.out

  const goldDeploy = await deployERC20(deployer, "Gold", farmContract)

  out += goldDeploy.out

  const pickAxeDeploy = await deployERC20(deployer, "PickAxe")
  await pickAxeDeploy.contract.passMinterRole(farmContract.address)
  out += pickAxeDeploy.out

  await createResource(farmContract, goldDeploy, pickAxeDeploy)


  let chickenCoopDeploy = await deployERC20(deployer, "ChickenCoop")
  await createRecipe(farmContract, chickenCoopDeploy, [
    {materialAddress: token.address, amount: 200},
    {materialAddress: woodDeploy.contract.address, amount: 300},
    {materialAddress: goldDeploy.contract.address, amount: 25},
  ])

  out += chickenCoopDeploy.out

  let eggDeploy = await deployEgg(deployer, farmContract.address)
  out += eggDeploy.out

  let chickenDeploy = await deployChicken(deployer, chickenCoopDeploy.contract.address, eggDeploy.contract.address)
  out += chickenDeploy.out
  


  const ironPickAxeDeploy = await deployERC20(deployer, "IronPickAxe")
  await ironPickAxeDeploy.contract.passMinterRole(farmContract.address)
  out += ironPickAxeDeploy.out

  const stonePickAxeDeploy = await deployERC20(deployer, "StonePickAxe")
  await stonePickAxeDeploy.contract.passMinterRole(farmContract.address)
  out += stonePickAxeDeploy.out

  delay(2000)

  console.log(out + '};\n export { deployAddresses }; \n');
};
