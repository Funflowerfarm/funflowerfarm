

const repo = require('./repository');
var BigNumber = require('big-number');


function provideHandle(repository) {
    return async (event) => {
        
        if (event.method === 'getLand') {
            const address = event.address;
            const result = await repository.getLand(address)
            const response = {
                statusCode: 200,
                body:result.Item.farm.land,
            };
            return response;
        } else if (event.method === 'createFarm') {
            const address = event.address;
            
            const empty = {
                fruit: 'None',
                createdAt: 0
            };
            const sunflower = {
                fruit: 'Sunflower',
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
                balance: BigNumber(0)
            }
            
            await repository.createFarm(address, newFarm)
            
            const response = {
                statusCode: 200,
                body: [],
            };
            return response;
        } else {
            const response = {
                statusCode: 200,
                body: `Not known method ${event.method}`,
            };
            return response;   
        }
    };
};

exports.handler = provideHandle(repo);
exports.provideHandle = provideHandle;
