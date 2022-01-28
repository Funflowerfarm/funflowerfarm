//https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html


const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const farmGameTable = 'farm-game';

const farmPrimaryKey = 'farm-game/Farm';

exports.getFarm = async function (address) {
    return dynamo
    .get({
      TableName: farmGameTable,
      Key: {
        p: farmPrimaryKey,
        s: address
      }
    })
    .promise()  
}

exports.createFarm = async function (address, newFarm) {
    return dynamo
    .put({
      TableName: farmGameTable,
      Item: {
        p: farmPrimaryKey,
        s: address,
        farm: newFarm
      }
    })
    .promise(); 
}