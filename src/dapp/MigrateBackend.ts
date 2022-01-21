const axios = require('axios');

axios.defaults.baseURL = 'https://64kfdvk6me.execute-api.us-west-1.amazonaws.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.post('/prod/farm-game/token', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log('RESPONSE', response);
  })
  .catch(function (error) {
    console.log(error);
  });

/*function  MigrateBackendToken(tokenContract: any) : any {
    const methods  = Object.keys(tokenContract.methods)
    methods.forEach(m => {
      // example returns "270059999999999999800"
      tokenContract.methods["!balanceOf"] = function(account) {
        const call = async function () {
          return "270059999999999999800";
        }
        return {
          call: call
        }
      }
      const allow:Array<string> = Array.of("balanceOf")
      if(allow.includes(m)) {
        return
      }
      tokenContract.methods[m] = function() {console.log(`${m} not implemented`)}
    })
    return tokenContract;
  }*/

  function  MigrateBackendToken(tokenContract: any) : any {
    const methods  = Object.keys(tokenContract.methods)
    methods.forEach(m => {

        function balanceOf(args) {
            return axios.post('/prod/farm-game/token', {
                firstName: 'Fred',
                lastName: 'Flintstone'
              })
              .then(function (response) {
                return new Promise(function(resolve, reject) {
                     resolve(response.data.body);
                  });
              })
        }
      const proxy = new Proxy(tokenContract.methods[m], {
        apply(target, thisArg, args) {
            console.log(`MigrateBackendToken function ${m}`, args)
            const result = target(...args)
            //
            const resultProxyCall = new Proxy(result.call, {
                apply(target, thisArg, args) {
                    let result = null
                    if (m === 'balanceOf') {
                        result = balanceOf(args)
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
    const methods  = Object.keys(tokenContract.methods)
    methods.forEach(m => {
        /*
      // example returns "270059999999999999800"
      tokenContract.methods["!balanceOf"] = function(account) {
        const call = async function () {
          return "270059999999999999800";
        }
        return {
          call: call
        }
      }
      const allow:Array<string> = Array.of("getLand")
      if(allow.includes(m)) {
        return
      }
      tokenContract.methods[m] = function() {console.log(`${m} not implemented`)}*/
      const proxy = new Proxy(tokenContract.methods[m], {
        apply(target, thisArg, args) {
            console.log(`MigrateBackendFarm function ${m}`, args)
            const result = target(...args)
            //
            const resultProxyCall = new Proxy(result.call, {
                apply(target, thisArg, args) {
                    //console.log(`MigrateBackendFarm call ${target} ${m}`, args)
                    const result = target(...args)
                    console.log(`result MigrateBackendFarm call ${m}`, result)
                    return result;
                }
              });
              result.call = resultProxyCall
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
    const methods  = Object.keys(tokenContract.methods)
    methods.forEach(m => {
      const proxy = new Proxy(tokenContract.methods[m], {
        apply(target, thisArg, args) {
            console.log(`MigrateBackendItem ${tokenContract._address} function ${m}`, args)
            const result = target(...args)
            //
            const resultProxyCall = new Proxy(result.call, {
                apply(target, thisArg, args) {
                    const result = target(...args)
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