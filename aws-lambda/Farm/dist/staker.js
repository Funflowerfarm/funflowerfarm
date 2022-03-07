"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staker = void 0;
const crafting_1 = require("./crafting");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const index_1 = require("./index");
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
;
class Wood {
    repo;
    // How long it takes
    RECOVERY_SECONDS = new bignumber_js_1.default(3600);
    // How much wood a tree has
    STRENGTH = new bignumber_js_1.default(10).multipliedBy(new bignumber_js_1.default(10).pow(18)); //10 * (10**18);
    requires = 'Axe';
    constructor(r) {
        this.repo = r;
    }
    getAvailable(farm) {
        /*uint recoveredAt = recoveryTime[account];
        
        if (block.timestamp > recoveredAt) {
            return STRENGTH;
        }
        
        // A portion of the resource is available
        uint difference = recoveredAt - block.timestamp;
        uint secondsRecovered = RECOVERY_SECONDS - difference;
        
        return STRENGTH * secondsRecovered / RECOVERY_SECONDS;*/
        if (!farm.recoveryTime[this.constructor.name]) {
            return this.STRENGTH;
        }
        const recoveredAt = farm.recoveryTime[this.constructor.name];
        if ((0, index_1.nowInSeconds)() > recoveredAt) {
            return this.STRENGTH;
        }
        const diff = recoveredAt - (0, index_1.nowInSeconds)();
        const secondsRecovered = this.RECOVERY_SECONDS.minus(new bignumber_js_1.default(diff));
        return this.STRENGTH.multipliedBy(secondsRecovered).dividedToIntegerBy(this.RECOVERY_SECONDS);
    }
    async stake(address, amount) {
        /*        require(msg.sender == minter, "You are not the minter");
        
        uint available = getAvailable(account);
        require(available >= amount, "The wood has not replenished");
        
        uint newAvailable = available - amount;
        uint amountToRecover = STRENGTH - newAvailable;

        // How long it will take to get back to full strength
        uint timeToRecover = (RECOVERY_SECONDS * amountToRecover) / STRENGTH;
        recoveryTime[account] = block.timestamp + timeToRecover;

        // Pseudo random multiplier
        uint multiplier = 3;
        
        // Total supply is even, increase multiplier
        uint circulatingSupply = totalSupply() / (10 ** 18);
        if (circulatingSupply % 2 == 0) {
            multiplier +=1;
        }
        
        // Seconds are even, increase multiplier
        if ((block.timestamp / 10) % 2 == 0) {
            multiplier +=1;
        }
        
        _mint(account, amount * multiplier);*/
        const farm = await this.repo.getFarm(address);
        const available = this.getAvailable(farm);
        if (available.lte(amount)) {
            throw new Error(`No ${this.constructor.name} replenished, available ${available.toString()} amount ${amount.toString()}`);
        }
        const newAvailable = available.minus(amount);
        const amountToRecover = this.STRENGTH.minus(newAvailable);
        const timeToRecover = this.RECOVERY_SECONDS.multipliedBy(amountToRecover).dividedBy(this.STRENGTH);
        //save recovery time
        farm.recoveryTime[this.constructor.name] = (0, index_1.nowInSeconds)() + timeToRecover.toNumber();
        const total = this.transformInputToOutputResource(amount);
        if (farm.inventory[this.constructor.name]) {
            const current = new bignumber_js_1.default(farm.inventory[this.constructor.name]);
            const updated = current.plus(total);
            farm.inventory[this.constructor.name] = updated.toString();
        }
        else {
            farm.inventory[this.constructor.name] = total.toString();
        }
        const updatedrequire = new bignumber_js_1.default(farm.inventory[this.requires]).minus(amount);
        farm.inventory[this.requires] = updatedrequire.toString();
        await this.repo.saveFarm(address, farm);
        const response = {
            statusCode: 200,
            body: {},
        };
        return response;
    }
    transformInputToOutputResource(amount) {
        const multiplier = new bignumber_js_1.default(randomInt(3, 5));
        const total = amount.multipliedBy(multiplier);
        return total;
    }
}
class Stone extends Wood {
    // 2 hrs
    RECOVERY_SECONDS = new bignumber_js_1.default(7200);
    // How much stone a quarry has
    STRENGTH = new bignumber_js_1.default(10).multipliedBy(new bignumber_js_1.default(10).pow(18)); //10 * (10**18);
    requires = 'Wood pickaxe';
    transformInputToOutputResource(amount) {
        const multiplier = new bignumber_js_1.default(randomInt(2, 4));
        const total = amount.multipliedBy(multiplier);
        return total;
    }
}
class Iron extends Wood {
    // 2 hrs
    RECOVERY_SECONDS = new bignumber_js_1.default(14400);
    // How much stone a quarry has
    STRENGTH = new bignumber_js_1.default(3).multipliedBy(new bignumber_js_1.default(10).pow(18)); //10 * (10**18);
    requires = 'Stone Pickaxe';
    transformInputToOutputResource(amount) {
        const multiplier = new bignumber_js_1.default(randomInt(3, 5));
        const total = amount.multipliedBy(multiplier);
        return total;
    }
}
class Gold extends Wood {
    // 12 hrs
    RECOVERY_SECONDS = new bignumber_js_1.default(43200);
    STRENGTH = new bignumber_js_1.default(2).multipliedBy(new bignumber_js_1.default(10).pow(18)); //10 * (10**18);
    requires = 'Iron Pickaxe';
    transformInputToOutputResource(amount) {
        const multiplier = new bignumber_js_1.default(randomInt(1, 2));
        const total = amount.multipliedBy(multiplier);
        return total;
    }
}
class Staker {
    repo;
    stakeMap;
    constructor(r) {
        this.repo = r;
        this.stakeMap = new Map();
        this.stakeMap.set(Wood.name, new Wood(this.repo));
        this.stakeMap.set(Stone.name, new Stone(this.repo));
        this.stakeMap.set(Gold.name, new Gold(this.repo));
        this.stakeMap.set(Iron.name, new Iron(this.repo));
    }
    async stake(address, resourceAddress, amount) {
        console.log(`stake ${address} resource ${resourceAddress} amount ${amount}`);
        const item = crafting_1.items.find(x => x.address == resourceAddress);
        const stackeable = this.stakeMap.get(item.name);
        if (stackeable) {
            return await stackeable.stake(address, new bignumber_js_1.default(amount));
        }
        else {
            throw new Error("Not Known resource " + resourceAddress);
        }
    }
    async getAvailable(address, resourceAddress) {
        console.log(`getAvailable ${address} resource ${resourceAddress}`);
        const item = crafting_1.items.find(x => x.address == resourceAddress);
        const stackeable = this.stakeMap.get(item.name);
        if (stackeable) {
            const farm = await this.repo.getFarm(address);
            if (!farm)
                return '0';
            return stackeable.getAvailable(farm).toString();
        }
        else {
            throw new Error("Not Known resource " + resourceAddress);
        }
    }
}
exports.Staker = Staker;
