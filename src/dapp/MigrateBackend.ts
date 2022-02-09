import { EventEmitter } from "stream";

const axios = require('axios');
const Web3PromiEvent = require('web3-core-promievent')

//axios.defaults.baseURL = 'https://64kfdvk6me.execute-api.us-west-1.amazonaws.com';
axios.defaults.baseURL = 'http://localhost:3001';

axios.defaults.headers.post['Content-Type'] = 'application/json';


  function  MigrateBackendToken(tokenContract: any) : any {
    function balanceOf(args) {
        return axios.post('/prod/farm-game/farm', {
            address: args[0].from,
            method: 'token/balanceOf'
          })
          .then(function (response) {
            return new Promise(function(resolve, reject) {
                 resolve(response.data.body);
              });
          })
    }

      function totalSupply(m, args) {
    return axios.post('/prod/farm-game/farm', {
        method: m
      }).then( r => {
        return new Promise(async (resolve, reject) => {
          resolve(r.data.body)
        })
      })
}

    const methods  = Object.keys(tokenContract.methods)
    methods.forEach(m => {
      const proxy = new Proxy(tokenContract.methods[m], {
        apply(target, thisArg, args) {
            console.log(`MigrateBackendToken function ${m}`, args)

            // get the method *.methods.balanceOf for example
            const result = target(...args)

            // then *.methods.balanceOf.call
            const resultProxyCall = new Proxy(result.call, {
                apply(target, thisArg, args) {
                    let result = null
                    if (m === 'balanceOf') {
                        result = balanceOf(args)
                    } else if (m === 'totalSupply') {
                      result = totalSupply(m, args)
                    } else {
                        result = target(...args)
                    }
                    console.log(`result MigrateBackendToken ${m}` , result)
                    return result;
                }
              });
              result.call = resultProxyCall
            return result;
        }
      });
      tokenContract.methods[m] = proxy
    })
    return tokenContract;
  }

  function  MigrateBackendFarm(tokenContract: any) : any {

    function sendPostWithPromi(sendArgs, method, args) {
      const postPromise =  axios.post('/prod/farm-game/farm', {...{
        method: method,
        address: sendArgs[0].from
      }, ...args});
      const promi = Web3PromiEvent()
      postPromise.then(function() {
        console.log(`create ${method} promise`, postPromise)
        promi.eventEmitter.emit("receipt", { myReceipt : {}})
      })
      return promi.eventEmitter;
    }

    function levelUp(args) {

       return sendPostWithPromi(args, 'levelUp', {})
    }

    function createFarm(args) {
       return sendPostWithPromi(args, 'createFarm', {})
    }

    function receiveReward(args) {
      return sendPostWithPromi(args, 'receiveReward', {})
   }

    function sync(args, sendArgs) {
      return sendPostWithPromi(sendArgs, 'sync', {actions: args[0]})
    }

    function stake(args, sendArgs) {
        return sendPostWithPromi(sendArgs, 'stake', {
          resource: args[0], 
          amount: args[1]
        }
      )
    }

    function craft(args, sendArgs) {
      const resource = args[0]
      let amount = '1000000000000000000'
      if (args.length == 2) {
        amount = args[1]
      }
      return sendPostWithPromi(sendArgs, 'craft', {resource: resource, amount: amount})
    }


    function getLand(m, args) {
      return axios.post('/prod/farm-game/farm', {
          method: m,
          address: args[0].from
        }).then( r => {
          return new Promise(async (resolve, reject) => {
            resolve(r.data.body)
          })
        })
     }

     function myReward(m, args) {
      return axios.post('/prod/farm-game/farm', {
          method: m,
          address: args[0].from
        }).then( r => {
          return new Promise(async (resolve, reject) => {
            resolve(r.data.body)
          })
        })
     }

      

    const methods  = Object.keys(tokenContract.methods)
    methods.forEach(m => {
        /*
      tokenContract.methods[m] = function() {console.log(`${m} not implemented`)}*/
      const proxy = new Proxy(tokenContract.methods[m], {
        apply(target, thisArg, args) {
            console.log(`MigrateBackendFarm function ${m}`, args)
            const result = target(...args)
            //
            const resultProxyCall = new Proxy(result.call, {
                apply(target, thisArg, args) {
                    //console.log(`MigrateBackendFarm call ${target} ${m}`, args)
                    let result = null
                    if (m === 'getLand') {
                        result = getLand(m, args)
                    } else if (m === 'myReward') {
                      result = myReward(m, args)
                    } else {
                        result = target(...args)
                    }
                    console.log(`result MigrateBackendFarm call ${m}`, result)
                    return result;
                }
              });

              result.call = resultProxyCall

              const resultProxySend = new Proxy(result.send, {
                apply(target, thisArg, sendArgs) {
                    //console.log(`MigrateBackendFarm send ${target} ${m}`, args)
                    let result = null
                    if (m === 'createFarm') {
                      result = createFarm(sendArgs);
                    }else if (m === 'craft') {
                      result = craft(args, sendArgs);
                    } else if (m === 'receiveReward') {
                      result = receiveReward(sendArgs);
                    } else if (m === 'sync') {
                      result = sync(args, sendArgs);
                    } else if (m === 'levelUp') {
                      result = levelUp(sendArgs);
                    } else if (m === 'stake') {
                      result = stake(args, sendArgs);
                    } else {
                      result = target(...sendArgs)//
                    }
                    console.log(`result MigrateBackendFarm send ${m}`, result)
                    /*resultProxySend.on = new Proxy(resultProxySend.on, {
                      apply(onFunctionTarget, onFunctionThis, onFunctionArgs) {
                        debugger;
                      }
                    })*/
                    return result;
                }
              });

              result.send = resultProxySend
            //
            //console.log(`result MigrateBackendFarm ${m}` , result)
            return result;
        }
      });
      tokenContract.methods[m] = proxy
    })
    return tokenContract;
  }


  function  MigrateBackendItem(tokenContract: any) : any {

    function itemBalanceOf(args, resource) {
      return axios.post('/prod/farm-game/farm', {
          address: args[0].from,
          resource: resource,
          method: 'itemBalanceOf'
        })
        .then(function (response) {
          return new Promise(function(resolve, reject) {
               resolve(response.data.body);
            });
        })
  }

  function itemTotalSupply(args, resource) {
    return axios.post('/prod/farm-game/farm', {
        address: args[0].from,
        resource: resource,
        method: 'itemTotalSupply'
      })
      .then(function (response) {
        return new Promise(function(resolve, reject) {
             resolve(response.data.body);
          });
      })
}

    const methods  = Object.keys(tokenContract.methods)
    methods.forEach(m => {
      const proxy = new Proxy(tokenContract.methods[m], {
        apply(target, thisArg, args) {
            console.log(`MigrateBackendItem ${tokenContract._address} function ${m}`, args)
            const result = target(...args)
            //
            const resultProxyCall = new Proxy(result.call, {
                apply(target, thisArg, args) {
                    let result 
                    if (m === 'balanceOf') {
                      result = itemBalanceOf(args, tokenContract._address)
                  } else if(m === 'totalSupply') {
                    result = itemTotalSupply(args, tokenContract._address)
                  } else {
                      result = target(...args)
                  }

                    
                    console.log(`result MigrateBackendItem ${tokenContract._address} function ${m}`, result)
                    return result;
                }
              });
              result.call = resultProxyCall
            return result;
        }
      });
      tokenContract.methods[m] = proxy
    })
    return tokenContract;
  }

  export {
    MigrateBackendToken,
    MigrateBackendFarm,
    MigrateBackendItem
  }