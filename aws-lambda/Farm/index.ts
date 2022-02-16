
import * as ethUtil from 'ethereumjs-util';
import {v4 as uuidv4} from 'uuid';
import * as sigUtil from 'eth-sig-util';


import { Repository } from './repository';
import { Staker } from './staker';
import {BigNumber} from 'bignumber.js';
import {Farm, Square, Fruit, UserAction, Action} from './farm';
import {User} from './User'
import { DateTime } from 'luxon'

import {Ingredient, Recipe, recipes, items} from './crafting'



function provideHandle(repository: Repository, staker: Staker) {
    return async (event) => {
        event.address = event.address.toLowerCase()
        try {
            console.log(`event m ${event.method} s ${event.authToken}`)
            if (event.method === 'userNonce') {
                const address = event.address.toLowerCase();
                let user:User = await repository.getUser(address)
                if(!user) {
                    user = await repository.createUser(address)
                }
                
                const response = {
                    statusCode: 200,
                    body: user.nonce,
                };
                return response;
            }

            if (event.method === 'userVerify') {
                debugger;
                const address = event.address.toLowerCase()
                const signature = event.signature
                const response = await userVerify(address, signature, repository)
                return response;
            }

            const toVerify = await repository.getUser(event.address)
            if (!toVerify) {
                const response = {
                    statusCode: 401,
                    body: 'User doesnt exist ' + event.address,
                };
                return response
            }
            if (toVerify.session != event.authToken) {
                const response = {
                    statusCode: 401,
                    body: 'Invalid session' + event.address,
                };
                return response
            }

            // All method must be auth under this line
            if (event.method === 'getLand') {
                const address = event.address;
                const farm = await repository.getFarm(address)
                if (farm) {
                    const response = {
                        statusCode: 200,
                        body:farm.land,
                    };
                    return response;
                } else {
                    const response = {
                        statusCode: 200,
                        body: [],
                    };
                    return response;
                }
            } else if (event.method === 'createFarm') {

                return createFarm(event, repository);
            } else if (event.method === 'token/balanceOf') {
                const address = event.address;
                const farm: Farm = await repository.getFarm(address)
                let balance = '0'
                if (farm) {
                balance = farm.inventory.balance
                }
                const response = {
                    statusCode: 200,
                    body: balance,
                };
                return response;
            } else if (event.method === 'totalSupply') {
                const r =  await  totalSupply(repository);
                return r;
            } else if (event.method === 'sync') {
                return sync(event, repository);
            } else if (event.method === 'itemBalanceOf') {
                return itemBalanceOf(event, repository);
            } else if (event.method === 'craft') {
                return craft(event, repository);
            } else if (event.method === 'receiveReward') {
                return receiveReward(event, repository);
            } else if (event.method === 'myReward') {
                return myReward(event, repository).then(x =>{
                    const response = {
                        statusCode: 200,
                        body: x.toString(),
                    };
                    return response;
                });
            } else if (event.method === 'hatchTime') {
                return hatchTime(event, repository).then(x =>{
                    const response = {
                        statusCode: 200,
                        body: x
                    };
                    return response;
                });
            } else if (event.method === 'levelUp') {
                return levelUp(event, repository);
            } else if (event.method === 'itemTotalSupply') {
                return itemTotalSupply(event, repository);
            } else if (event.method === 'itemGetAvailable') {
                return itemGetAvailable(event, staker);
            } else if (event.method === 'collectEggs') {
                return collectEggs(event, repository);
            } else if (event.method === 'stake') {
                const address: string = event.address
                const resource: string = event.resource
                const amount: string = event.amount
                return staker.stake(address, resource, amount)
            } else {
                const response = {
                    statusCode: 200,
                    body: `Not known method ${event.method}`,
                };
                return response;   
            }
        } catch (e){
            console.error(e)
            const response = {
                statusCode: 500,
                body: e.Message,
            };
            return response;  
        }
    };
};

async function totalSupply(repo:Repository) {
    const supply = await repo.totalSupply()
    const response = {
        statusCode: 200,
        body: supply.toString(),
    };
    return response;
}

