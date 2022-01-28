'use strict';
//https://www.digitalocean.com/community/tutorials/how-to-test-nodejs-apps-using-mocha-chai-and-sinonjs
//https://sinonjs.org/releases/v12.0.1/stubs/

const farm = require('../../index.js');
const chai = require('chai');
const sinon = require("sinon");
const repo = require('../../repository');

const expect = chai.expect;

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
        const address = "1address"
        const event = {
            address : address,
            method: 'sync',
            actions: []
        }
        const mockRepo =  sinon.mock(repo)
        const handler = farm.provideHandle(mockRepo);
        const result = await handler(event)


        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);

        let response = result.body;
    });
});
