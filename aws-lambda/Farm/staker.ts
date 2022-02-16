import { Repository } from "./repository";
import { items} from './crafting'
import BigNumber from "bignumber.js";
import { Farm } from "./farm";
import {nowInSeconds} from './index'

function randomInt (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };



class Wood {
    private repo: Repository

      // How long it takes
    readonly RECOVERY_SECONDS = new BigNumber(3600);
  // How much wood a tree has
    readonly STRENGTH:BigNumber = new BigNumber(10).multipliedBy(new BigNumber(10).pow(18)) //10 * (10**18);

    readonly requires:string = 'Axe'

    constructor(r: Repository) {
        this.repo = r
      }

    getAvailable(farm: Farm) : BigNumber {

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

        const recoveredAt:number = farm.recoveryTime[this.constructor.name]

        if (nowInSeconds() > recoveredAt) {
            return this.STRENGTH;
        }

        const diff: number = recoveredAt - nowInSeconds()
        
        const secondsRecovered = this.RECOVERY_SECONDS.minus(new BigNumber(diff))

        return this.STRENGTH.multipliedBy(secondsRecovered).dividedToIntegerBy(this.RECOVERY_SECONDS)
    }


    async stake(address:string, amount:BigNumber): Promise<void> {
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

        const farm = await this.repo.getFarm(address)
        const available = this.getAvailable(farm)
        if (available.lte(amount)) {
            throw new Error(`No ${this.constructor.name} replenished, available ${available.toString()} amount ${amount.toString()}`)
        }
        const newAvailable = available.minus(amount)
        const amountToRecover = this.STRENGTH.minus(newAvailable)
        const timeToRecover = this.RECOVERY_SECONDS.multipliedBy(amountToRecover).dividedBy(this.STRENGTH)
        //save recovery time
        farm.recoveryTime[this.constructor.name] = nowInSeconds() + timeToRecover.toNumber()

        const total = this.transformInputToOutputResource(amount)

        if (farm.inventory[this.constructor.name]) {
            const current = new BigNumber(farm.inventory[this.constructor.name])
            const updated = current.plus(total)
            farm.inventory[this.constructor.name] = updated.toString()
        } else {
            farm.inventory[this.constructor.name] = total.toString() 
        }

        const updatedrequire = new BigNumber(farm.inventory[this.requires]).minus(amount)
        farm.inventory[this.requires] = updatedrequire.toString()
        await this.repo.saveFarm(address, farm)
    }

    transformInputToOutputResource(amount: BigNumber) : BigNumber {
        const multiplier = new BigNumber(randomInt(3, 5))
        const total = amount.multipliedBy(multiplier)
        return total  
    }
}



class Stone extends Wood {
    // 2 hrs
    readonly RECOVERY_SECONDS = new BigNumber(7200);
  // How much stone a quarry has

    readonly STRENGTH:BigNumber = new BigNumber(10).multipliedBy(new BigNumber(10).pow(18)) //10 * (10**18);

    readonly requires:string = 'Wood pickaxe'


    transformInputToOutputResource(amount: BigNumber): BigNumber {
        const multiplier = new BigNumber(randomInt(2, 4))
        const total = amount.multipliedBy(multiplier)
        return total      
    }

}

class Iron extends Wood {
    // 2 hrs
    readonly RECOVERY_SECONDS = new BigNumber(14400);
  // How much stone a quarry has

    readonly STRENGTH:BigNumber = new BigNumber(3).multipliedBy(new BigNumber(10).pow(18)) //10 * (10**18);

    readonly requires:string = 'Stone Pickaxe'


    transformInputToOutputResource(amount: BigNumber): BigNumber {
        const multiplier = new BigNumber(randomInt(3, 5))
        const total = amount.multipliedBy(multiplier)
        return total      
    }

}

class Gold extends Wood {
    // 12 hrs
    readonly RECOVERY_SECONDS = new BigNumber(43200);

    readonly STRENGTH:BigNumber = new BigNumber(2).multipliedBy(new BigNumber(10).pow(18)) //10 * (10**18);

    readonly requires:string = 'Iron Pickaxe'


    transformInputToOutputResource(amount: BigNumber): BigNumber {
        const multiplier = new BigNumber(randomInt(1, 2))
        const total = amount.multipliedBy(multiplier)
        return total      
    }

}


export class Staker {
    private repo: Repository
    private stakeMap: Map<string, Wood>

    constructor(r: Repository) {
        this.repo = r
        this.stakeMap = new Map<string, Wood>()
        this.stakeMap.set(Wood.name, new Wood(this.repo))
        this.stakeMap.set(Stone.name, new Stone(this.repo))
        this.stakeMap.set(Gold.name, new Gold(this.repo))
        this.stakeMap.set(Iron.name, new Iron(this.repo))

      }

    async stake(address:string, resourceAddress:string, amount:string) {
        console.log(`stake ${address} resource ${resourceAddress} amount ${amount}`)
        const item = items.find( x => x.address == resourceAddress)
        const stackeable = this.stakeMap.get(item.name)
        if (stackeable) {
            await stackeable.stake(address, new BigNumber(amount))
        } else {
            throw new Error("Not Known resource " + resourceAddress)
        }
    }

    async getAvailable(address: string, resourceAddress: string): Promise<string> {
        console.log(`getAvailable ${address} resource ${resourceAddress}`)
        const item = items.find( x => x.address == resourceAddress)
        const stackeable = this.stakeMap.get(item.name)
        if (stackeable) {
            const farm = await this.repo.getFarm(address)
            if(!farm) return '0'
            return  stackeable.getAvailable(farm).toString()
        } else {
            throw new Error("Not Known resource " + resourceAddress)
        }
    }

}