function getSeedPrice(_fruit: Fruit): BigNumber {
    const decimals = new BigNumber(18)

    if (_fruit == Fruit.Sunflower) {
        //$0.01
        return new BigNumber(1).multipliedBy (new BigNumber(10).pow(decimals)).dividedBy(new BigNumber(100));
    } else if (_fruit == Fruit.Potato) {
        // $0.10
        //return 10 * 10**decimals / 100;
        return new BigNumber(10).multipliedBy (new BigNumber(10).pow(decimals)).dividedBy(new BigNumber(100));
    } else if (_fruit == Fruit.Pumpkin) {
        // $0.40
        // return 40 * 10**decimals / 100;
        return new BigNumber(40).multipliedBy (new BigNumber(10).pow(decimals)).dividedBy(new BigNumber(100));
    } else if (_fruit == Fruit.Beetroot) {
        // $1
        // return 1 * 10**decimals;
        return new BigNumber(1).multipliedBy (new BigNumber(10).pow(decimals));
    } else if (_fruit == Fruit.Cauliflower) {
        // $4
        //return 4 * 10**decimals;
        return new BigNumber(4).multipliedBy (new BigNumber(10).pow(decimals));
    } else if (_fruit == Fruit.Parsnip) {
        // $10
        //return 10 * 10**decimals;
        return new BigNumber(10).multipliedBy (new BigNumber(10).pow(decimals));
    } else if (_fruit == Fruit.Radish) {
        // $50
        //return 50 * 10**decimals;
        return new BigNumber(50).multipliedBy (new BigNumber(10).pow(decimals));
    }

    throw new Error(`Unknown price for fruit ${_fruit}`)
}


async function getMarketRate(repo:Repository): Promise<BigNumber> {
    const decimals:BigNumber = new BigNumber(18);
    const totalSupply:BigNumber = await repo.totalSupply();

    // Less than 100, 000 tokens
    if (totalSupply.lt(new BigNumber(100000).multipliedBy(new BigNumber(10).pow(decimals)))) {
        // 1 Farm Dollar gets you 1 FMC token
        return new BigNumber(1);
    }

    // Less than 500, 000 tokens
    //if (totalSupply < (500000 * 10**decimals)) {
    if (totalSupply.lt(new BigNumber(500000).multipliedBy(new BigNumber(10).pow(decimals)))) {

        return new BigNumber(5);
    }

    // Less than 1, 000, 000 tokens
    //if (totalSupply < (1000000 * 10**decimals)) {
    if (totalSupply.lt(new BigNumber(1000000).multipliedBy(new BigNumber(10).pow(decimals)))) {
        return new BigNumber(10);
    }

    // Less than 5, 000, 000 tokens
    //if (totalSupply < (5000000 * 10**decimals)) {
    if (totalSupply.lt(new BigNumber(5000000).multipliedBy(new BigNumber(10).pow(decimals)))) {

        return new BigNumber(50);
    }

    // Less than 10, 000, 000 tokens
    //if (totalSupply < (10000000 * 10**decimals)) {
        if (totalSupply.lt(new BigNumber(10000000).multipliedBy(new BigNumber(10).pow(decimals)))) {
        return new BigNumber(100);
    }

    // Less than 50, 000, 000 tokens
    //if (totalSupply < (50000000 * 10**decimals)) {
    if (totalSupply.lt(new BigNumber(50000000).multipliedBy(new BigNumber(10).pow(decimals)))) {

        return new BigNumber(500);
    }

    // Less than 100, 000, 000 tokens
    //if (totalSupply < (100000000 * 10**decimals)) {
        if (totalSupply.lt(new BigNumber(100000000).multipliedBy(new BigNumber(10).pow(decimals)))) {

        return new BigNumber(1000);
    }

    // Less than 500, 000, 000 tokens
   // if (totalSupply < (500000000 * 10**decimals)) {
    if (totalSupply.lt(new BigNumber(500000000).multipliedBy(new BigNumber(10).pow(decimals)))) {

        return new BigNumber(5000);
    }

    // Less than 1, 000, 000, 000 tokens
    //if (totalSupply < (1000000000 * 10**decimals)) {
        if (totalSupply.lt(new BigNumber(1000000000).multipliedBy(new BigNumber(10).pow(decimals)))) {

        return new BigNumber(10000);
    }

    // 1 Farm Dollar gets you a 0.00001 of a token - Linear growth from here
    return totalSupply.div(10000);
}

    
function requiredLandSize(_fruit: Fruit) : number  {
    if (_fruit == Fruit.Sunflower || _fruit == Fruit.Potato) {
        return 5;
    } else if (_fruit == Fruit.Pumpkin || _fruit == Fruit.Beetroot) {
        return 8;
    } else if (_fruit == Fruit.Cauliflower) {
        return 11;
    } else if (_fruit == Fruit.Parsnip) {
        return 14;
    } else if (_fruit == Fruit.Radish) {
        return 17;
    }
    throw new Error(`Unknown fruit ${_fruit}`);
}

