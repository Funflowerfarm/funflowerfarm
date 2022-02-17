"use strict";
//https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const User_1 = require("./User");
const { DateTime } = require("luxon");
const access = 'AKIASXZ3APWM7CLXODHH';
const key = 'RVVA7KAqUV4bQe5d44Rkjkfrj5veslK+yWcKJqpN';
//const AWS = require("aws-sdk");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const _1 = require(".");
aws_sdk_1.default.config.update({ region: 'us-west-1'
});
const dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
const farmGameTable = 'farm-game';
const farmPrimaryKey = 'farm-game/Farm';
const totalSupplyPrimaryKey = 'farm-game/TotalSupply';
const supplySecondary = 'Supply';
const farmCounter = 'FarmCounter';
const userPrimaryKey = 'farm-game/User';
class Repository {
    async collectEggs(address) {
        /*  uint chickens = super.balanceOf(msg.sender);
      require(chickens > 0, "You have no chickens");
      require(block.timestamp - _hatchedAt[msg.sender] > 60 * 60 * 24, "You have to wait 24 hours before you can collect eggs");
  
      // It is actually ERC721 but same principle
      uint coop = ERC20(_coop).balanceOf(msg.sender);
  
      uint multiplier = 1;
      if (coop >= 1) {
        multiplier = 3;
      }
  
      _hatchedAt[msg.sender] = block.timestamp;
  
      Egg(_egg).mint(msg.sender, chickens * multiplier);*/
        const recoveryTimeEgg = 60 * 60 * 24;
        const farm = await this.getFarm(address);
        let lastRecovery = farm.recoveryTime["Chicken"];
        if (!lastRecovery) {
            lastRecovery = (0, _1.nowInSeconds)();
        }
        if ((0, _1.nowInSeconds)() <= lastRecovery) {
            Promise.reject("You have to wait 24 hours before you can collect eggs");
        }
        if (!farm.inventory["Chicken"]) {
            Promise.reject("No Chicken");
        }
        const nChickens = new bignumber_js_1.default(farm.inventory["Chicken"]);
        let multiplier = new bignumber_js_1.default(1);
        if (nChickens.isZero()) {
            Promise.reject("No Chicken");
        }
        if (farm.inventory["Chicken coop"]) {
            const nCoop = new bignumber_js_1.default(farm.inventory["Chicken coop"]);
            if (nCoop.gte(new bignumber_js_1.default(1))) {
                multiplier = new bignumber_js_1.default(3);
            }
        }
        const eggs = nChickens.multipliedBy(multiplier);
        if (farm.inventory["Egg"]) {
            let current = new bignumber_js_1.default(farm.inventory["Egg"]);
            current = current.plus(eggs);
            farm.inventory["Egg"] = current.toString();
        }
        else {
            farm.inventory["Egg"] = eggs.toString();
        }
        farm.recoveryTime["Chicken"] = (0, _1.nowInSeconds)() + recoveryTimeEgg;
        await this.saveFarm(address, farm);
        return farm;
    }
    generateUserNonce() {
        return String(Math.floor(Math.random() * 1000000));
    }
    async saveUser(user) {
        await dynamo
            .put({
            TableName: farmGameTable,
            Item: {
                p: userPrimaryKey,
                s: user.address.toLowerCase(),
                user: user
            }
        })
            .promise();
    }
    async createUser(address) {
        const nonce = this.generateUserNonce();
        const newUser = new User_1.User();
        newUser.address = address.toLowerCase();
        newUser.nonce = '' + nonce;
        newUser.createdAt = DateTime.now().toString();
        newUser.lastLogin = DateTime.now().toString();
        await this.saveUser(newUser);
        return newUser;
    }
    async getUser(address) {
        const result = await dynamo
            .get({
            TableName: farmGameTable,
            Key: {
                p: userPrimaryKey,
                s: address.toLowerCase()
            }
        })
            .promise();
        if (result.Item) {
            return result.Item.user;
        }
        else {
            return undefined;
        }
    }
    async getFarmCount() {
        const result = await dynamo
            .get({
            TableName: farmGameTable,
            Key: {
                p: totalSupplyPrimaryKey,
                s: farmCounter
            }
        })
            .promise();
        if (result.Item) {
            return result.Item.counter;
        }
        else {
            return 0;
        }
    }
    async incFarmCount() {
        let counter = await this.getFarmCount();
        counter++;
        await dynamo
            .put({
            TableName: farmGameTable,
            Item: {
                p: totalSupplyPrimaryKey,
                s: farmCounter,
                counter: counter
            }
        })
            .promise();
        return counter;
    }
    async getResourceTotalSupply(name) {
        //TODO: implement the add / minus supply of resource
        const result = await dynamo
            .get({
            TableName: farmGameTable,
            Key: {
                p: totalSupplyPrimaryKey,
                s: supplySecondary + '/' + name
            }
        })
            .promise();
        if (result.Item) {
            return result.Item.supply;
        }
        else {
            return '0';
        }
    }
    async updateTotalSupply(resultofActions) {
        let supply = await this.totalSupply();
        supply = supply.plus(resultofActions);
        await dynamo
            .put({
            TableName: farmGameTable,
            Item: {
                p: totalSupplyPrimaryKey,
                s: supplySecondary,
                supply: supply.toString()
            }
        })
            .promise();
    }
    async getFarm(address) {
        const result = await dynamo
            .get({
            TableName: farmGameTable,
            Key: {
                p: farmPrimaryKey,
                s: address
            }
        })
            .promise();
        if (result.Item) {
            return result.Item.farm;
        }
        else {
            return undefined;
        }
    }
    async createFarm(address, newFarm) {
        const farm = await this.getFarm(address);
        if (!farm) {
            await this.saveFarm(address, newFarm);
            await this.incFarmCount();
        }
        else {
            Promise.reject("Already exist a farm for  adddress " + address);
        }
    }
    async saveFarm(address, farm) {
        await dynamo
            .put({
            TableName: farmGameTable,
            Item: {
                p: farmPrimaryKey,
                s: address,
                farm: farm
            }
        })
            .promise();
        return farm;
    }
    async totalSupply() {
        const result = await dynamo
            .get({
            TableName: farmGameTable,
            Key: {
                p: totalSupplyPrimaryKey,
                s: supplySecondary
            }
        })
            .promise();
        if (result.Item) {
            return new bignumber_js_1.default(result.Item.supply);
        }
        else {
            return new bignumber_js_1.default(0);
        }
    }
}
exports.Repository = Repository;
