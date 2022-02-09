//backend
import {deployAddresses} from "./utils/deployAddresses"
const Token = "../../abis/Token.json";
const Farm = "../../abis/Farm.json";
const Axe = "../../abis/Axe.json";
const Wood = "../../abis/Wood.json";
const Pickaxe = "../../abis/Pickaxe.json";
const StonePickaxe = "../../abis/StonePickaxe.json";
const IronPickaxe = "../../abis/IronPickaxe.json";
const Stone = "../../abis/Stone.json";
const Gold = "../../abis/Gold.json";
const Egg = "../../abis/Egg.json";
const Chicken = "../../abis/Chicken.json";
const Iron = "../../abis/Iron.json";
const Statue = "../../abis/Statue.json";
const ChristmasTree = "../../abis/ChristmasTree.json";
const Scarecrow = "../../abis/Scarecrow.json";
const PotatoStatue = "../../abis/PotatoStatue.json";
const FarmCat = "../../abis/FarmCat.json";
const FarmDog = "../../abis/FarmDog.json";
const Gnome = "../../abis/Gnome.json";

const pickaxe = "../images/ui/pickaxe.png";
const woodPickaxe = "../images/ui/wood_pickaxe.png";
const ironPickaxe = "../images/ui/iron_pickaxe.png";
const axe = "../images/ui/axe.png";
const hammer = "../images/ui/hammer.png";
const rod = "../images/ui/rod.png";
const sword = "../images/ui/sword.png";
const wood = "../images/ui/wood.png";
const iron = "../images/ui/ore.png";
const goldOre = "../images/ui/gold_ore.png";
const stone = "../images/ui/rock.png";
const gnome = "../images/ui/gnome.png";
const chicken = "../images/ui/chicken.png";
const egg = "../images/ui/egg.png";
const chickenCoop = "../images/ui/chicken_coop.png";
const goldEgg = "../images/ui/gold_egg.png";
const coin = "../images/ui/icon.png";
const statue = "../images/ui/sunflower_statue.png";
const potatoStatue = "../images/ui/potato_statue.png";
const christmasTree = "../images/ui/christmas_tree.png";
const scarecrow = "../images/ui/scarecrow.png";
const farmCat = "../images/ui/farm_cat.png";
const dog = "../images/ui/dog.png";
const wheatSeed = "../images/wheat/seed.png";
const wheat = "../images/wheat/plant.png";
const flour = "../images/wheat/flour.png";

export interface Ingredient {
  name:
    | "Wood"
    | "Stone"
    | "$SFF"
    | "Iron"
    | "Gold"
    | "Egg"
    | "Wheat"
    | "MATIC"
    | "balance";
  image: any;
  amount: number;
}

export interface Recipe extends Item {
  ingredients: Ingredient[];
}

export interface Item {
  name:
    | "Axe"
    | "Stone"
    | "Wood"
    | "Wood pickaxe"
    | "Stone Pickaxe"
    | "Iron Pickaxe"/*
    | "Fishing rod"
    | "Hammer"*/
    | "Iron"
    | "Gold"
    | "Egg"
    | "Chicken"/*
    | "Sword"*/
    | "Chicken coop"/*
    | "Sunflower Statue"
    | "OG Potato Statue"
    | "Christmas Tree"
    | "Golden Egg"
    | "Scarecrow"
    | "Farm Cat"
    | "Farm Dog"
    | "Gnome"
    | "Wheat Seed"
    | "Flour"*/;
  description: string;
  address: string;
  image: any;
  type: "ERC20" | "NFT";
  communityMember?: {
    twitterName?: string;
    twitterLink?: string;
    discordName?: string;
  };
  isLocked?: boolean;
  supply?: number;
  limit?: number;
  farmLevel?: number;
  abi?: any;
  openSeaLink?: string;
  stake?(string): string;
}

