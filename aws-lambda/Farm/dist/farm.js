"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAction = exports.Inventory = exports.Square = exports.Farm = exports.Action = exports.Fruit = void 0;
var Fruit;
(function (Fruit) {
    Fruit["None"] = "0";
    Fruit["Sunflower"] = "1";
    Fruit["Potato"] = "2";
    Fruit["Pumpkin"] = "3";
    Fruit["Beetroot"] = "4";
    Fruit["Cauliflower"] = "5";
    Fruit["Parsnip"] = "6";
    Fruit["Radish"] = "7";
})(Fruit = exports.Fruit || (exports.Fruit = {}));
var Action;
(function (Action) {
    Action[Action["Plant"] = 0] = "Plant";
    Action[Action["Harvest"] = 1] = "Harvest";
})(Action = exports.Action || (exports.Action = {}));
class Farm {
    land;
    inventory;
    syncedAt;
    recoveryTime;
    lastReward;
}
exports.Farm = Farm;
class Square {
    createdAt;
    fruit;
}
exports.Square = Square;
class Inventory {
    balance;
}
exports.Inventory = Inventory;
class UserAction {
    action;
    fruit;
    landIndex;
    createdAt;
}
exports.UserAction = UserAction;
