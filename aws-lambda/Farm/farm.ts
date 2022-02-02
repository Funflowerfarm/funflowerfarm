

export enum Fruit {
    None = "0",
    Sunflower = "1",
    Potato = "2",
    Pumpkin = "3",
    Beetroot = "4",
    Cauliflower = "5",
    Parsnip = "6",
    Radish = "7",
  }

  export enum Action {
    Plant = 0,
    Harvest = 1,
  }

export class Farm {
    land : Square[]
    inventory: Inventory
    syncedAt: number
}


export class Square {
    createdAt : number
    fruit: Fruit
}


export class Inventory {
    balance: string;
}


export class UserAction {
    action : Action
    fruit: Fruit
    landIndex: number
    createdAt: number
}