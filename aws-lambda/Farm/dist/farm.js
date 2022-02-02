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
var Farm = /** @class */ (function () {
    function Farm() {
    }
    return Farm;
}());
exports.Farm = Farm;
var Square = /** @class */ (function () {
    function Square() {
    }
    return Square;
}());
exports.Square = Square;
var Inventory = /** @class */ (function () {
    function Inventory() {
    }
    return Inventory;
}());
exports.Inventory = Inventory;
var UserAction = /** @class */ (function () {
    function UserAction() {
    }
    return UserAction;
}());
exports.UserAction = UserAction;
