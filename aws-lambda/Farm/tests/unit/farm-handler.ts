'use strict';

import { Repository } from "../../repository";

//https://www.digitalocean.com/community/tutorials/how-to-test-nodejs-apps-using-mocha-chai-and-sinonjs
//https://sinonjs.org/releases/v12.0.1/stubs/

const farm = require('../../index.js');
const {expect} = require('chai');
const sinon = require("sinon");
const repo = require('../../repository');
const { DateTime } = require("luxon");
const { default: BigNumber } = require('bignumber.js');


describe('Tests Farm', function () {
    it('getLand', async () => {
        const address = "1address"
        const event = {
            address : address,
            method: 'getLand'
        }
        const mockRepo =  {
            getFarm: sinon.stub().withArgs(address).returns({
                Item : {
                    farm: {
                        land : []
                    }
                }
            })
        }
        const handler = farm.provideHandle(mockRepo);
        const result = await handler(event)


        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);

        let response = result.body;
        expect(response).to.be.an('array')
    });


    it('createFarm', async () => {
        const address = "1address"
        const event = {
            address : address,
            method: 'createFarm'
        }
        const mockRepo =  sinon.mock(repo)
        const handler = farm.provideHandle(mockRepo);
        const result = await handler(event)


        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);

        let response = result.body;
        expect(response).to.be.an('array')
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
        ]
        
        const address = "1address"
        const event = {
            address : address,
            method: 'sync',
            actions: actions
        }
        const mockRepo = {
            getFarm: sinon.stub().returns(getTestFarm()),
            totalSupply: sinon.stub().returns(new BigNumber(0)),
            updateTotalSupply: sinon.stub(),
            saveFarm: sinon.stub()
        }
        const handler = farm.provideHandle(mockRepo);
        const result = await handler(event)


        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);

        console.log(mockRepo.getFarm.args[0])
        console.log(mockRepo.totalSupply.args[0])
        console.log(mockRepo.updateTotalSupply.args[0][0].toString())
        console.log(mockRepo.saveFarm.args[0])

    });



    function getTestFarm() {
        return  {
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
            }   
    }

    function nowSeconds() {
        return Math.floor(DateTime.now().toSeconds())
    }
});
