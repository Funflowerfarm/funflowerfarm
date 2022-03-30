'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
//https://www.digitalocean.com/community/tutorials/how-to-test-nodejs-apps-using-mocha-chai-and-sinonjs
//https://sinonjs.org/releases/v12.0.1/stubs/
const farm = require('../../index.js');
const { expect } = require('chai');
const sinon = require("sinon");
const repo = require('../../repository');
const { DateTime } = require("luxon");
const { default: BigNumber } = require('bignumber.js');
process.env['AWS_ACCESS_KEY_ID'] = 'AKIASXZ3APWM7CLXODHH';
process.env['AWS_SECRET_ACCESS_KEY'] = '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';
process.env['FFF_TEST'] = 'true';
describe('Tests Farm', function () {
    it.only('test bug in sync', async () => {
        debugger;
        const event = {
            "method": "sync",
            "address": "0x92bC55a44409412959E3652Cc31e5bB77C443798",
            "actions": [
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 1,
                    "createdAt": 1646680490
                },
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 2,
                    "createdAt": 1646680492
                },
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 0,
                    "createdAt": 1646680493
                },
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 3,
                    "createdAt": 1646680494
                },
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 4,
                    "createdAt": 1646680495
                },
                {
                    "action": 1,
                    "fruit": "0",
                    "landIndex": 0,
                    "createdAt": 1646680644
                },
                {
                    "action": 1,
                    "fruit": "0",
                    "landIndex": 2,
                    "createdAt": 1646680645
                },
                {
                    "action": 1,
                    "fruit": "0",
                    "landIndex": 1,
                    "createdAt": 1646680646
                },
                {
                    "action": 1,
                    "fruit": "0",
                    "landIndex": 4,
                    "createdAt": 1646680646
                },
                {
                    "action": 1,
                    "fruit": "0",
                    "landIndex": 3,
                    "createdAt": 1646680647
                },
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 0,
                    "createdAt": 1646680650
                },
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 2,
                    "createdAt": 1646680651
                },
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 3,
                    "createdAt": 1646680651
                },
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 1,
                    "createdAt": 1646680652
                },
                {
                    "action": 0,
                    "fruit": "1",
                    "landIndex": 4,
                    "createdAt": 1646680652
                }
            ],
            "authToken": "f0f24bca-ddba-4849-8d1b-d18558756305"
        };
        const handler = farm.handler;
        const result = await handler(event);
        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        let response = result.body;
        expect(response).to.be.an('array');
    });
    it('getLand', async () => {
        const address = "1address";
        const event = {
            address: address,
            method: 'getLand'
        };
        const mockRepo = {
            getFarm: sinon.stub().withArgs(address).returns({
                Item: {
                    farm: {
                        land: []
                    }
                }
            })
        };
        const handler = farm.provideHandle(mockRepo);
        const result = await handler(event);
        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        let response = result.body;
        expect(response).to.be.an('array');
    });
    it('createFarm', async () => {
        const address = "1address";
        const event = {
            address: address,
            method: 'createFarm'
        };
        const mockRepo = sinon.mock(repo);
        const handler = farm.provideHandle(mockRepo);
        const result = await handler(event);
        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        let response = result.body;
        expect(response).to.be.an('array');
    });
    it('sync', async () => {
        const actions = [
            {
                "action": 1,
                "fruit": "0",
                "landIndex": 1,
                "createdAt": nowSeconds()
            },
            {
                "action": 1,
                "fruit": "0",
                "landIndex": 2,
                "createdAt": nowSeconds()
            },
            {
                "action": 1,
                "fruit": "0",
                "landIndex": 3,
                "createdAt": nowSeconds()
            }
        ];
        const address = "1address";
        const event = {
            address: address,
            method: 'sync',
            actions: actions
        };
        const mockRepo = {
            getFarm: sinon.stub().returns(getTestFarm()),
            totalSupply: sinon.stub().returns(new BigNumber(0)),
            updateTotalSupply: sinon.stub(),
            saveFarm: sinon.stub()
        };
        const handler = farm.provideHandle(mockRepo);
        const result = await handler(event);
        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        console.log(mockRepo.getFarm.args[0]);
        console.log(mockRepo.totalSupply.args[0]);
        console.log(mockRepo.updateTotalSupply.args[0][0].toString());
        console.log(mockRepo.saveFarm.args[0]);
    });
    function getTestFarm() {
        return {
            "inventory": {
                "balance": "0"
            },
            "land": [
                {
                    "createdAt": 0,
                    "fruit": "0"
                },
                {
                    "createdAt": 0,
                    "fruit": "1"
                },
                {
                    "createdAt": 0,
                    "fruit": "1"
                },
                {
                    "createdAt": 0,
                    "fruit": "1"
                },
                {
                    "createdAt": 0,
                    "fruit": "0"
                }
            ],
            "syncedAt": nowSeconds()
        };
    }
    function nowSeconds() {
        return Math.floor(DateTime.now().toSeconds());
    }
});
