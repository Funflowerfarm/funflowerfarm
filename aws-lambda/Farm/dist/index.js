"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowInSeconds = void 0;
const ethUtil = __importStar(require("ethereumjs-util"));
const uuid_1 = require("uuid");
const sigUtil = __importStar(require("@metamask/eth-sig-util"));
const repository_1 = require("./repository");
const staker_1 = require("./staker");
const bignumber_js_1 = require("bignumber.js");
const farm_1 = require("./farm");
const luxon_1 = require("luxon");
const crafting_1 = require("./crafting");
BigInt.prototype["toJSON"] = function () {
    return this.toString();
};
function provideHandle(repository, staker) {
    return async (event) => {
        event.address = event.address.toLowerCase();
        try {
            console.log(`event m ${event.method} s ${event.authToken}`);
            if (event.method === 'userNonce') {
                const address = event.address.toLowerCase();
                let user = await repository.getUser(address);
                if (!user) {
                    user = await repository.createUser(address);
                }
                const response = {
                    statusCode: 200,
                    body: user.nonce,
                };
                return response;
            }
            if (event.method === 'userVerify') {
                debugger;
                const address = event.address.toLowerCase();
                const signature = event.signature;
                const response = await userVerify(address, signature, repository);
                return response;
            }
            const toVerify = await repository.getUser(event.address);
            if (!toVerify) {
                const response = {
                    statusCode: 401,
                    body: 'User doesnt exist ' + event.address,
                };
                return response;
            }
            if (toVerify.session != event.authToken) {
                const response = {
                    statusCode: 401,
                    body: 'Invalid session' + event.address,
                };
                return response;
            }
            // All method must be auth under this line
            if (event.method === 'getLand') {
                const address = event.address;
                const farm = await repository.getFarm(address);
                if (farm) {
                    const response = {
                        statusCode: 200,
                        body: farm.land,
                    };
                    return response;
                }
                else {
                    const response = {
                        statusCode: 200,
                        body: [],
                    };
                    return response;
                }
            }
            else if (event.method === 'createFarm') {
                return await createFarm(event, repository);
            }
            else if (event.method === 'token/balanceOf') {
                const address = event.address;
                const farm = await repository.getFarm(address);
                let balance = '0';
                if (farm) {
                    balance = farm.inventory.balance.toString();
                }
                const response = {
                    statusCode: 200,
                    body: balance,
                };
                return response;
            }
            else if (event.method === 'totalSupply') {
                const r = await totalSupply(repository);
                return r;
            }
            else if (event.method === 'sync') {
                return await sync(event, repository);
            }
            else if (event.method === 'itemBalanceOf') {
                return await itemBalanceOf(event, repository);
            }
            else if (event.method === 'craft') {
                return await craft(event, repository);
            }
            else if (event.method === 'receiveReward') {
                return await receiveReward(event, repository);
            }
            else if (event.method === 'myReward') {
                return await myReward(event, repository).then(x => {
                    const response = {
                        statusCode: 200,
                        body: x.toString(),
                    };
                    return response;
                });
            }
            else if (event.method === 'hatchTime') {
                return await hatchTime(event, repository).then(x => {
                    const response = {
                        statusCode: 200,
                        body: x
                    };
                    return response;
                });
            }
            else if (event.method === 'levelUp') {
                return await levelUp(event, repository);
            }
            else if (event.method === 'itemTotalSupply') {
                return await itemTotalSupply(event, repository);
            }
            else if (event.method === 'itemGetAvailable') {
                return await itemGetAvailable(event, staker);
            }
            else if (event.method === 'collectEggs') {
                return await collectEggs(event, repository);
            }
            else if (event.method === 'stake') {
                const address = event.address;
                const resource = event.resource;
                const amount = event.amount;
                return await staker.stake(address, resource, amount);
            }
            else {
                const response = {
                    statusCode: 200,
                    body: `Not known method ${event.method}`,
                };
                return response;
            }
        }
        catch (e) {
            console.error(e);
            const response = {
                statusCode: 500,
                message: e.message
            };
            return response;
        }
    };
}
;
async function totalSupply(repo) {
    const supply = await repo.totalSupply();
    const response = {
        statusCode: 200,
        body: supply.toString(),
    };
    return response;
}
function getSeedPrice(_fruit) {
    const decimals = new bignumber_js_1.BigNumber(18);
    if (_fruit == farm_1.Fruit.Sunflower) {
        //$0.01
        return new bignumber_js_1.BigNumber(1).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Potato) {
        // $0.10
        //return 10 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(10).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Pumpkin) {
        // $0.40
        // return 40 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(40).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Beetroot) {
        // $1
        // return 1 * 10**decimals;
        return new bignumber_js_1.BigNumber(1).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Cauliflower) {
        // $4
        //return 4 * 10**decimals;
        return new bignumber_js_1.BigNumber(4).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Parsnip) {
        // $10
        //return 10 * 10**decimals;
        return new bignumber_js_1.BigNumber(10).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Radish) {
        // $50
        //return 50 * 10**decimals;
        return new bignumber_js_1.BigNumber(50).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    throw new Error(`Unknown price for fruit ${_fruit}`);
}
async function getMarketRate(repo) {
    const decimals = new bignumber_js_1.BigNumber(18);
    const totalSupply = await repo.totalSupply();
    // Less than 100, 000 tokens
    if (totalSupply.lt(new bignumber_js_1.BigNumber(100000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
        // 1 Farm Dollar gets you 1 FMC token
        return new bignumber_js_1.BigNumber(1);
    }
    // Less than 500, 000 tokens
    //if (totalSupply < (500000 * 10**decimals)) {
    if (totalSupply.lt(new bignumber_js_1.BigNumber(500000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
        return new bignumber_js_1.BigNumber(5);
    }
    // Less than 1, 000, 000 tokens
    //if (totalSupply < (1000000 * 10**decimals)) {
    if (totalSupply.lt(new bignumber_js_1.BigNumber(1000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
        return new bignumber_js_1.BigNumber(10);
    }
    // Less than 5, 000, 000 tokens
    //if (totalSupply < (5000000 * 10**decimals)) {
    if (totalSupply.lt(new bignumber_js_1.BigNumber(5000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
        return new bignumber_js_1.BigNumber(50);
    }
    // Less than 10, 000, 000 tokens
    //if (totalSupply < (10000000 * 10**decimals)) {
    if (totalSupply.lt(new bignumber_js_1.BigNumber(10000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
        return new bignumber_js_1.BigNumber(100);
    }
    // Less than 50, 000, 000 tokens
    //if (totalSupply < (50000000 * 10**decimals)) {
    if (totalSupply.lt(new bignumber_js_1.BigNumber(50000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
        return new bignumber_js_1.BigNumber(500);
    }
    // Less than 100, 000, 000 tokens
    //if (totalSupply < (100000000 * 10**decimals)) {
    if (totalSupply.lt(new bignumber_js_1.BigNumber(100000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
        return new bignumber_js_1.BigNumber(1000);
    }
    // Less than 500, 000, 000 tokens
    // if (totalSupply < (500000000 * 10**decimals)) {
    if (totalSupply.lt(new bignumber_js_1.BigNumber(500000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
        return new bignumber_js_1.BigNumber(5000);
    }
    // Less than 1, 000, 000, 000 tokens
    //if (totalSupply < (1000000000 * 10**decimals)) {
    if (totalSupply.lt(new bignumber_js_1.BigNumber(1000000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
        return new bignumber_js_1.BigNumber(10000);
    }
    // 1 Farm Dollar gets you a 0.00001 of a token - Linear growth from here
    return totalSupply.div(10000);
}
function requiredLandSize(_fruit) {
    if (_fruit == farm_1.Fruit.Sunflower || _fruit == farm_1.Fruit.Potato) {
        return 5;
    }
    else if (_fruit == farm_1.Fruit.Pumpkin || _fruit == farm_1.Fruit.Beetroot) {
        return 8;
    }
    else if (_fruit == farm_1.Fruit.Cauliflower) {
        return 11;
    }
    else if (_fruit == farm_1.Fruit.Parsnip) {
        return 14;
    }
    else if (_fruit == farm_1.Fruit.Radish) {
        return 17;
    }
    throw new Error(`Unknown fruit ${_fruit}`);
}
async function getMarketPrice(price, repo) {
    const marketRate = await getMarketRate(repo);
    return price.div(marketRate);
}
function getHarvestSeconds(_fruit) {
    if (_fruit == farm_1.Fruit.Sunflower) {
        // 1 minute
        return 1 * 60;
    }
    else if (_fruit == farm_1.Fruit.Potato) {
        // 5 minutes
        return 5 * 60;
    }
    else if (_fruit == farm_1.Fruit.Pumpkin) {
        // 1 hour
        return 1 * 60 * 60;
    }
    else if (_fruit == farm_1.Fruit.Beetroot) {
        // 4 hours
        return 4 * 60 * 60;
    }
    else if (_fruit == farm_1.Fruit.Cauliflower) {
        // 8 hours
        return 8 * 60 * 60;
    }
    else if (_fruit == farm_1.Fruit.Parsnip) {
        // 1 day
        return 24 * 60 * 60;
    }
    else if (_fruit == farm_1.Fruit.Radish) {
        // 3 days
        return 3 * 24 * 60 * 60;
    }
    throw new Error("INVALID_FRUIT");
}
function getFruitPrice(_fruit) {
    const decimals = new bignumber_js_1.BigNumber(18);
    if (_fruit == farm_1.Fruit.Sunflower) {
        // $0.02
        //return 2 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(2).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Potato) {
        // $0.16
        // return 16 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(16).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Pumpkin) {
        // $0.80
        // return 80 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(80).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Beetroot) {
        // $1.8
        //return 180 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(180).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Cauliflower) {
        // $8
        //return 8 * 10**decimals;
        return new bignumber_js_1.BigNumber(8).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Parsnip) {
        // $16
        //return 16 * 10**decimals;
        return new bignumber_js_1.BigNumber(16).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Radish) {
        // $80
        //return 80 * 10**decimals;
        return new bignumber_js_1.BigNumber(80).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    throw new Error("INVALID_FRUIT");
}
function getLandPrice(landSize) {
    const decimals = new bignumber_js_1.BigNumber(18);
    if (landSize <= 5) {
        // $1
        //return 1 * 10**decimals;
        return new bignumber_js_1.BigNumber(1).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (landSize <= 8) {
        // 50
        //return 50 * 10**decimals;
        return new bignumber_js_1.BigNumber(50).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (landSize <= 11) {
        // $500
        //return 500 * 10**decimals;
        return new bignumber_js_1.BigNumber(500).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    // $2500
    //return 2500 * 10**decimals;
    return new bignumber_js_1.BigNumber(2500).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
}
async function levelUp(event, repository) {
    const address = event.address;
    const farm = await repository.getFarm(address);
    if (farm) {
        if (farm.land.length > 17) {
            throw new Error('Farm Max Level reached');
        }
        const price = getLandPrice(farm.land.length);
        const fmcPrice = await getMarketPrice(price, repository);
        const balance = new bignumber_js_1.BigNumber(farm.inventory.balance.toString());
        if (balance.lt(fmcPrice)) {
            throw new Error("INSUFFICIENT_FUNDS");
        }
        const updatedBalance = balance.minus(fmcPrice);
        const sunFlower = new farm_1.Square();
        sunFlower.fruit = farm_1.Fruit.Sunflower;
        sunFlower.createdAt = 0; // Make them immediately harvestable in case they spent all their tokens
        for (let index = 0; index < 3; index++) {
            farm.land.push(sunFlower);
        }
        farm.inventory.balance = BigInt(updatedBalance.toString());
        const updatedFarm = await repository.saveFarm(address, farm);
        return {
            statusCode: 200,
            body: {
                farm: updatedFarm
            }
        };
    }
    else {
        throw new Error("No Farm");
    }
}
async function sync(event, repository) {
    const address = event.address;
    const actions = event.actions;
    const farm = await repository.getFarm(address);
    let balance = new bignumber_js_1.BigNumber(farm.inventory.balance.toString());
    console.log('Actions to process: ', actions);
    for (let i = 0; i < actions.length; i++) {
        const act = actions[i];
        const thirtyMinutesAgoSeconds = Math.floor(luxon_1.DateTime.now().minus({ minutes: 30 }).toSeconds());
        if (act.createdAt < thirtyMinutesAgoSeconds) {
            throw new Error("EVENT_EXPIRED");
        }
        if (act.createdAt < farm.syncedAt) {
            throw new Error(`EVENT_IN_PAST: event ${act.createdAt} farm: ${farm.syncedAt}`);
        }
        const now = nowInSeconds();
        if (act.createdAt > now) {
            throw new Error(`EVENT_IN_FUTURE: now ${now} createdAt ${act.createdAt}`);
        }
        if (i > 0) {
            if (!(act.createdAt >= actions[i - 1].createdAt)) {
                throw new Error("INVALID_ORDER");
            }
        }
        if (act.action == farm_1.Action.Plant) {
            if (farm.land.length < requiredLandSize(act.fruit)) {
                throw new Error(`invalid level current level ${farm.land.length}, required: ${requiredLandSize(act.fruit)}`);
            }
            const price = getSeedPrice(act.fruit);
            const fmcPrice = await getMarketPrice(price, repository);
            if (fmcPrice.gt(balance)) {
                throw new Error(`Not balance ${balance} to but seed at price ${fmcPrice.toString()}`);
            }
            balance = balance.minus(fmcPrice);
            const plantedSeed = new farm_1.Square();
            plantedSeed.fruit = act.fruit;
            plantedSeed.createdAt = nowInSeconds();
            farm.land[act.landIndex] = plantedSeed;
        }
        else if (act.action == farm_1.Action.Harvest) {
            const square = farm.land[act.landIndex];
            if (square.fruit == farm_1.Fruit.None) {
                throw new Error(`No Fruit in land index ${act.landIndex}`);
            }
            const duration = act.createdAt - square.createdAt;
            const secondsToHarvest = getHarvestSeconds(square.fruit);
            if (!(duration >= secondsToHarvest)) {
                throw new Error(`NOT_RIPE duration ${duration} second to harvest ${secondsToHarvest}`);
            }
            // Clear the land
            const empty = new farm_1.Square();
            empty.fruit = farm_1.Fruit.None;
            empty.createdAt = 0;
            farm.land[act.landIndex] = empty;
            const price = getFruitPrice(square.fruit);
            const fmcPrice = await getMarketPrice(price, repository);
            console.log('Balance ' + balance.toString() + ' fmcPrice ' + fmcPrice.toString());
            balance = balance.plus(fmcPrice);
        }
    }
    const prevBalance = new bignumber_js_1.BigNumber(farm.inventory.balance.toString());
    const resultofActions = balance.minus(prevBalance);
    repository.updateTotalSupply(resultofActions);
    farm.inventory.balance = BigInt(balance.toString());
    farm.syncedAt = nowInSeconds();
    await repository.saveFarm(address, farm);
    return {
        statusCode: 200,
        body: {}
    };
}
async function createFarm(event, repository) {
    const address = event.address;
    const empty = {
        fruit: farm_1.Fruit.None,
        createdAt: 0
    };
    const sunflower = {
        fruit: farm_1.Fruit.Sunflower,
        createdAt: 0
    };
    const land = [];
    // Each farmer starts with 5 fields & 3 Sunflowers
    land.push(empty);
    land.push(sunflower);
    land.push(sunflower);
    land.push(sunflower);
    land.push(empty);
    const newFarm = {
        land: land,
        inventory: {
            balance: BigInt(new bignumber_js_1.BigNumber(127).times(new bignumber_js_1.BigNumber(10).pow(18)).toString())
        }
    };
    newFarm.syncedAt = nowInSeconds();
    newFarm.recoveryTime = {};
    newFarm.lastReward = 0;
    await repository.createFarm(address, newFarm);
    const response = {
        statusCode: 200,
        body: [],
    };
    return response;
}
function nowInSeconds() {
    return Math.floor(luxon_1.DateTime.now().toSeconds());
}
exports.nowInSeconds = nowInSeconds;
const constructorRepository = new repository_1.Repository();
const constructorStaker = new staker_1.Staker(constructorRepository);
exports.handler = provideHandle(constructorRepository, constructorStaker);
exports.provideHandle = provideHandle;
async function craft(event, repository) {
    const { address, resource, amount } = event;
    const safeAmount = new bignumber_js_1.BigNumber(amount).dividedBy(new bignumber_js_1.BigNumber(10).pow(18));
    const recipe = crafting_1.recipes.find(r => r.address === resource);
    if (recipe) {
        const farm = await repository.getFarm(address);
        const inventory = farm.inventory;
        for (let i = 0; i < recipe.ingredients.length; i++) {
            const ing = recipe.ingredients[i];
            let name = ing.name;
            if (name == "$SFF") {
                name = "balance";
            }
            if (inventory[name]) {
                const amountResource = new bignumber_js_1.BigNumber(inventory[name]);
                const cost = new bignumber_js_1.BigNumber(ing.amount).multipliedBy(new bignumber_js_1.BigNumber(10).pow(18)).multipliedBy(safeAmount);
                console.log(`ingredient ${name} cost ${cost.toString()} in inventory ${amountResource.toString()}`);
                if (amountResource.gte(cost)) {
                    const balanceAfterSpent = amountResource.minus(cost);
                    inventory[name] = balanceAfterSpent.toString();
                }
                else {
                    throw new Error("NOT ENOUGH " + name + ' cost ' + cost.toString());
                }
            }
            else {
                throw new Error("NO BALANCE " + name);
            }
        }
        //add resource
        if (inventory[recipe.name]) {
            const current = new bignumber_js_1.BigNumber(inventory[recipe.name]);
            const updated = current.plus(amount);
            inventory[recipe.name] = updated.toString();
        }
        else {
            inventory[recipe.name] = amount;
        }
        await repository.saveFarm(address, farm);
        const response = {
            statusCode: 200,
            body: [],
        };
        return response;
    }
    else {
        throw new Error("NO_RECIPE");
    }
}
async function itemBalanceOf(event, repository) {
    console.log('itemBalanceOf ', event);
    let resource = crafting_1.recipes.find(r => r.address === event.resource);
    if (!resource) {
        resource = crafting_1.items.find(r => r.address === event.resource);
    }
    if (resource) {
        const farm = await repository.getFarm(event.address);
        let balance = '0';
        if (farm && farm.inventory && farm.inventory[resource.name]) {
            balance = farm.inventory[resource.name];
        }
        const response = {
            statusCode: 200,
            body: balance
        };
        return response;
    }
    else {
        throw new Error("NO_RESOURCE in item blance: " + event.resource);
    }
}
async function itemTotalSupply(event, repository) {
    console.log('itemTotalSupply  ', event);
    let resource = crafting_1.recipes.find(r => r.address === event.resource);
    if (!resource) {
        resource = crafting_1.items.find(r => r.address === event.resource);
    }
    if (resource) {
        const balance = await repository.getResourceTotalSupply(resource.name);
        const response = {
            statusCode: 200,
            body: balance
        };
        return response;
    }
    else {
        throw new Error("NO_REROURCE:  in total supply " + event.resource);
    }
}
async function myReward(event, repository) {
    /*
          uint lastOpenDate = rewardsOpenedAt[msg.sender];

        // Block timestamp is seconds based
        uint threeDaysAgo = block.timestamp.sub(60 * 60 * 24 * 3);

        require(lastOpenDate < threeDaysAgo, "NO_REWARD_READY");

        uint landSize = fields[msg.sender].length;
        // E.g. $1000
        uint farmBalance = token.balanceOf(address(this));
        // E.g. $1000 / 500 farms = $2
        uint farmShare = farmBalance / farmCount;

        if (landSize <= 5) {
            // E.g $0.2
            return farmShare.div(10);
        } else if (landSize <= 8) {
            // E.g $0.4
            return farmShare.div(5);
        } else if (landSize <= 11) {
            // E.g $1
            return farmShare.div(2);
        }
        
        // E.g $3
        return farmShare.mul(3).div(2);
        */
    const farm = await repository.getFarm(event.address);
    const lastOpenDate = farm.lastReward;
    const threeDaysAgo = nowInSeconds() - (60 * 60 * 24 * 3);
    if (lastOpenDate > threeDaysAgo) {
        throw new Error('No reward ready, last open was ' + lastOpenDate);
    }
    const landSize = farm.land.length;
    const farmBalance = new bignumber_js_1.BigNumber(farm.inventory.balance.toString());
    const farmCount = await repository.getFarmCount();
    const farmShare = farmBalance.dividedBy(new bignumber_js_1.BigNumber(farmCount));
    if (landSize <= 5) {
        return farmShare.dividedBy(new bignumber_js_1.BigNumber(10));
    }
    else if (landSize <= 8) {
        return farmShare.dividedBy(new bignumber_js_1.BigNumber(5));
    }
    else if (landSize <= 11) {
        return farmShare.dividedBy(new bignumber_js_1.BigNumber(2));
    }
    return farmShare.multipliedBy(new bignumber_js_1.BigNumber(3)).dividedBy(new bignumber_js_1.BigNumber(2));
}
async function receiveReward(event, repository) {
    const reward = await myReward(event, repository);
    if (reward.isPositive()) {
        const farm = await repository.getFarm(event.address);
        let balance = new bignumber_js_1.BigNumber(farm.inventory.balance.toString());
        await repository.updateTotalSupply(reward);
        balance = balance.plus(reward);
        farm.inventory.balance = BigInt(balance.toString());
        farm.lastReward = nowInSeconds();
        repository.saveFarm(event.address, farm);
    }
    else {
        throw new Error('reward is not positive: ' + reward.toString());
    }
}
async function itemGetAvailable(event, staker) {
    const { address, resource } = event;
    const available = await staker.getAvailable(address, resource);
    const response = {
        statusCode: 200,
        body: available,
    };
    return response;
}
async function userVerify(attempToLoginAddress, signature, repository) {
    const user = await repository.getUser(attempToLoginAddress);
    if (user) {
        const msgBufferHex = ethUtil.bufferToHex(Buffer.from(user.nonce, 'utf8'));
        const address = sigUtil.recoverPersonalSignature({
            data: msgBufferHex,
            signature: signature
        });
        // The signature verification is successful if the address found with
        // ecrecover matches the initial publicAddress
        if (address.toLowerCase() === attempToLoginAddress.toLowerCase()) {
            const uuid = (0, uuid_1.v4)();
            user.session = uuid;
            user.nonce = repository.generateUserNonce();
            await repository.saveUser(user);
            const response = {
                statusCode: 200,
                body: user.session,
            };
            return response;
        }
        else {
            Promise.reject("user " + attempToLoginAddress + " verification failed");
        }
    }
    else {
        Promise.reject("user " + attempToLoginAddress + "doesnt exist");
    }
}
async function collectEggs(event, repository) {
    const address = event.address;
    const f = await repository.collectEggs(address);
    const response = {
        statusCode: 200,
        body: {
            farm: f
        },
    };
    return response;
}
async function hatchTime(event, repository) {
    const address = event.address;
    const farm = await repository.getFarm(address);
    if (!farm || !farm.recoveryTime) {
        return String(nowInSeconds() - 60 * 60 * 24);
    }
    const recoveryTime = farm.recoveryTime["Chicken"];
    if (recoveryTime) {
        return String(recoveryTime - 60 * 60 * 24);
    }
    else {
        return String(nowInSeconds() - 60 * 60 * 24);
    }
}
