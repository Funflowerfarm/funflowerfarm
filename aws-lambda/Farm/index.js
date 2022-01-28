

const repo = require('./repository');
const BigNumber = require("bignumber.js");
const { syncBuiltinESMExports } = require('module');

const Fruit = {
    None: "0",
    Sunflower: "1",
    Potato: "2",
    Pumpkin: "3",
    Beetroot: "4",
    Cauliflower: "5",
    Parsnip: "6",
    Radish: "7",
  }


function provideHandle(repository) {
    return async (event) => {
        
        if (event.method === 'getLand') {
            const address = event.address;
            const result = await repository.getFarm(address)
            if (result.Item) {
                const response = {
                    statusCode: 200,
                    body:result.Item.farm.land,
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
            const address = event.address;
            
            const empty = {
                fruit: Fruit['None'],
                createdAt: 0
            };
            const sunflower = {
                fruit: Fruit['Sunflower'],
                createdAt: 0
            };
            const land = []
            // Each farmer starts with 5 fields & 3 Sunflowers
            land.push(empty);
            land.push(sunflower);
            land.push(sunflower);
            land.push(sunflower);
            land.push(empty);
            
            const newFarm = {
                land: land,
                inventory : {
                    balance: BigNumber(127).times(BigNumber(10).pow(18)).toString()  
                }
            }
            
            await repository.createFarm(address, newFarm)
            
            const response = {
                statusCode: 200,
                body: [],
            };
            return response;
        } else if (event.method === 'token/balanceOf') {
            const address = event.address;
            const result = await repository.getFarm(address)
            const balance = result.Item.farm.inventory.balance
            const response = {
                statusCode: 200,
                body: balance,
            };
            return response;
        } else if (event.method === 'sync') {
            return sync(event);
        } else {
            const response = {
                statusCode: 200,
                body: `Not known method ${event.method}`,
            };
            return response;   
        }
    };
};


function sync (event) {
    console.log("sync")
    
}

exports.handler = provideHandle(repo);
exports.provideHandle = provideHandle;
