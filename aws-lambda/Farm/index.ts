

import { Repository } from './repository';
import { Staker } from './staker';
import {BigNumber} from 'bignumber.js';
import {Farm, Square, Fruit, UserAction, Action} from './farm';
import { DateTime } from 'luxon'

import {Ingredient, Recipe, recipes, items} from './crafting'



function provideHandle(repository: Repository, staker: Staker) {
    return async (event) => {
        try {
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
                return await  totalSupply(repository);
            } else if (event.method === 'sync') {
                return sync(event, repository);
            } else if (event.method === 'itemBalanceOf') {
                return itemBalanceOf(event, repository);
            } else if (event.method === 'craft') {
                return craft(event, repository);
            } else if (event.method === 'levelUp') {
                return levelUp(event, repository);
            } else if (event.method === 'itemTotalSupply') {
                return itemTotalSupply(event, repository);
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
        body: supply,
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

        repository.saveFarm(address, farm)
        return {
            statusCode: 200,
            body: {}
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