async function getMarketPrice( price: BigNumber, repo:Repository) : Promise<BigNumber> {
    const marketRate:BigNumber = await getMarketRate(repo);

    return price.div(marketRate);
}

function getHarvestSeconds(_fruit:Fruit): number {
    if (_fruit == Fruit.Sunflower) {
        // 1 minute
        return 1 * 60;
    } else if (_fruit == Fruit.Potato) {
        // 5 minutes
        return 5 * 60;
    } else if (_fruit == Fruit.Pumpkin) {
        // 1 hour
        return 1  * 60 * 60;
    } else if (_fruit == Fruit.Beetroot) {
        // 4 hours
        return 4 * 60 * 60;
    } else if (_fruit == Fruit.Cauliflower) {
        // 8 hours
        return 8 * 60 * 60;
    } else if (_fruit == Fruit.Parsnip) {
        // 1 day
        return 24 * 60 * 60;
    } else if (_fruit == Fruit.Radish) {
        // 3 days
        return 3 * 24 * 60 * 60;
    }

    throw new Error( "INVALID_FRUIT");
}


function getFruitPrice( _fruit:Fruit):BigNumber {
    const decimals:BigNumber = new BigNumber(18);

    if (_fruit == Fruit.Sunflower) {
        // $0.02
        //return 2 * 10**decimals / 100;
        return new BigNumber(2).multipliedBy(new BigNumber(10).pow(decimals)).dividedBy(new BigNumber(100))
    } else if (_fruit == Fruit.Potato) {
        // $0.16
        // return 16 * 10**decimals / 100;
        return new BigNumber(16).multipliedBy(new BigNumber(10).pow(decimals)).dividedBy(new BigNumber(100))
    } else if (_fruit == Fruit.Pumpkin) {
        // $0.80
        // return 80 * 10**decimals / 100;
        return new BigNumber(80).multipliedBy(new BigNumber(10).pow(decimals)).dividedBy(new BigNumber(100))
    } else if (_fruit == Fruit.Beetroot) {
        // $1.8
        //return 180 * 10**decimals / 100;
        return new BigNumber(180).multipliedBy(new BigNumber(10).pow(decimals)).dividedBy(new BigNumber(100))
    } else if (_fruit == Fruit.Cauliflower) {
        // $8
        //return 8 * 10**decimals;
        return new BigNumber(8).multipliedBy(new BigNumber(10).pow(decimals))

    } else if (_fruit == Fruit.Parsnip) {
        // $16
        //return 16 * 10**decimals;
        return new BigNumber(16).multipliedBy(new BigNumber(10).pow(decimals))

    } else if (_fruit == Fruit.Radish) {
        // $80
        //return 80 * 10**decimals;
        return new BigNumber(80).multipliedBy(new BigNumber(10).pow(decimals))
    }

    throw new Error("INVALID_FRUIT");
}