export const recipes: Recipe[] = [
  {
    name: "Axe",
    description: "Used for cutting and collecting wood",
    image: axe,
    type: "ERC20",
    address: deployAddresses["Axe"],
    ingredients: [
      {
        name: "$SFF",
        amount: 1,
        image: coin,
      },
    ],
    abi: Axe,
  },
  {
    name: "Wood pickaxe",
    description: "Used for mining and collecting stone",
    image: woodPickaxe,
    type: "ERC20",
    address: deployAddresses["PickAxe"],
    ingredients: [
      {
        name: "Wood",
        amount: 5,
        image: wood,
      },
      {
        name: "$SFF",
        amount: 2,
        image: coin,
      },
    ],
    abi: Pickaxe,
  },
  {
    name: "Stone Pickaxe",
    abi: StonePickaxe,
    description: "Used for mining and collecting iron ore",
    image: pickaxe,
    type: "ERC20",
    address: deployAddresses["StonePickAxe"],
    ingredients: [
      {
        name: "Wood",
        amount: 5,
        image: wood,
      },
      {
        name: "Stone",
        amount: 5,
        image: stone,
      },
      {
        name: "$SFF",
        amount: 2,
        image: coin,
      },
    ],
  },
  {
    name: "Iron Pickaxe",
    abi: IronPickaxe,
    description: "Used for mining and collecting gold",
    image: ironPickaxe,
    type: "ERC20",
    address: deployAddresses["IronPickAxe"],
    ingredients: [
      {
        name: "Wood",
        amount: 10,
        image: wood,
      },
      {
        name: "Iron",
        amount: 10,
        image: iron,
      },
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },/*
  {
    name: "Hammer",

    description: "Used for building barns, coops & other structures",
    image: hammer,
    type: "ERC20",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "Wood",
        amount: 5,
        image: wood,
      },
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },
  {
    name: "Fishing rod",
    description: "Used for fishing and gathering fish",
    image: rod,
    type: "ERC20",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "Wood",
        amount: 5,
        image: wood,
      },
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },
  {
    name: "Sword",
    description: "Used for fighting monsters and collecting rewards",
    image: sword,
    type: "ERC20",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "Wood",
        amount: 5,
        image: wood,
      },
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },
  {
    name: "Sunflower Statue",
    abi: Statue,
    description: "A symbol of the holy token",
    image: statue,
    type: "NFT",
    address: "0x71556745dA70F2103C50f0E577C1ACF8A9aAC05E",
    ingredients: [
      {
        name: "$SFF",
        amount: 50,
        image: coin,
      },
      {
        name: "Stone",
        amount: 50,
        image: stone,
      },
      {
        name: "Iron",
        amount: 50,
        image: iron,
      },
    ],
    supply: 1000,
    openSeaLink: "https://opensea.io/collection/sunflower-farmers-statue",
  },
  {
    name: "Scarecrow",
    abi: Scarecrow,
    description: "Grow wheat (coming soon) 3x faster.",
    image: scarecrow,
    type: "NFT",
    address: "0x143Ba32499065b5F89c518d5B75a38F3529cE324",
    ingredients: [
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
      {
        name: "Wood",
        amount: 50,
        image: wood,
      },
    ],
    openSeaLink:
      "https://opensea.io/collection/sunflower-farmers-scarecrow",
    supply: 5000,
  },
  {
    name: "Christmas Tree",
    abi: ChristmasTree,
    description: "A christmas tree for the holidays",
    image: christmasTree,
    type: "NFT",
    address: "0x2fa133F8A7C9db0285BfF9984c29316482d9834d",
    openSeaLink:
      "https://opensea.io/collection/sunflower-farmers-christmas-tree",
    ingredients: [
      {
        name: "$SFF",
        amount: 300,
        image: coin,
      },
      {
        name: "Wood",
        amount: 500,
        image: wood,
      },
    ],
    supply: 50,
  }*/
  {
    name: "Chicken coop",
    abi: ChristmasTree,
    description: "Produce eggs 3x as fast with this stylish coop",
    image: chickenCoop,
    type: "NFT",
    address: deployAddresses["ChickenCoop"],
    ingredients: [
      {
        name: "$SFF",
        amount: 200,
        image: coin,
      },
      {
        name: "Wood",
        amount: 300,
        image: wood,
      },
      {
        name: "Gold",
        amount: 25,
        image: goldOre,
      },
    ],
    supply: 2000,
    openSeaLink:
      "https://opensea.io/collection/sunflower-farmers-chicken-coop",
  },
  {
    name: "Chicken",
    abi: Chicken,
    description: "An animal used to produce eggs",
    image: chicken,
    type: "ERC20",
    address: deployAddresses["Chicken"],
    ingredients: [
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },/*
  {
    name: "Golden Egg",
    abi: Chicken,
    description: "Will the golden egg bring you happiness?",
    image: goldEgg,
    type: "NFT",
    address: "0x282aAE7B826D5de16e78eCDc2015eB2110918fd2",
    limit: 300,
    supply: 300,
    openSeaLink:
      "https://opensea.io/collection/sunflower-farmers-golden-egg",
    ingredients: [
      {
        name: "Gold",
        amount: 50,
        image: goldOre,
      },
      {
        name: "Egg",
        amount: 150,
        image: egg,
      },
    ],
  },
  {
    name: "OG Potato Statue",
    abi: PotatoStatue,
    description: "Flex your status as an original potato hustler",
    image: potatoStatue,
    type: "NFT",
    address: "0x938a6942Bd09CfaC1bc4B2420F581A90fB5d5775",
    ingredients: [
      {
        name: "Stone",
        amount: 5,
        image: stone,
      },
    ],
    supply: 10000,
    openSeaLink:
      "https://opensea.io/collection/sunflower-farmers-og-potato-statue",
  },
  {
    name: "Farm Cat",
    abi: FarmCat,
    description: "A cat named Victoria that helps keep rats away.",
    image: farmCat,
    type: "NFT",
    address: "0x446F9E51a1f511Af1385dfc88F0d395b5AAAE856",
    ingredients: [
      {
        name: "Gold",
        amount: 5,
        image: goldOre,
      },
    ],
    farmLevel: 5,
    supply: 75,
    openSeaLink: "https://opensea.io/collection/sunflower-farmers-cat",
  },
  {
    name: "Farm Dog",
    abi: FarmDog,
    description: "Herd sheep 4x faster with Chonker the Dog.",
    image: dog,
    type: "NFT",
    address: "0x457ea0b03dD671baC515FA5bf324918Db4B12669",
    ingredients: [
      {
        name: "$SFF",
        amount: 30,
        image: coin,
      },
    ],
    communityMember: {
      discordName: "bumpkinbuilder",
      twitterName: "@sunflowerfarmz",
      twitterLink: "https://twitter.com/sunflowerfarmz",
    },
    supply: 500,
    openSeaLink: "https://opensea.io/collection/sunflower-farmers-dog",
  },
  {
    name: "Gnome",
    abi: Gnome,
    description: "Influence the weather with this magic gnome",
    image: gnome,
    type: "NFT",
    address: "0x35bE1387D1bBC2d263b73ab2825eE91f1fd75CF3",
    ingredients: [
      {
        name: "$SFF",
        amount: 5,
        image: coin,
      },
    ],
    communityMember: {
      discordName: "firstmover",
    },
    supply: 1000,
    openSeaLink: "https://opensea.io/collection/sunflower-farmers-gnome",
  },
  {
    name: "Wheat Seed",
    description: "Used for planting wheat",
    image: wheatSeed,
    type: "ERC20",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "$SFF",
        amount: 0.1,
        image: coin,
      },
    ],
  },
  {
    name: "Flour",
    description: "Used in recipes",
    image: flour,
    type: "ERC20",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "Wheat",
        amount: 1,
        image: wheat,
      },
    ],
  },*/
];

export const items: Item[] = [
  ...recipes,
  {
    name: "Stone",
    abi: Stone,
    description: "A natural resource in Sunflower Land used for crafting",
    image: stone,
    type: "ERC20",
    address: deployAddresses["Stone"]
  },
  {
    name: "Wood",
    abi: Wood,
    description:
      "A bountiful resource in Sunflower Land used for crafting",
    image: wood,
    type: "ERC20",
    address: deployAddresses["Wood"],
  },
  {
    name: "Iron",
    abi: Iron,
    description:
      "A bountiful resource in Sunflower Land used for crafting",
    image: iron,
    type: "ERC20",
    address: deployAddresses["Iron"],
  },
  {
    name: "Gold",
    abi: Gold,
    description: "A scarce resource in Sunflower Land used for crafting",
    image: goldOre,
    type: "ERC20",
    address: deployAddresses["Gold"],
  },
  {
    name: "Egg",
    abi: Egg,
    description:
      "A bountiful resource in Sunflower Land used for crafting",
    image: egg,
    type: "ERC20",
    address: deployAddresses["Egg"],
  },
];

export type Inventory = Record<ItemName, number>;

export const DEFAULT_INVENTORY: Inventory = {
  Wood: 0,
  Stone: 0,
  Axe: 0,
  "Wood pickaxe": 0,
  "Stone Pickaxe": 0,
  "Iron Pickaxe": 0,
  Iron: 0,
  Gold: 0,
  Chicken: 0,
  Egg: 0,/*
  "OG Potato Statue": 0,
  "Sunflower Statue": 0,
  "Fishing rod": 0,*/
  "Chicken coop": 0,/*
  Hammer: 0,
  Sword: 0,
  Scarecrow: 0,
  "Golden Egg": 0,
  "Christmas Tree": 0,
  "Farm Cat": 0,
  "Farm Dog": 0,
  Gnome: 0,
  "Wheat Seed": 0,
  Flour: 0,*/
};
export type ItemName = Item["name"];
