//https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html

import BigNumber from 'bignumber.js';
import {Farm} from './farm'

const access = 'AKIASXZ3APWM7CLXODHH'
const key = 'RVVA7KAqUV4bQe5d44Rkjkfrj5veslK+yWcKJqpN'

const AWS = require("aws-sdk");
AWS.config.update({region:'us-west-1',
accessKeyId: access,
accessSecretKey: key
});

const dynamo = new AWS.DynamoDB.DocumentClient();

const farmGameTable = 'farm-game';

const farmPrimaryKey = 'farm-game/Farm';

const totalSupplyPrimaryKey = 'farm-game/TotalSupply';
const supplySecondary = 'Supply';

const farmCounter = 'FarmCounter';


export class Repository {

    async getFarmCount() : Promise<number> {
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
        return result.Item.counter
      } else {
        return 0
      }
    }

    async incFarmCount() : Promise<number> {
      let counter = await this.getFarmCount()
      counter++
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

      return counter
    }

    async getResourceTotalSupply(name: string): Promise<string> {
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
        return result.Item.supply
      } else {
        return '0'
      }
    }

  async  updateTotalSupply(resultofActions: BigNumber) {
    let supply = await this.totalSupply()
    supply = supply.plus(resultofActions)
    
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

 async getFarm(address): Promise<Farm | undefined> {
    const result = await dynamo
    .get({
      TableName: farmGameTable,
      Key: {
        p: farmPrimaryKey,
        s: address
      }
    })
    .promise() 

    if (result.Item) {
      return result.Item.farm as Farm
    } else {
      return undefined
    }

}

  async createFarm(address: string, newFarm : Farm) {
      await this.saveFarm(address, newFarm)
      await this.incFarmCount()
  }

  async saveFarm(address: string, farm : Farm) {
    return dynamo
    .put({
      TableName: farmGameTable,
      Item: {
        p: farmPrimaryKey,
        s: address,
        farm: farm
      }
    })
    .promise(); 
}

async totalSupply(): Promise<BigNumber> {
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
    return new BigNumber(result.Item.supply)
  } else {
    return new BigNumber(0)
  }
}
}