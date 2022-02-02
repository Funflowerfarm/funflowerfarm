'use strict';
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
//https://www.digitalocean.com/community/tutorials/how-to-test-nodejs-apps-using-mocha-chai-and-sinonjs
//https://sinonjs.org/releases/v12.0.1/stubs/
var farm = require('../../index.js');
var expect = require('chai').expect;
var sinon = require("sinon");
var repo = require('../../repository');
var DateTime = require("luxon").DateTime;
var BigNumber = require('bignumber.js').default;
describe('Tests Farm', function () {
    var _this = this;
    it('getLand', function () { return __awaiter(_this, void 0, void 0, function () {
        var address, event, mockRepo, handler, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = "1address";
                    event = {
                        address: address,
                        method: 'getLand'
                    };
                    mockRepo = {
                        getFarm: sinon.stub().withArgs(address).returns({
                            Item: {
                                farm: {
                                    land: []
                                }
                            }
                        })
                    };
                    handler = farm.provideHandle(mockRepo);
                    return [4 /*yield*/, handler(event)];
                case 1:
                    result = _a.sent();
                    expect(result).to.be.an('object');
                    expect(result.statusCode).to.equal(200);
                    response = result.body;
                    expect(response).to.be.an('array');
                    return [2 /*return*/];
            }
        });
    }); });
    it('createFarm', function () { return __awaiter(_this, void 0, void 0, function () {
        var address, event, mockRepo, handler, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    address = "1address";
                    event = {
                        address: address,
                        method: 'createFarm'
                    };
                    mockRepo = sinon.mock(repo);
                    handler = farm.provideHandle(mockRepo);
                    return [4 /*yield*/, handler(event)];
                case 1:
                    result = _a.sent();
                    expect(result).to.be.an('object');
                    expect(result.statusCode).to.equal(200);
                    response = result.body;
                    expect(response).to.be.an('array');
                    return [2 /*return*/];
            }
        });
    }); });
    it('sync', function () { return __awaiter(_this, void 0, void 0, function () {
        var actions, address, event, mockRepo, handler, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actions = [
                        {
                            "action": 1,
                            "fruit": "0",
                            "landIndex": 1,
                            "createdAt": nowSeconds()
                        },
                        {
                            "action": 1,
                            "fruit": "0",
                            "landIndex": 2,
                            "createdAt": nowSeconds()
                        },
                        {
                            "action": 1,
                            "fruit": "0",
                            "landIndex": 3,
                            "createdAt": nowSeconds()
                        }
                    ];
                    address = "1address";
                    event = {
                        address: address,
                        method: 'sync',
                        actions: actions
                    };
                    mockRepo = {
                        getFarm: sinon.stub().returns(getTestFarm()),
                        totalSupply: sinon.stub().returns(new BigNumber(0)),
                        updateTotalSupply: sinon.stub(),
                        saveFarm: sinon.stub()
                    };
                    handler = farm.provideHandle(mockRepo);
                    return [4 /*yield*/, handler(event)];
                case 1:
                    result = _a.sent();
                    expect(result).to.be.an('object');
                    expect(result.statusCode).to.equal(200);
                    console.log(mockRepo.getFarm.args[0]);
                    console.log(mockRepo.totalSupply.args[0]);
                    console.log(mockRepo.updateTotalSupply.args[0][0].toString());
                    console.log(mockRepo.saveFarm.args[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    function getTestFarm() {
        return {
            "inventory": {
                "balance": "0"
            },
            "land": [
                {
                    "createdAt": 0,
                    "fruit": "0"
                },
                {
                    "createdAt": 0,
                    "fruit": "1"
                },
                {
                    "createdAt": 0,
                    "fruit": "1"
                },
                {
                    "createdAt": 0,
                    "fruit": "1"
                },
                {
                    "createdAt": 0,
                    "fruit": "0"
                }
            ],
            "syncedAt": nowSeconds()
        };
    }
    function nowSeconds() {
        return Math.floor(DateTime.now().toSeconds());
    }
});
