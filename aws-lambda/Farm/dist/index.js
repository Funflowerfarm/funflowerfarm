"use strict";
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
var repository_1 = require("./repository");
var bignumber_js_1 = require("bignumber.js");
var farm_1 = require("./farm");
var luxon_1 = require("luxon");
var crafting_1 = require("./crafting");
function provideHandle(repository) {
    var _this = this;
    return function (event) { return __awaiter(_this, void 0, void 0, function () {
        var address, farm, response, response, address, farm, balance, response, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(event.method === 'getLand')) return [3 /*break*/, 2];
                    address = event.address;
                    return [4 /*yield*/, repository.getFarm(address)];
                case 1:
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
                    return [3 /*break*/, 8];
                case 2:
                    if (!(event.method === 'createFarm')) return [3 /*break*/, 3];
                    return [2 /*return*/, createFarm(event, repository)];
                case 3:
                    if (!(event.method === 'token/balanceOf')) return [3 /*break*/, 5];
                    address = event.address;
                    return [4 /*yield*/, repository.getFarm(address)];
                case 4:
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
                case 5:
                    if (!(event.method === 'totalSupply')) return [3 /*break*/, 7];
                    return [4 /*yield*/, totalSupply(repository)];
                case 6: return [2 /*return*/, _a.sent()];
                case 7:
                    if (event.method === 'sync') {
                        return [2 /*return*/, sync(event, repository)];
                    }
                    else if (event.method === 'craft') {
                        return [2 /*return*/, craft(event, repository)];
                    }
                    else if (event.method === 'levelUp') {
                        return [2 /*return*/, levelUp(event, repository)];
                    }
                    else {
                        response = {
                            statusCode: 200,
                            body: "Not known method ".concat(event.method),
                        };
                        return [2 /*return*/, response];
                    }
                    _a.label = 8;
                case 8: return [2 /*return*/];
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
                        body: supply,
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
        var address, farm, price, fmcPrice, balance, updatedBalance, sunFlower, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = event.address;
                    return [4 /*yield*/, repository.getFarm(address)];
                case 1:
                    farm = _a.sent();
                    if (!farm) return [3 /*break*/, 3];
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
                    repository.saveFarm(address, farm);
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: {}
                        }];
                case 3: throw new Error("No Farm");
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
                        throw new Error("invalid level");
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
exports.handler = provideHandle(new repository_1.Repository());
exports.provideHandle = provideHandle;
function craft(event, repository) {
    return __awaiter(this, void 0, void 0, function () {
        var address, resource, amount, safeAmount, recipe, farm, inventory, i, ing, name_1, amountResource, cost, balanceAfterSpent, current, updated, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debugger;
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
                case 4:
                    console.log("craft event", event);
                    return [2 /*return*/];
            }
        });
    });
}