function getLandPrice(landSize: number) :BigNumber {
    const decimals: BigNumber = new BigNumber(18)
    if (landSize <= 5) {
        // $1
        //return 1 * 10**decimals;
        return new BigNumber(1).multipliedBy(new BigNumber(10).pow(decimals));
    } else if (landSize <= 8) {
        // 50
        //return 50 * 10**decimals;
        return new BigNumber(50).multipliedBy(new BigNumber(10).pow(decimals));
    } else if (landSize <= 11) {
        // $500
        //return 500 * 10**decimals;
        return new BigNumber(500).multipliedBy(new BigNumber(10).pow(decimals));

    }
    
    // $2500
    //return 2500 * 10**decimals;
    return new BigNumber(2500).multipliedBy(new BigNumber(10).pow(decimals));

}

async function levelUp (event, repository:Repository) {

    const address = event.address
    const farm:Farm = await repository.getFarm(address)
    if (farm) {
        if (farm.land.length > 17) {
            throw new Error('Farm Max Level reached')
        }
        const price: BigNumber = getLandPrice(farm.land.length)
        const fmcPrice: BigNumber = await getMarketPrice(price, repository);
        const balance = new BigNumber(farm.inventory.balance)
        if (balance.lt(fmcPrice)) {
            throw new Error("INSUFFICIENT_FUNDS")
        }
        const updatedBalance = balance.minus(fmcPrice)
        const sunFlower: Square = new Square();
        sunFlower.fruit = Fruit.Sunflower
        sunFlower.createdAt = 0 // Make them immediately harvestable in case they spent all their tokens

        for (let index = 0; index < 3; index++) {
            farm.land.push(sunFlower);
        }

        farm.inventory.balance = updatedBalance.toString()

        const updatedFarm = await repository.saveFarm(address, farm)
        return {
            statusCode: 200,
            body: {
                farm: updatedFarm
            }
        };
    } else {
        throw new Error("No Farm")
    }
    
}
async function sync (event, repository:Repository) {
    const address = event.address
    const actions:UserAction[]  = event.actions;

    const farm:Farm = await repository.getFarm(address)
    let balance = new BigNumber(farm.inventory.balance)
    console.log('Actions to process: ', actions)
    for (let i = 0; i < actions.length; i++) {
        const act:UserAction = actions[i]
        const thirtyMinutesAgoSeconds = Math.floor(DateTime.now().minus( { minutes : 30 }).toSeconds())
        if (act.createdAt < thirtyMinutesAgoSeconds) {
            throw new Error("EVENT_EXPIRED");
        }
        if (act.createdAt < farm.syncedAt) {
            throw new Error(`EVENT_IN_PAST: event ${act.createdAt} farm: ${farm.syncedAt}` ) 
        }
        const now = nowInSeconds()
        if (act.createdAt > now) {
            throw new Error(`EVENT_IN_FUTURE: now ${now} createdAt ${act.createdAt}`)
        }

        if (i > 0) {
            if (!(act.createdAt >= actions[i - 1].createdAt)) {
                throw new Error("INVALID_ORDER")
            }
        }

        if (act.action == Action.Plant) {
            if (farm.land.length < requiredLandSize(act.fruit)) {
                throw new Error(`invalid level current level ${farm.land.length}, required: ${requiredLandSize(act.fruit)}`)
            }
            const price: BigNumber = getSeedPrice(act.fruit);
            const fmcPrice = await getMarketPrice(price, repository);
            if (fmcPrice.gt(balance)) {
                throw new Error(`Not balance ${balance} to but seed at price ${fmcPrice.toString()}`)
            }
            balance = balance.minus(fmcPrice)
            const plantedSeed:Square = new Square()
            plantedSeed.fruit = act.fruit
            plantedSeed.createdAt = nowInSeconds()
            farm.land[act.landIndex] = plantedSeed;

        } else if(act.action == Action.Harvest) {
            const square:Square = farm.land[act.landIndex]
            if (square.fruit == Fruit.None) {
                throw new Error(`No Fruit`)
            }
            const duration:number = act.createdAt - square.createdAt
            const secondsToHarvest:number = getHarvestSeconds(square.fruit);
            if(!(duration >= secondsToHarvest)) {
                throw new Error(`NOT_RIPE duration ${duration} second to harvest ${secondsToHarvest}`)
            }
            // Clear the land
            const empty:Square = new Square()
            empty.fruit = Fruit.None
            empty.createdAt = 0
            farm.land[act.landIndex] = empty;

            const price:BigNumber = getFruitPrice(square.fruit);
            const fmcPrice:BigNumber = await getMarketPrice(price, repository);

            console.log('Balance ' + balance.toString() + ' fmcPrice ' + fmcPrice.toString())
            balance = balance.plus(fmcPrice)
        }
    }
    const prevBalance = new BigNumber(farm.inventory.balance)
    const resultofActions = balance.minus(prevBalance)
    repository.updateTotalSupply(resultofActions)
    farm.inventory.balance = balance.toString()
    farm.syncedAt = nowInSeconds()

    await repository.saveFarm(address, farm)

    return {
        statusCode: 200,
        body: {}
    };
    
}


