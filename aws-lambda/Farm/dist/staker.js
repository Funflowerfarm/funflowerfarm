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
exports.Staker = void 0;
var crafting_1 = require("./crafting");
var bignumber_js_1 = require("bignumber.js");
var index_1 = require("./index");
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
;
var Wood = /** @class */ (function () {
    function Wood(r) {
        // How long it takes
        this.RECOVERY_SECONDS = new bignumber_js_1.default(3600);
        // How much wood a tree has
        this.STRENGTH = new bignumber_js_1.default(10).multipliedBy(new bignumber_js_1.default(10).pow(18)); //10 * (10**18);
        this.requires = 'Axe';
        this.repo = r;
    }
    Wood.prototype.getAvailable = function (farm) {
        /*uint recoveredAt = recoveryTime[account];
        
        if (block.timestamp > recoveredAt) {
            return STRENGTH;
        }
        
        // A portion of the resource is available
        uint difference = recoveredAt - block.timestamp;
        uint secondsRecovered = RECOVERY_SECONDS - difference;
        
        return STRENGTH * secondsRecovered / RECOVERY_SECONDS;*/
        if (!farm.recoveryTime[Wood.name]) {
            return this.STRENGTH;
        }
        var recoveredAt = farm.recoveryTime[Wood.name];
        if ((0, index_1.nowInSeconds)() > recoveredAt) {
            return this.STRENGTH;
        }
        var diff = recoveredAt - (0, index_1.nowInSeconds)();
        var secondsRecovered = this.RECOVERY_SECONDS.minus(new bignumber_js_1.default(diff));
        return this.STRENGTH.multipliedBy(secondsRecovered).dividedBy(this.RECOVERY_SECONDS);
    };
    Wood.prototype.stake = function (address, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var farm, available, newAvailable, amountToRecover, timeToRecover, multiplier, total, current, updated, updatedrequire;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repo.getFarm(address)];
                    case 1:
                        farm = _a.sent();
                        available = this.getAvailable(farm);
                        if (available.lte(amount)) {
                            throw new Error("No Wood replenished, available ".concat(available.toString(), " amount ").concat(amount.toString()));
                        }
                        newAvailable = available.minus(amount);
                        amountToRecover = this.STRENGTH.minus(newAvailable);
                        timeToRecover = this.RECOVERY_SECONDS.multipliedBy(amountToRecover).dividedBy(this.STRENGTH);
                        //save recovery time
                        farm.recoveryTime[Wood.name] = (0, index_1.nowInSeconds)() + timeToRecover.toNumber();
                        multiplier = new bignumber_js_1.default(randomInt(3, 5));
                        total = amount.multipliedBy(multiplier);
                        if (farm.inventory[Wood.name]) {
                            current = new bignumber_js_1.default(farm.inventory[Wood.name]);
                            updated = current.plus(total);
                            farm.inventory[Wood.name] = updated.toString();
                        }
                        else {
                            farm.inventory[Wood.name] = total.toString();
                        }
                        updatedrequire = new bignumber_js_1.default(farm.inventory[this.requires]).minus(amount);
                        farm.inventory[this.requires] = updatedrequire.toString();
                        return [4 /*yield*/, this.repo.saveFarm(address, farm)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Wood;
}());
var Staker = /** @class */ (function () {
    function Staker(r) {
        this.repo = r;
        this.stakeMap = new Map();
        this.stakeMap.set(Wood.name, new Wood(this.repo));
    }
    Staker.prototype.stake = function (address, resourceAddress, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var item, stackeable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("stake ".concat(address, " resource ").concat(resourceAddress, " amount ").concat(amount));
                        item = crafting_1.items.find(function (x) { return x.address == resourceAddress; });
                        stackeable = this.stakeMap.get(item.name);
                        if (!stackeable) return [3 /*break*/, 2];
                        return [4 /*yield*/, stackeable.stake(address, new bignumber_js_1.default(amount))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2: throw new Error("Not Known resoucrce " + resourceAddress);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Staker;
}());
exports.Staker = Staker;
