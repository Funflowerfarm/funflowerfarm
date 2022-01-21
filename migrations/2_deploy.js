const Token = artifacts.require("TokenV2");
const farm = artifacts.require("FarmV2");

const delay = ms => new Promise(res => setTimeout(res, ms));
async function deployDelay() {
  await delay(2000);
}

async function deployERC20(deployer, name, farm, out) {
  const contract = artifacts.require(name);
  await deployer.deploy(contract);
  await deployDelay();
  const contractDetails = await contract.deployed();
  if (farm) {
    await contractDetails.passMinterRole(farm.address)
    await deployDelay();
  }
  out.message += `, "${name}": "${contractDetails.address}"`
  return {
    contract: contractDetails,
    address : contractDetails.address
  }
}

async function deployEgg(deployer, farmAddress, out) {
  const name = "Egg"
  const contract = artifacts.require(name);
  await deployer.deploy(contract, farmAddress);
  await deployDelay();
  const contractDetails = await contract.deployed();
  out.message += `, "${name}": "${contractDetails.address}"`;
  return {
    contract: contractDetails
  }
}

async function deployChicken(deployer, coop, egg, out) {
  const name = "Chicken"
  const contract = artifacts.require(name);
  await deployer.deploy(contract, coop, egg);
  await deployDelay();
  const contractDetails = await contract.deployed();
  out.message += `, "${name}": "${contractDetails.address}"`;
  return {
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

  //axe to mine wood
  const axeDeploy = await deployERC20(deployer, "Axe", farmContract, out)

  await createRecipe(farmContract, axeDeploy, [{materialAddress: token.address, amount: 1}])

  const woodDeploy = await deployERC20(deployer, "Wood", farmContract, out)
  await createResource(farmContract, woodDeploy, axeDeploy)

  // pickaxe to mine stone
  const pickAxeDeploy = await deployERC20(deployer, "PickAxe", farmContract, out)
  await createRecipe(farmContract, pickAxeDeploy, [
    {materialAddress: token.address, amount: 2},
    {materialAddress: woodDeploy.address, amount: 5},
  ])
  const stoneDeploy = await deployERC20(deployer, "Stone",farmContract, out)
  await createResource(farmContract, stoneDeploy, pickAxeDeploy)
  //

  // Stone pickaxe to mine iron
  const stonePickAxeDeploy = await deployERC20(deployer, "StonePickAxe", farmContract, out)
  await createRecipe(farmContract, stonePickAxeDeploy, [
    {materialAddress: token.address, amount: 2},
    {materialAddress: woodDeploy.address, amount: 5},
    {materialAddress: stoneDeploy.address, amount: 5},
  ])
  const ironDeploy = await deployERC20(deployer, "Iron", farmContract, out)
  await createResource(farmContract, ironDeploy, stonePickAxeDeploy)
  //

  // Iron Pickaxe to mine gold
  const ironPickAxeDeploy = await deployERC20(deployer, "IronPickAxe", farmContract, out)
  await createRecipe(farmContract, ironPickAxeDeploy, [
    {materialAddress: token.address, amount: 10},
    {materialAddress: woodDeploy.address, amount: 10},
    {materialAddress: ironDeploy.address, amount: 10},

  ])
  const goldDeploy = await deployERC20(deployer, "Gold", farmContract, out)
  await createResource(farmContract, goldDeploy, ironPickAxeDeploy)



  let chickenCoopDeploy = await deployERC20(deployer, "ChickenCoop",farmContract, out)
  await createRecipe(farmContract, chickenCoopDeploy, [
    {materialAddress: token.address, amount: 200},
    {materialAddress: woodDeploy.contract.address, amount: 300},
    {materialAddress: goldDeploy.contract.address, amount: 25},
  ])


  let eggDeploy = await deployEgg(deployer, farmContract.address, out)

  let chickenDeploy = await deployChicken(deployer, chickenCoopDeploy.contract.address, eggDeploy.contract.address, out)



await deployDelay()
  console.log(out.message + '};\n export { deployAddresses }; \n');
};