async function createFarm(event, repository:Repository): Promise<any> {
    const address = event.address;
            
    const empty = {
        fruit: Fruit.None,
        createdAt: 0
    } as Square;
    const sunflower = {
        fruit: Fruit.Sunflower,
        createdAt: 0
    } as Square;
    const land: Square[] = []
    // Each farmer starts with 5 fields & 3 Sunflowers
    land.push(empty);
    land.push(sunflower);
    land.push(sunflower);
    land.push(sunflower);
    land.push(empty);
    
    const newFarm = {
        land: land,
        inventory : {
            balance: new BigNumber(127).times(new BigNumber(10).pow(18)).toString()  
        }
    } as Farm
    newFarm.syncedAt =  nowInSeconds();
    newFarm.recoveryTime = {}
    newFarm.lastReward = 0
    await repository.createFarm(address, newFarm)
    
    const response = {
        statusCode: 200,
        body: [],
    };
    return response;
}

export function nowInSeconds(): number {
    return Math.floor(DateTime.now().toSeconds())
}

const constructorRepository = new Repository()
const constructorStaker = new Staker(constructorRepository)

exports.handler = provideHandle(constructorRepository, constructorStaker);
exports.provideHandle = provideHandle;

async function craft(event: any, repository: Repository) {
    const {address, resource, amount} = event;

    const safeAmount =  new BigNumber(amount).dividedBy(new BigNumber(10).pow(18));

    const recipe:Recipe = recipes.find( r => r.address === resource)
    if (recipe) {
        const farm:Farm = await repository.getFarm(address)
        const inventory = farm.inventory
        for (let i = 0; i < recipe.ingredients.length; i++) {
            const ing:Ingredient = recipe.ingredients[i]
            let name = ing.name
            if (name == "$SFF") {
                name = "balance"
            }
            if (inventory[name]) {
                const amountResource = new BigNumber(inventory[name])
                const cost = new BigNumber(ing.amount).multipliedBy(new BigNumber(10).pow(18)).multipliedBy(safeAmount)
                console.log(`ingredient ${name} cost ${cost.toString()} in inventory ${amountResource.toString()}`)
                if (amountResource.gte(cost)) {
                    const balanceAfterSpent = amountResource.minus(cost)
                    inventory[name] = balanceAfterSpent.toString()
                } else {
                    throw new Error("NOT ENOUGH " + name + ' cost ' + cost.toString())
                }
            } else {
                throw new Error("NO BALANCE " + name)
            }
        }
        //add resource
        if (inventory[recipe.name]) {
            const current = new BigNumber(inventory[recipe.name])
            const updated = current.plus(amount)
            inventory[recipe.name] = updated.toString()
        } else {
            inventory[recipe.name] = amount
        }
        await repository.saveFarm(address, farm)
        const response = {
            statusCode: 200,
            body: [],
        };
        return response;

    } else {
        throw new Error("NO_RECIPE")
    }

}

async function itemBalanceOf(event: any, repository: Repository) {
    console.log('itemBalanceOf ', event)
    let resource:any = recipes.find( r => r.address === event.resource)
    if (!resource) {
        resource = items.find( r => r.address === event.resource)
    }
    if (resource) {
        const farm:Farm = await repository.getFarm(event.address);
        let balance = '0'
        if (farm && farm.inventory && farm.inventory[resource.name]) {
            balance = farm.inventory[resource.name]
        }
        const response = {
            statusCode: 200,
            body: balance
        };
        return response;
    } else {
        throw new Error("NO_RESOURCE in item blance: " + event.resource)
    }
}

