//https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html

import BigNumber from 'bignumber.js';
import {Farm} from './farm'
import {User} from './User'
const { DateTime } = require("luxon");

import { nowInSeconds } from './index';
import { DynamoDBClient, ExecuteStatementInput } from "@aws-sdk/client-dynamodb"; 
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"; 

const client = new DynamoDBClient({region: 'us-west-1'});

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: true, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

const dynamo = DynamoDBDocument.from(client, translateConfig);


const farmGameTable = 'farm-game';

const farmPrimaryKey = 'farm-game/Farm';

const totalSupplyPrimaryKey = 'farm-game/TotalSupply';
const supplySecondary = 'Supply';

const farmCounter = 'FarmCounter';

const userPrimaryKey = 'farm-game/User';


export class Repository {

    async collectEggs(address: string) : Promise<Farm> {
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

    const recoveryTimeEgg = 60 * 60 * 24

    const farm = await this.getFarm(address)

    let lastRecovery = farm.recoveryTime["Chicken"] 
    if (!lastRecovery) {
      lastRecovery = nowInSeconds()
    }
    if (nowInSeconds() <= lastRecovery) {
      Promise.reject("You have to wait 24 hours before you can collect eggs")
    }

    if (!farm.inventory["Chicken"]) {
      Promise.reject("No Chicken")
    }

    const nChickens = new BigNumber(farm.inventory["Chicken"]);

    let multiplier = new BigNumber(1)

    if (nChickens.isZero()) {
      Promise.reject("No Chicken")
    }

    if (farm.inventory["Chicken coop"]) {
      const nCoop = new BigNumber(farm.inventory["Chicken coop"]);
      if (nCoop.gte(new BigNumber(1))) {
        multiplier = new BigNumber(3)
      }
    }

    const eggs = nChickens.multipliedBy(multiplier)
    
    if (farm.inventory["Egg"]) {
      let current = new BigNumber(farm.inventory["Egg"])
      current = current.plus(eggs)
      farm.inventory["Egg"] = current.toString()
    } else {
      farm.inventory["Egg"] = eggs.toString()
    }

    farm.recoveryTime["Chicken"] = nowInSeconds() + recoveryTimeEgg

    await this.saveFarm(address, farm)
    return farm
    }

    generateUserNonce(): string {
      return String(Math.floor(Math.random() * 1000000))
    }

    async saveUser(user: User) {
      await dynamo
      .put({
        TableName: farmGameTable,
        Item: {
          p: userPrimaryKey,
          s: user.address.toLowerCase(),
          user: user
        }
      })
    }

    async createUser(address: string): Promise<User> {
      const nonce = this.generateUserNonce()
      const newUser = new User()
      newUser.address = address.toLowerCase()
      newUser.nonce = '' + nonce
      newUser.createdAt = DateTime.now().toString();
      newUser.lastLogin = DateTime.now().toString();
      
      await this.saveUser(newUser)
      
      return newUser;
    }

    async getUser(address: string) : Promise<User | undefined> {
      const result = await dynamo
      .get({
        TableName: farmGameTable,
        Key: {
          p: userPrimaryKey,
          s: address.toLowerCase()
        }
      })
    
      if (result.Item) {
        return result.Item.user as User
      } else {
        return undefined
      }
    }

    async getFarmCount() : Promise<number> {
      const result = await dynamo
      .get({
        TableName: farmGameTable,
        Key: {
          p: totalSupplyPrimaryKey,
          s: farmCounter
        }
      })
    
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
    
      if (result.Item) {
        return result.Item.supply.toString()
      } else {
        return '0'
      }
    }

  async  updateTotalSupply(resultofActions: BigNumber) {
    const ra:string = BigInt(resultofActions.integerValue().toString()).toString()

    const sql = `UPDATE "farm-game" SET supply= supply + ${ra} WHERE p='${totalSupplyPrimaryKey}' AND s='${supplySecondary}'`

    const stmt:ExecuteStatementInput = {
      Statement : sql,
      ConsistentRead: true
    }
    console.log("Execute: " + sql)
    await dynamo.executeStatement(stmt)
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

    if (result.Item) {
      return result.Item.farm as Farm
    } else {
      return undefined
    }

}

  async createFarm(address: string, newFarm : Farm) {
      const farm = await this.getFarm(address)
      if(!farm) {
        await this.saveFarm(address, newFarm)
        await this.incFarmCount()
      } else {
        Promise.reject("Already exist a farm for  adddress " + address)
      }
  }

  async saveFarm(address: string, farm : Farm): Promise<Farm> {
    await dynamo
    .put({
      TableName: farmGameTable,
      Item: {
        p: farmPrimaryKey,
        s: address,
        farm: farm
      }
    })
    return farm;
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

  if (result.Item) {
    return new BigNumber(result.Item.supply)
  } else {
    return new BigNumber(0)
  }
}
}