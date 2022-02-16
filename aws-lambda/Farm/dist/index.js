"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowInSeconds = void 0;
var ethUtil = __importStar(require("ethereumjs-util"));
var uuid_1 = require("uuid");
var sigUtil = __importStar(require("eth-sig-util"));
var repository_1 = require("./repository");
var staker_1 = require("./staker");
var bignumber_js_1 = require("bignumber.js");
var farm_1 = require("./farm");
var luxon_1 = require("luxon");
var crafting_1 = require("./crafting");
function provideHandle(repository, staker) {
    var _this = this;
    return function (event) { return __awaiter(_this, void 0, void 0, function () {
        var address, user, response, address, signature, response, toVerify, response, response, address, farm, response, response, address, farm, balance, response, r, address, resource, amount, response, e_1, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.address = event.address.toLowerCase();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 17, , 18]);
                    console.log("event m ".concat(event.method, " s ").concat(event.authToken));
                    if (!(event.method === 'userNonce')) return [3 /*break*/, 5];
                    address = event.address.toLowerCase();
                    return [4 /*yield*/, repository.getUser(address)];
                case 2:
                    user = _a.sent();
                    if (!!user) return [3 /*break*/, 4];
                    return [4 /*yield*/, repository.createUser(address)];
                case 3:
                    user = _a.sent();
                    _a.label = 4;
                case 4:
                    response = {
                        statusCode: 200,
                        body: user.nonce,
                    };
                    return [2 /*return*/, response];
                case 5:
                    if (!(event.method === 'userVerify')) return [3 /*break*/, 7];
                    debugger;
                    address = event.address.toLowerCase();
                    signature = event.signature;
                    return [4 /*yield*/, userVerify(address, signature, repository)];
                case 6:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 7: return [4 /*yield*/, repository.getUser(event.address)];
                case 8:
                    toVerify = _a.sent();
                    if (!toVerify) {
                        response = {
                            statusCode: 401,
                            body: 'User doesnt exist ' + event.address,
                        };
                        return [2 /*return*/, response];
                    }
                    if (toVerify.session != event.authToken) {
                        response = {
                            statusCode: 401,
                            body: 'Invalid session' + event.address,
                        };
                        return [2 /*return*/, response];
                    }
                    if (!(event.method === 'getLand')) return [3 /*break*/, 10];
                    address = event.address;
                    return [4 /*yield*/, repository.getFarm(address)];
                case 9:
                    farm = _a.sent();
                    if (farm) {
                        response = {
                            statusCode: 200,
                            body: farm.land,
                        };
                        return [2 /*return*/, response];
                    }
                    else {
                        response = {
                            statusCode: 200,
                            body: [],
                        };
                        return [2 /*return*/, response];
                    }
                    return [3 /*break*/, 16];
                case 10:
                    if (!(event.method === 'createFarm')) return [3 /*break*/, 11];
                    return [2 /*return*/, createFarm(event, repository)];
                case 11:
                    if (!(event.method === 'token/balanceOf')) return [3 /*break*/, 13];
                    address = event.address;
                    return [4 /*yield*/, repository.getFarm(address)];
                case 12:
                    farm = _a.sent();
                    balance = '0';
                    if (farm) {
                        balance = farm.inventory.balance;
                    }
                    response = {
                        statusCode: 200,
                        body: balance,
                    };
                    return [2 /*return*/, response];
                case 13:
                    if (!(event.method === 'totalSupply')) return [3 /*break*/, 15];
                    return [4 /*yield*/, totalSupply(repository)];
                case 14:
                    r = _a.sent();
                    return [2 /*return*/, r];
                case 15:
                    if (event.method === 'sync') {
                        return [2 /*return*/, sync(event, repository)];
                    }
                    else if (event.method === 'itemBalanceOf') {
                        return [2 /*return*/, itemBalanceOf(event, repository)];
                    }
                    else if (event.method === 'craft') {
                        return [2 /*return*/, craft(event, repository)];
                    }
                    else if (event.method === 'receiveReward') {
                        return [2 /*return*/, receiveReward(event, repository)];
                    }
                    else if (event.method === 'myReward') {
                        return [2 /*return*/, myReward(event, repository).then(function (x) {
                                var response = {
                                    statusCode: 200,
                                    body: x.toString(),
                                };
                                return response;
                            })];
                    }
                    else if (event.method === 'hatchTime') {
                        return [2 /*return*/, hatchTime(event, repository).then(function (x) {
                                var response = {
                                    statusCode: 200,
                                    body: x
                                };
                                return response;
                            })];
                    }
                    else if (event.method === 'levelUp') {
                        return [2 /*return*/, levelUp(event, repository)];
                    }
                    else if (event.method === 'itemTotalSupply') {
                        return [2 /*return*/, itemTotalSupply(event, repository)];
                    }
                    else if (event.method === 'itemGetAvailable') {
                        return [2 /*return*/, itemGetAvailable(event, staker)];
                    }
                    else if (event.method === 'collectEggs') {
                        return [2 /*return*/, collectEggs(event, repository)];
                    }
                    else if (event.method === 'stake') {
                        address = event.address;
                        resource = event.resource;
                        amount = event.amount;
                        return [2 /*return*/, staker.stake(address, resource, amount)];
                    }
                    else {
                        response = {
                            statusCode: 200,
                            body: "Not known method ".concat(event.method),
                        };
                        return [2 /*return*/, response];
                    }
                    _a.label = 16;
                case 16: return [3 /*break*/, 18];
                case 17:
                    e_1 = _a.sent();
                    console.error(e_1);
                    response = {
                        statusCode: 500,
                        body: e_1.Message,
                    };
                    return [2 /*return*/, response];
                case 18: return [2 /*return*/];
            }
        });
    }); };
}
;
function totalSupply(repo) {
    return __awaiter(this, void 0, void 0, function () {
        var supply, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, repo.totalSupply()];
                case 1:
                    supply = _a.sent();
                    response = {
                        statusCode: 200,
                        body: supply.toString(),
                    };
                    return [2 /*return*/, response];
            }
        });
    });
}
function getSeedPrice(_fruit) {
    var decimals = new bignumber_js_1.BigNumber(18);
    if (_fruit == farm_1.Fruit.Sunflower) {
        //$0.01
        return new bignumber_js_1.BigNumber(1).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Potato) {
        // $0.10
        //return 10 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(10).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Pumpkin) {
        // $0.40
        // return 40 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(40).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Beetroot) {
        // $1
        // return 1 * 10**decimals;
        return new bignumber_js_1.BigNumber(1).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Cauliflower) {
        // $4
        //return 4 * 10**decimals;
        return new bignumber_js_1.BigNumber(4).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Parsnip) {
        // $10
        //return 10 * 10**decimals;
        return new bignumber_js_1.BigNumber(10).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Radish) {
        // $50
        //return 50 * 10**decimals;
        return new bignumber_js_1.BigNumber(50).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    throw new Error("Unknown price for fruit ".concat(_fruit));
}
function getMarketRate(repo) {
    return __awaiter(this, void 0, void 0, function () {
        var decimals, totalSupply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    decimals = new bignumber_js_1.BigNumber(18);
                    return [4 /*yield*/, repo.totalSupply()];
                case 1:
                    totalSupply = _a.sent();
                    // Less than 100, 000 tokens
                    if (totalSupply.lt(new bignumber_js_1.BigNumber(100000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
                        // 1 Farm Dollar gets you 1 FMC token
                        return [2 /*return*/, new bignumber_js_1.BigNumber(1)];
                    }
                    // Less than 500, 000 tokens
                    //if (totalSupply < (500000 * 10**decimals)) {
                    if (totalSupply.lt(new bignumber_js_1.BigNumber(500000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
                        return [2 /*return*/, new bignumber_js_1.BigNumber(5)];
                    }
                    // Less than 1, 000, 000 tokens
                    //if (totalSupply < (1000000 * 10**decimals)) {
                    if (totalSupply.lt(new bignumber_js_1.BigNumber(1000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
                        return [2 /*return*/, new bignumber_js_1.BigNumber(10)];
                    }
                    // Less than 5, 000, 000 tokens
                    //if (totalSupply < (5000000 * 10**decimals)) {
                    if (totalSupply.lt(new bignumber_js_1.BigNumber(5000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
                        return [2 /*return*/, new bignumber_js_1.BigNumber(50)];
                    }
                    // Less than 10, 000, 000 tokens
                    //if (totalSupply < (10000000 * 10**decimals)) {
                    if (totalSupply.lt(new bignumber_js_1.BigNumber(10000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
                        return [2 /*return*/, new bignumber_js_1.BigNumber(100)];
                    }
                    // Less than 50, 000, 000 tokens
                    //if (totalSupply < (50000000 * 10**decimals)) {
                    if (totalSupply.lt(new bignumber_js_1.BigNumber(50000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
                        return [2 /*return*/, new bignumber_js_1.BigNumber(500)];
                    }
                    // Less than 100, 000, 000 tokens
                    //if (totalSupply < (100000000 * 10**decimals)) {
                    if (totalSupply.lt(new bignumber_js_1.BigNumber(100000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
                        return [2 /*return*/, new bignumber_js_1.BigNumber(1000)];
                    }
                    // Less than 500, 000, 000 tokens
                    // if (totalSupply < (500000000 * 10**decimals)) {
                    if (totalSupply.lt(new bignumber_js_1.BigNumber(500000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
                        return [2 /*return*/, new bignumber_js_1.BigNumber(5000)];
                    }
                    // Less than 1, 000, 000, 000 tokens
                    //if (totalSupply < (1000000000 * 10**decimals)) {
                    if (totalSupply.lt(new bignumber_js_1.BigNumber(1000000000).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)))) {
                        return [2 /*return*/, new bignumber_js_1.BigNumber(10000)];
                    }
                    // 1 Farm Dollar gets you a 0.00001 of a token - Linear growth from here
                    return [2 /*return*/, totalSupply.div(10000)];
            }
        });
    });
}
function requiredLandSize(_fruit) {
    if (_fruit == farm_1.Fruit.Sunflower || _fruit == farm_1.Fruit.Potato) {
        return 5;
    }
    else if (_fruit == farm_1.Fruit.Pumpkin || _fruit == farm_1.Fruit.Beetroot) {
        return 8;
    }
    else if (_fruit == farm_1.Fruit.Cauliflower) {
        return 11;
    }
    else if (_fruit == farm_1.Fruit.Parsnip) {
        return 14;
    }
    else if (_fruit == farm_1.Fruit.Radish) {
        return 17;
    }
    throw new Error("Unknown fruit ".concat(_fruit));
}
function getMarketPrice(price, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var marketRate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMarketRate(repo)];
                case 1:
                    marketRate = _a.sent();
                    return [2 /*return*/, price.div(marketRate)];
            }
        });
    });
}
function getHarvestSeconds(_fruit) {
    if (_fruit == farm_1.Fruit.Sunflower) {
        // 1 minute
        return 1 * 60;
    }
    else if (_fruit == farm_1.Fruit.Potato) {
        // 5 minutes
        return 5 * 60;
    }
    else if (_fruit == farm_1.Fruit.Pumpkin) {
        // 1 hour
        return 1 * 60 * 60;
    }
    else if (_fruit == farm_1.Fruit.Beetroot) {
        // 4 hours
        return 4 * 60 * 60;
    }
    else if (_fruit == farm_1.Fruit.Cauliflower) {
        // 8 hours
        return 8 * 60 * 60;
    }
    else if (_fruit == farm_1.Fruit.Parsnip) {
        // 1 day
        return 24 * 60 * 60;
    }
    else if (_fruit == farm_1.Fruit.Radish) {
        // 3 days
        return 3 * 24 * 60 * 60;
    }
    throw new Error("INVALID_FRUIT");
}
function getFruitPrice(_fruit) {
    var decimals = new bignumber_js_1.BigNumber(18);
    if (_fruit == farm_1.Fruit.Sunflower) {
        // $0.02
        //return 2 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(2).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Potato) {
        // $0.16
        // return 16 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(16).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Pumpkin) {
        // $0.80
        // return 80 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(80).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Beetroot) {
        // $1.8
        //return 180 * 10**decimals / 100;
        return new bignumber_js_1.BigNumber(180).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals)).dividedBy(new bignumber_js_1.BigNumber(100));
    }
    else if (_fruit == farm_1.Fruit.Cauliflower) {
        // $8
        //return 8 * 10**decimals;
        return new bignumber_js_1.BigNumber(8).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Parsnip) {
        // $16
        //return 16 * 10**decimals;
        return new bignumber_js_1.BigNumber(16).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (_fruit == farm_1.Fruit.Radish) {
        // $80
        //return 80 * 10**decimals;
        return new bignumber_js_1.BigNumber(80).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    throw new Error("INVALID_FRUIT");
}
function getLandPrice(landSize) {
    var decimals = new bignumber_js_1.BigNumber(18);
    if (landSize <= 5) {
        // $1
        //return 1 * 10**decimals;
        return new bignumber_js_1.BigNumber(1).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (landSize <= 8) {
        // 50
        //return 50 * 10**decimals;
        return new bignumber_js_1.BigNumber(50).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    else if (landSize <= 11) {
        // $500
        //return 500 * 10**decimals;
        return new bignumber_js_1.BigNumber(500).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
    }
    // $2500
    //return 2500 * 10**decimals;
    return new bignumber_js_1.BigNumber(2500).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
}
function levelUp(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var address, farm, price, fmcPrice, balance, updatedBalance, sunFlower, index, updatedFarm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = event.address;
                    return [4 /*yield*/, repository.getFarm(address)];
                case 1:
                    farm = _a.sent();
                    if (!farm) return [3 /*break*/, 4];
                    if (farm.land.length > 17) {
                        throw new Error('Farm Max Level reached');
                    }
                    price = getLandPrice(farm.land.length);
                    return [4 /*yield*/, getMarketPrice(price, repository)];
                case 2:
                    fmcPrice = _a.sent();
                    balance = new bignumber_js_1.BigNumber(farm.inventory.balance);
                    if (balance.lt(fmcPrice)) {
                        throw new Error("INSUFFICIENT_FUNDS");
                    }
                    updatedBalance = balance.minus(fmcPrice);
                    sunFlower = new farm_1.Square();
                    sunFlower.fruit = farm_1.Fruit.Sunflower;
                    sunFlower.createdAt = 0; // Make them immediately harvestable in case they spent all their tokens
                    for (index = 0; index < 3; index++) {
                        farm.land.push(sunFlower);
                    }
                    farm.inventory.balance = updatedBalance.toString();
                    return [4 /*yield*/, repository.saveFarm(address, farm)];
                case 3:
                    updatedFarm = _a.sent();
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: {
                                farm: updatedFarm
                            }
                        }];
                case 4: throw new Error("No Farm");
            }
        });
    });
}
function sync(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var address, actions, farm, balance, i, act, thirtyMinutesAgoSeconds, now, price, fmcPrice, plantedSeed, square, duration, secondsToHarvest, empty, price, fmcPrice, prevBalance, resultofActions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = event.address;
                    actions = event.actions;
                    return [4 /*yield*/, repository.getFarm(address)];
                case 1:
                    farm = _a.sent();
                    balance = new bignumber_js_1.BigNumber(farm.inventory.balance);
                    console.log('Actions to process: ', actions);
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < actions.length)) return [3 /*break*/, 7];
                    act = actions[i];
                    thirtyMinutesAgoSeconds = Math.floor(luxon_1.DateTime.now().minus({ minutes: 30 }).toSeconds());
                    if (act.createdAt < thirtyMinutesAgoSeconds) {
                        throw new Error("EVENT_EXPIRED");
                    }
                    if (act.createdAt < farm.syncedAt) {
                        throw new Error("EVENT_IN_PAST: event ".concat(act.createdAt, " farm: ").concat(farm.syncedAt));
                    }
                    now = nowInSeconds();
                    if (act.createdAt > now) {
                        throw new Error("EVENT_IN_FUTURE: now ".concat(now, " createdAt ").concat(act.createdAt));
                    }
                    if (i > 0) {
                        if (!(act.createdAt >= actions[i - 1].createdAt)) {
                            throw new Error("INVALID_ORDER");
                        }
                    }
                    if (!(act.action == farm_1.Action.Plant)) return [3 /*break*/, 4];
                    if (farm.land.length < requiredLandSize(act.fruit)) {
                        throw new Error("invalid level current level ".concat(farm.land.length, ", required: ").concat(requiredLandSize(act.fruit)));
                    }
                    price = getSeedPrice(act.fruit);
                    return [4 /*yield*/, getMarketPrice(price, repository)];
                case 3:
                    fmcPrice = _a.sent();
                    if (fmcPrice.gt(balance)) {
                        throw new Error("Not balance ".concat(balance, " to but seed at price ").concat(fmcPrice.toString()));
                    }
                    balance = balance.minus(fmcPrice);
                    plantedSeed = new farm_1.Square();
                    plantedSeed.fruit = act.fruit;
                    plantedSeed.createdAt = nowInSeconds();
                    farm.land[act.landIndex] = plantedSeed;
                    return [3 /*break*/, 6];
                case 4:
                    if (!(act.action == farm_1.Action.Harvest)) return [3 /*break*/, 6];
                    square = farm.land[act.landIndex];
                    if (square.fruit == farm_1.Fruit.None) {
                        throw new Error("No Fruit");
                    }
                    duration = act.createdAt - square.createdAt;
                    secondsToHarvest = getHarvestSeconds(square.fruit);
                    if (!(duration >= secondsToHarvest)) {
                        throw new Error("NOT_RIPE duration ".concat(duration, " second to harvest ").concat(secondsToHarvest));
                    }
                    empty = new farm_1.Square();
                    empty.fruit = farm_1.Fruit.None;
                    empty.createdAt = 0;
                    farm.land[act.landIndex] = empty;
                    price = getFruitPrice(square.fruit);
                    return [4 /*yield*/, getMarketPrice(price, repository)];
                case 5:
                    fmcPrice = _a.sent();
                    console.log('Balance ' + balance.toString() + ' fmcPrice ' + fmcPrice.toString());
                    balance = balance.plus(fmcPrice);
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 2];
                case 7:
                    prevBalance = new bignumber_js_1.BigNumber(farm.inventory.balance);
                    resultofActions = balance.minus(prevBalance);
                    repository.updateTotalSupply(resultofActions);
                    farm.inventory.balance = balance.toString();
                    farm.syncedAt = nowInSeconds();
                    return [4 /*yield*/, repository.saveFarm(address, farm)];
                case 8:
                    _a.sent();
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: {}
                        }];
            }
        });
    });
}
function createFarm(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var address, empty, sunflower, land, newFarm, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = event.address;
                    empty = {
                        fruit: farm_1.Fruit.None,
                        createdAt: 0
                    };
                    sunflower = {
                        fruit: farm_1.Fruit.Sunflower,
                        createdAt: 0
                    };
                    land = [];
                    // Each farmer starts with 5 fields & 3 Sunflowers
                    land.push(empty);
                    land.push(sunflower);
                    land.push(sunflower);
                    land.push(sunflower);
                    land.push(empty);
                    newFarm = {
                        land: land,
                        inventory: {
                            balance: new bignumber_js_1.BigNumber(127).times(new bignumber_js_1.BigNumber(10).pow(18)).toString()
                        }
                    };
                    newFarm.syncedAt = nowInSeconds();
                    newFarm.recoveryTime = {};
                    newFarm.lastReward = 0;
                    return [4 /*yield*/, repository.createFarm(address, newFarm)];
                case 1:
                    _a.sent();
                    response = {
                        statusCode: 200,
                        body: [],
                    };
                    return [2 /*return*/, response];
            }
        });
    });
}
function nowInSeconds() {
    return Math.floor(luxon_1.DateTime.now().toSeconds());
}
exports.nowInSeconds = nowInSeconds;
var constructorRepository = new repository_1.Repository();
var constructorStaker = new staker_1.Staker(constructorRepository);
exports.handler = provideHandle(constructorRepository, constructorStaker);
exports.provideHandle = provideHandle;
function craft(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var address, resource, amount, safeAmount, recipe, farm, inventory, i, ing, name_1, amountResource, cost, balanceAfterSpent, current, updated, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = event.address, resource = event.resource, amount = event.amount;
                    safeAmount = new bignumber_js_1.BigNumber(amount).dividedBy(new bignumber_js_1.BigNumber(10).pow(18));
                    recipe = crafting_1.recipes.find(function (r) { return r.address === resource; });
                    if (!recipe) return [3 /*break*/, 3];
                    return [4 /*yield*/, repository.getFarm(address)];
                case 1:
                    farm = _a.sent();
                    inventory = farm.inventory;
                    for (i = 0; i < recipe.ingredients.length; i++) {
                        ing = recipe.ingredients[i];
                        name_1 = ing.name;
                        if (name_1 == "$SFF") {
                            name_1 = "balance";
                        }
                        if (inventory[name_1]) {
                            amountResource = new bignumber_js_1.BigNumber(inventory[name_1]);
                            cost = new bignumber_js_1.BigNumber(ing.amount).multipliedBy(new bignumber_js_1.BigNumber(10).pow(18)).multipliedBy(safeAmount);
                            console.log("ingredient ".concat(name_1, " cost ").concat(cost.toString(), " in inventory ").concat(amountResource.toString()));
                            if (amountResource.gte(cost)) {
                                balanceAfterSpent = amountResource.minus(cost);
                                inventory[name_1] = balanceAfterSpent.toString();
                            }
                            else {
                                throw new Error("NOT ENOUGH " + name_1 + ' cost ' + cost.toString());
                            }
                        }
                        else {
                            throw new Error("NO BALANCE " + name_1);
                        }
                    }
                    //add resource
                    if (inventory[recipe.name]) {
                        current = new bignumber_js_1.BigNumber(inventory[recipe.name]);
                        updated = current.plus(amount);
                        inventory[recipe.name] = updated.toString();
                    }
                    else {
                        inventory[recipe.name] = amount;
                    }
                    return [4 /*yield*/, repository.saveFarm(address, farm)];
                case 2:
                    _a.sent();
                    response = {
                        statusCode: 200,
                        body: [],
                    };
                    return [2 /*return*/, response];
                case 3: throw new Error("NO_RECIPE");
            }
        });
    });
}
function itemBalanceOf(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var resource, farm, balance, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('itemBalanceOf ', event);
                    resource = crafting_1.recipes.find(function (r) { return r.address === event.resource; });
                    if (!resource) {
                        resource = crafting_1.items.find(function (r) { return r.address === event.resource; });
                    }
                    if (!resource) return [3 /*break*/, 2];
                    return [4 /*yield*/, repository.getFarm(event.address)];
                case 1:
                    farm = _a.sent();
                    balance = '0';
                    if (farm && farm.inventory && farm.inventory[resource.name]) {
                        balance = farm.inventory[resource.name];
                    }
                    response = {
                        statusCode: 200,
                        body: balance
                    };
                    return [2 /*return*/, response];
                case 2: throw new Error("NO_RESOURCE in item blance: " + event.resource);
            }
        });
    });
}
function itemTotalSupply(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var resource, balance, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('itemTotalSupply  ', event);
                    resource = crafting_1.recipes.find(function (r) { return r.address === event.resource; });
                    if (!resource) {
                        resource = crafting_1.items.find(function (r) { return r.address === event.resource; });
                    }
                    if (!resource) return [3 /*break*/, 2];
                    return [4 /*yield*/, repository.getResourceTotalSupply(resource.name)];
                case 1:
                    balance = _a.sent();
                    response = {
                        statusCode: 200,
                        body: balance
                    };
                    return [2 /*return*/, response];
                case 2: throw new Error("NO_REROURCE:  in total supply " + event.resource);
            }
        });
    });
}
function myReward(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var farm, lastOpenDate, threeDaysAgo, landSize, farmBalance, farmCount, farmShare;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, repository.getFarm(event.address)];
                case 1:
                    farm = _a.sent();
                    lastOpenDate = farm.lastReward;
                    threeDaysAgo = nowInSeconds() - (60 * 60 * 24 * 3);
                    if (lastOpenDate > threeDaysAgo) {
                        throw new Error('No reward ready, last open was ' + lastOpenDate);
                    }
                    landSize = farm.land.length;
                    farmBalance = new bignumber_js_1.BigNumber(farm.inventory.balance);
                    return [4 /*yield*/, repository.getFarmCount()];
                case 2:
                    farmCount = _a.sent();
                    farmShare = farmBalance.dividedBy(new bignumber_js_1.BigNumber(farmCount));
                    if (landSize <= 5) {
                        return [2 /*return*/, farmShare.dividedBy(new bignumber_js_1.BigNumber(10))];
                    }
                    else if (landSize <= 8) {
                        return [2 /*return*/, farmShare.dividedBy(new bignumber_js_1.BigNumber(5))];
                    }
                    else if (landSize <= 11) {
                        return [2 /*return*/, farmShare.dividedBy(new bignumber_js_1.BigNumber(2))];
                    }
                    return [2 /*return*/, farmShare.multipliedBy(new bignumber_js_1.BigNumber(3)).dividedBy(new bignumber_js_1.BigNumber(2))];
            }
        });
    });
}
function receiveReward(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var reward, farm, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, myReward(event, repository)];
                case 1:
                    reward = _a.sent();
                    if (!reward.isPositive) return [3 /*break*/, 3];
                    return [4 /*yield*/, repository.getFarm(event.address)];
                case 2:
                    farm = _a.sent();
                    balance = new bignumber_js_1.BigNumber(farm.inventory.balance);
                    balance = balance.plus(reward);
                    farm.inventory.balance = balance.toString();
                    farm.lastReward = nowInSeconds();
                    repository.saveFarm(event.address, farm);
                    return [3 /*break*/, 4];
                case 3: throw new Error('reward is not positive: ' + reward.toString());
                case 4: return [2 /*return*/];
            }
        });
    });
}
function itemGetAvailable(event, staker) {
    return __awaiter(this, void 0, void 0, function () {
        var address, resource, available, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = event.address, resource = event.resource;
                    return [4 /*yield*/, staker.getAvailable(address, resource)];
                case 1:
                    available = _a.sent();
                    response = {
                        statusCode: 200,
                        body: available,
                    };
                    return [2 /*return*/, response];
            }
        });
    });
}
function userVerify(attempToLoginAddress, signature, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var user, msgBufferHex, address, uuid, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, repository.getUser(attempToLoginAddress)];
                case 1:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 5];
                    msgBufferHex = ethUtil.bufferToHex(Buffer.from(user.nonce, 'utf8'));
                    address = sigUtil.recoverPersonalSignature({
                        data: msgBufferHex,
                        sig: signature
                    });
                    if (!(address.toLowerCase() === attempToLoginAddress.toLowerCase())) return [3 /*break*/, 3];
                    uuid = (0, uuid_1.v4)();
                    user.session = uuid;
                    user.nonce = repository.generateUserNonce();
                    return [4 /*yield*/, repository.saveUser(user)];
                case 2:
                    _a.sent();
                    response = {
                        statusCode: 200,
                        body: user.session,
                    };
                    return [2 /*return*/, response];
                case 3:
                    Promise.reject("user " + attempToLoginAddress + " verification failed");
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    Promise.reject("user " + attempToLoginAddress + "doesnt exist");
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function collectEggs(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var address, f, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = event.address;
                    return [4 /*yield*/, repository.collectEggs(address)];
                case 1:
                    f = _a.sent();
                    response = {
                        statusCode: 200,
                        body: {
                            farm: f
                        },
                    };
                    return [2 /*return*/, response];
            }
        });
    });
}
function hatchTime(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var address, farm, recoveryTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = event.address;
                    return [4 /*yield*/, repository.getFarm(address)];
                case 1:
                    farm = _a.sent();
                    if (!farm || !farm.recoveryTime) {
                        return [2 /*return*/, String(nowInSeconds() - 60 * 60 * 24)];
                    }
                    recoveryTime = farm.recoveryTime["Chicken"];
                    if (recoveryTime) {
                        return [2 /*return*/, String(recoveryTime - 60 * 60 * 24)];
                    }
                    else {
                        return [2 /*return*/, String(nowInSeconds() - 60 * 60 * 24)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