async function itemTotalSupply(event: any, repository: Repository) {
    console.log('itemTotalSupply  ', event)
    let resource:any = recipes.find( r => r.address === event.resource)
    if (!resource) {
        resource = items.find( r => r.address === event.resource)
    }
    if (resource) {
        const balance = await repository.getResourceTotalSupply(resource.name)
        const response = {
            statusCode: 200,
            body: balance
        };
        return response;
    } else {
        throw new Error("NO_REROURCE:  in total supply " + event.resource)
    } 
}

async function myReward(event: any, repository: Repository): Promise<BigNumber> {
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
    const farm = await repository.getFarm(event.address)
    const lastOpenDate = farm.lastReward
    const threeDaysAgo = nowInSeconds() - (60 * 60 * 24 * 3)
    if (lastOpenDate > threeDaysAgo) {
        throw new Error('No reward ready, last open was ' + lastOpenDate)
    }
    const landSize = farm.land.length
    const farmBalance = new BigNumber(farm.inventory.balance)
    const farmCount = await repository.getFarmCount()
    const farmShare = farmBalance.dividedBy(new BigNumber(farmCount))
    if (landSize <= 5) {
        return farmShare.dividedBy(new BigNumber(10))
    } else if( landSize <= 8) {
        return farmShare.dividedBy(new BigNumber(5))
    } else if( landSize <= 11) {
        return farmShare.dividedBy(new BigNumber(2))
    }
    return farmShare.multipliedBy(new BigNumber(3)).dividedBy(new BigNumber(2))
}

async function receiveReward(event: any, repository: Repository) {
    const reward:BigNumber = await myReward(event, repository)
    if (reward.isPositive) {
        const farm = await repository.getFarm(event.address)
        let balance = new BigNumber(farm.inventory.balance)
        balance = balance.plus(reward)
        farm.inventory.balance = balance.toString()
        farm.lastReward = nowInSeconds()
        repository.saveFarm(event.address, farm)
    } else {
        throw new Error('reward is not positive: ' + reward.toString());
    }
}

async function itemGetAvailable(event: any, staker: Staker) {
    const {address, resource} = event

    const available = await staker.getAvailable(address, resource)

    const response = {
        statusCode: 200,
        body: available,
    };
    return response;
}

async function userVerify(attempToLoginAddress: string, signature: string, repository: Repository) {
    const user = await repository.getUser(attempToLoginAddress)
    if (user) {
        const msgBufferHex = ethUtil.bufferToHex(Buffer.from(user.nonce, 'utf8'));
        const address = sigUtil.recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature
        });

        // The signature verification is successful if the address found with
        // ecrecover matches the initial publicAddress
        if (address.toLowerCase() === attempToLoginAddress.toLowerCase()) {
            const uuid = uuidv4()
            user.session = uuid;
            user.nonce = repository.generateUserNonce()
            await repository.saveUser(user)
            const response = {
                statusCode: 200,
                body: user.session,
            };
            return response;
        } else {
            Promise.reject("user " + attempToLoginAddress + " verification failed")
        }

    } else {
        Promise.reject("user " + attempToLoginAddress + "doesnt exist")
    }

}

async function collectEggs(event: any, repository: Repository) {
    const address = event.address
    const f = await repository.collectEggs(address);

    const response = {
        statusCode: 200,
        body: {
            farm: f
        },
    };
    return response;
}

 async function hatchTime(event: any, repository: Repository): Promise<string> {
    const address = event.address
    const farm = await repository.getFarm(address)

    if (!farm || !farm.recoveryTime) {
        return String(nowInSeconds() - 60 * 60 * 24)
    }
    const recoveryTime:number = farm.recoveryTime["Chicken"]
    if (recoveryTime) {
        return String(recoveryTime - 60 * 60 * 24)
    } else {
        return String(nowInSeconds() - 60 * 60 * 24)
    }
}

