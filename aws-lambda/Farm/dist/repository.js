"use strict";
//https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var User_1 = require("./User");
var DateTime = require("luxon").DateTime;
var access = 'AKIASXZ3APWM7CLXODHH';
var key = 'RVVA7KAqUV4bQe5d44Rkjkfrj5veslK+yWcKJqpN';
//const AWS = require("aws-sdk");
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var _1 = require(".");
aws_sdk_1.default.config.update({ region: 'us-west-1'
});
var dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
var farmGameTable = 'farm-game';
var farmPrimaryKey = 'farm-game/Farm';
var totalSupplyPrimaryKey = 'farm-game/TotalSupply';
var supplySecondary = 'Supply';
var farmCounter = 'FarmCounter';
var userPrimaryKey = 'farm-game/User';
var Repository = /** @class */ (function () {
    function Repository() {
    }
    Repository.prototype.collectEggs = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var recoveryTimeEgg, farm, lastRecovery, nChickens, multiplier, nCoop, eggs, current;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recoveryTimeEgg = 60 * 60 * 24;
                        return [4 /*yield*/, this.getFarm(address)];
                    case 1:
                        farm = _a.sent();
                        lastRecovery = farm.recoveryTime["Chicken"];
                        if (!lastRecovery) {
                            lastRecovery = (0, _1.nowInSeconds)();
                        }
                        if ((0, _1.nowInSeconds)() <= lastRecovery) {
                            Promise.reject("You have to wait 24 hours before you can collect eggs");
                        }
                        if (!farm.inventory["Chicken"]) {
                            Promise.reject("No Chicken");
                        }
                        nChickens = new bignumber_js_1.default(farm.inventory["Chicken"]);
                        multiplier = new bignumber_js_1.default(1);
                        if (nChickens.isZero()) {
                            Promise.reject("No Chicken");
                        }
                        if (farm.inventory["Chicken coop"]) {
                            nCoop = new bignumber_js_1.default(farm.inventory["Chicken coop"]);
                            if (nCoop.gte(new bignumber_js_1.default(1))) {
                                multiplier = new bignumber_js_1.default(3);
                            }
                        }
                        eggs = nChickens.multipliedBy(multiplier);
                        if (farm.inventory["Egg"]) {
                            current = new bignumber_js_1.default(farm.inventory["Egg"]);
                            current = current.plus(eggs);
                            farm.inventory["Egg"] = current.toString();
                        }
                        else {
                            farm.inventory["Egg"] = eggs.toString();
                        }
                        farm.recoveryTime["Chicken"] = (0, _1.nowInSeconds)() + recoveryTimeEgg;
                        return [4 /*yield*/, this.saveFarm(address, farm)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, farm];
                }
            });
        });
    };
    Repository.prototype.generateUserNonce = function () {
        return String(Math.floor(Math.random() * 1000000));
    };
    Repository.prototype.saveUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dynamo
                            .put({
                            TableName: farmGameTable,
                            Item: {
                                p: userPrimaryKey,
                                s: user.address.toLowerCase(),
                                user: user
                            }
                        })
                            .promise()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.createUser = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonce = this.generateUserNonce();
                        newUser = new User_1.User();
                        newUser.address = address.toLowerCase();
                        newUser.nonce = '' + nonce;
                        newUser.createdAt = DateTime.now().toString();
                        newUser.lastLogin = DateTime.now().toString();
                        return [4 /*yield*/, this.saveUser(newUser)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, newUser];
                }
            });
        });
    };
    Repository.prototype.getUser = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dynamo
                            .get({
                            TableName: farmGameTable,
                            Key: {
                                p: userPrimaryKey,
                                s: address.toLowerCase()
                            }
                        })
                            .promise()];
                    case 1:
                        result = _a.sent();
                        if (result.Item) {
                            return [2 /*return*/, result.Item.user];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.getFarmCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dynamo
                            .get({
                            TableName: farmGameTable,
                            Key: {
                                p: totalSupplyPrimaryKey,
                                s: farmCounter
                            }
                        })
                            .promise()];
                    case 1:
                        result = _a.sent();
                        if (result.Item) {
                            return [2 /*return*/, result.Item.counter];
                        }
                        else {
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.incFarmCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var counter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFarmCount()];
                    case 1:
                        counter = _a.sent();
                        counter++;
                        return [4 /*yield*/, dynamo
                                .put({
                                TableName: farmGameTable,
                                Item: {
                                    p: totalSupplyPrimaryKey,
                                    s: farmCounter,
                                    counter: counter
                                }
                            })
                                .promise()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, counter];
                }
            });
        });
    };
    Repository.prototype.getResourceTotalSupply = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dynamo
                            .get({
                            TableName: farmGameTable,
                            Key: {
                                p: totalSupplyPrimaryKey,
                                s: supplySecondary + '/' + name
                            }
                        })
                            .promise()];
                    case 1:
                        result = _a.sent();
                        if (result.Item) {
                            return [2 /*return*/, result.Item.supply];
                        }
                        else {
                            return [2 /*return*/, '0'];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.updateTotalSupply = function (resultofActions) {
        return __awaiter(this, void 0, void 0, function () {
            var supply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.totalSupply()];
                    case 1:
                        supply = _a.sent();
                        supply = supply.plus(resultofActions);
                        return [4 /*yield*/, dynamo
                                .put({
                                TableName: farmGameTable,
                                Item: {
                                    p: totalSupplyPrimaryKey,
                                    s: supplySecondary,
                                    supply: supply.toString()
                                }
                            })
                                .promise()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.getFarm = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dynamo
                            .get({
                            TableName: farmGameTable,
                            Key: {
                                p: farmPrimaryKey,
                                s: address
                            }
                        })
                            .promise()];
                    case 1:
                        result = _a.sent();
                        if (result.Item) {
                            return [2 /*return*/, result.Item.farm];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.createFarm = function (address, newFarm) {
        return __awaiter(this, void 0, void 0, function () {
            var farm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFarm(address)];
                    case 1:
                        farm = _a.sent();
                        if (!!farm) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.saveFarm(address, newFarm)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.incFarmCount()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        Promise.reject("Already exist a farm for  adddress " + address);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.saveFarm = function (address, farm) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dynamo
                            .put({
                            TableName: farmGameTable,
                            Item: {
                                p: farmPrimaryKey,
                                s: address,
                                farm: farm
                            }
                        })
                            .promise()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, farm];
                }
            });
        });
    };
    Repository.prototype.totalSupply = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dynamo
                            .get({
                            TableName: farmGameTable,
                            Key: {
                                p: totalSupplyPrimaryKey,
                                s: supplySecondary
                            }
                        })
                            .promise()];
                    case 1:
                        result = _a.sent();
                        if (result.Item) {
                            return [2 /*return*/, new bignumber_js_1.default(result.Item.supply)];
                        }
                        else {
                            return [2 /*return*/, new bignumber_js_1.default(0)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Repository;
}());
exports.Repository = Repository;
