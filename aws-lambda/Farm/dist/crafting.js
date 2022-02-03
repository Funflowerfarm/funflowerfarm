"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_INVENTORY = exports.items = exports.recipes = void 0;
var deployAddresses_1 = require("./utils/deployAddresses");
var Token = "../../abis/Token.json";
var Farm = "../../abis/Farm.json";
var Axe = "../../abis/Axe.json";
var Wood = "../../abis/Wood.json";
var Pickaxe = "../../abis/Pickaxe.json";
var StonePickaxe = "../../abis/StonePickaxe.json";
var IronPickaxe = "../../abis/IronPickaxe.json";
var Stone = "../../abis/Stone.json";
var Gold = "../../abis/Gold.json";
var Egg = "../../abis/Egg.json";
var Chicken = "../../abis/Chicken.json";
var Iron = "../../abis/Iron.json";
var Statue = "../../abis/Statue.json";
var ChristmasTree = "../../abis/ChristmasTree.json";
var Scarecrow = "../../abis/Scarecrow.json";
var PotatoStatue = "../../abis/PotatoStatue.json";
var FarmCat = "../../abis/FarmCat.json";
var FarmDog = "../../abis/FarmDog.json";
var Gnome = "../../abis/Gnome.json";
var pickaxe = "../images/ui/pickaxe.png";
var woodPickaxe = "../images/ui/wood_pickaxe.png";
var ironPickaxe = "../images/ui/iron_pickaxe.png";
var axe = "../images/ui/axe.png";
var hammer = "../images/ui/hammer.png";
var rod = "../images/ui/rod.png";
var sword = "../images/ui/sword.png";
var wood = "../images/ui/wood.png";
var iron = "../images/ui/ore.png";
var goldOre = "../images/ui/gold_ore.png";
var stone = "../images/ui/rock.png";
var gnome = "../images/ui/gnome.png";
var chicken = "../images/ui/chicken.png";
var egg = "../images/ui/egg.png";
var chickenCoop = "../images/ui/chicken_coop.png";
var goldEgg = "../images/ui/gold_egg.png";
var coin = "../images/ui/icon.png";
var statue = "../images/ui/sunflower_statue.png";
var potatoStatue = "../images/ui/potato_statue.png";
var christmasTree = "../images/ui/christmas_tree.png";
var scarecrow = "../images/ui/scarecrow.png";
var farmCat = "../images/ui/farm_cat.png";
var dog = "../images/ui/dog.png";
var wheatSeed = "../images/wheat/seed.png";
var wheat = "../images/wheat/plant.png";
var flour = "../images/wheat/flour.png";
exports.recipes = [
    {
        name: "Axe",
        description: "Used for cutting and collecting wood",
        image: axe,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Axe"],
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
        address: deployAddresses_1.deployAddresses["PickAxe"],
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
        address: deployAddresses_1.deployAddresses["StonePickAxe"],
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
        address: deployAddresses_1.deployAddresses["IronPickAxe"],
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
    },
    {
        name: "Chicken coop",
        abi: ChristmasTree,
        description: "Produce eggs 3x as fast with this stylish coop",
        image: chickenCoop,
        type: "NFT",
        address: deployAddresses_1.deployAddresses["ChickenCoop"],
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
        openSeaLink: "https://opensea.io/collection/sunflower-farmers-chicken-coop",
    },
    {
        name: "Chicken",
        abi: Chicken,
        description: "An animal used to produce eggs",
        image: chicken,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Chicken"],
        ingredients: [
            {
                name: "$SFF",
                amount: 10,
                image: coin,
            },
        ],
    }, /*
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
exports.items = __spreadArray(__spreadArray([], exports.recipes, true), [
    {
        name: "Stone",
        abi: Stone,
        description: "A natural resource in Sunflower Land used for crafting",
        image: stone,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Stone"],
    },
    {
        name: "Wood",
        abi: Wood,
        description: "A bountiful resource in Sunflower Land used for crafting",
        image: wood,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Wood"],
    },
    {
        name: "Iron",
        abi: Iron,
        description: "A bountiful resource in Sunflower Land used for crafting",
        image: iron,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Iron"],
    },
    {
        name: "Gold",
        abi: Gold,
        description: "A scarce resource in Sunflower Land used for crafting",
        image: goldOre,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Gold"],
    },
    {
        name: "Egg",
        abi: Egg,
        description: "A bountiful resource in Sunflower Land used for crafting",
        image: egg,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Egg"],
    },
], false);
exports.DEFAULT_INVENTORY = {
    Wood: 0,
    Stone: 0,
    Axe: 0,
    "Wood pickaxe": 0,
    "Stone Pickaxe": 0,
    "Iron Pickaxe": 0,
    Iron: 0,
    Gold: 0,
    Chicken: 0,
    Egg: 0,
    "Chicken coop": 0, /*
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
