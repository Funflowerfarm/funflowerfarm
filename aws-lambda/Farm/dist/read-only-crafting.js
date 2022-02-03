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
var deployAddresses_1 = require("../utils/deployAddresses");
var Axe_json_1 = require("../../abis/Axe.json");
var Wood_json_1 = require("../../abis/Wood.json");
var Pickaxe_json_1 = require("../../abis/Pickaxe.json");
var StonePickaxe_json_1 = require("../../abis/StonePickaxe.json");
var IronPickaxe_json_1 = require("../../abis/IronPickaxe.json");
var Stone_json_1 = require("../../abis/Stone.json");
var Gold_json_1 = require("../../abis/Gold.json");
var Egg_json_1 = require("../../abis/Egg.json");
var Chicken_json_1 = require("../../abis/Chicken.json");
var Iron_json_1 = require("../../abis/Iron.json");
var ChristmasTree_json_1 = require("../../abis/ChristmasTree.json");
var pickaxe_png_1 = require("../images/ui/pickaxe.png");
var wood_pickaxe_png_1 = require("../images/ui/wood_pickaxe.png");
var iron_pickaxe_png_1 = require("../images/ui/iron_pickaxe.png");
var axe_png_1 = require("../images/ui/axe.png");
var wood_png_1 = require("../images/ui/wood.png");
var ore_png_1 = require("../images/ui/ore.png");
var gold_ore_png_1 = require("../images/ui/gold_ore.png");
var rock_png_1 = require("../images/ui/rock.png");
var chicken_png_1 = require("../images/ui/chicken.png");
var egg_png_1 = require("../images/ui/egg.png");
var chicken_coop_png_1 = require("../images/ui/chicken_coop.png");
var icon_png_1 = require("../images/ui/icon.png");
exports.recipes = [
    {
        name: "Axe",
        description: "Used for cutting and collecting wood",
        image: axe_png_1.default,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Axe"],
        ingredients: [
            {
                name: "$SFF",
                amount: 1,
                image: icon_png_1.default,
            },
        ],
        abi: Axe_json_1.default,
    },
    {
        name: "Wood pickaxe",
        description: "Used for mining and collecting stone",
        image: wood_pickaxe_png_1.default,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["PickAxe"],
        ingredients: [
            {
                name: "Wood",
                amount: 5,
                image: wood_png_1.default,
            },
            {
                name: "$SFF",
                amount: 2,
                image: icon_png_1.default,
            },
        ],
        abi: Pickaxe_json_1.default,
    },
    {
        name: "Stone Pickaxe",
        abi: StonePickaxe_json_1.default,
        description: "Used for mining and collecting iron ore",
        image: pickaxe_png_1.default,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["StonePickAxe"],
        ingredients: [
            {
                name: "Wood",
                amount: 5,
                image: wood_png_1.default,
            },
            {
                name: "Stone",
                amount: 5,
                image: rock_png_1.default,
            },
            {
                name: "$SFF",
                amount: 2,
                image: icon_png_1.default,
            },
        ],
    },
    {
        name: "Iron Pickaxe",
        abi: IronPickaxe_json_1.default,
        description: "Used for mining and collecting gold",
        image: iron_pickaxe_png_1.default,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["IronPickAxe"],
        ingredients: [
            {
                name: "Wood",
                amount: 10,
                image: wood_png_1.default,
            },
            {
                name: "Iron",
                amount: 10,
                image: ore_png_1.default,
            },
            {
                name: "$SFF",
                amount: 10,
                image: icon_png_1.default,
            },
        ],
    },
    {
        name: "Chicken coop",
        abi: ChristmasTree_json_1.default,
        description: "Produce eggs 3x as fast with this stylish coop",
        image: chicken_coop_png_1.default,
        type: "NFT",
        address: deployAddresses_1.deployAddresses["ChickenCoop"],
        ingredients: [
            {
                name: "$SFF",
                amount: 200,
                image: icon_png_1.default,
            },
            {
                name: "Wood",
                amount: 300,
                image: wood_png_1.default,
            },
            {
                name: "Gold",
                amount: 25,
                image: gold_ore_png_1.default,
            },
        ],
        supply: 2000,
        openSeaLink: "https://opensea.io/collection/sunflower-farmers-chicken-coop",
    },
    {
        name: "Chicken",
        abi: Chicken_json_1.default,
        description: "An animal used to produce eggs",
        image: chicken_png_1.default,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Chicken"],
        ingredients: [
            {
                name: "$SFF",
                amount: 10,
                image: icon_png_1.default,
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
        abi: Stone_json_1.default,
        description: "A natural resource in Sunflower Land used for crafting",
        image: rock_png_1.default,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Stone"],
    },
    {
        name: "Wood",
        abi: Wood_json_1.default,
        description: "A bountiful resource in Sunflower Land used for crafting",
        image: wood_png_1.default,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Wood"],
    },
    {
        name: "Iron",
        abi: Iron_json_1.default,
        description: "A bountiful resource in Sunflower Land used for crafting",
        image: ore_png_1.default,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Iron"],
    },
    {
        name: "Gold",
        abi: Gold_json_1.default,
        description: "A scarce resource in Sunflower Land used for crafting",
        image: gold_ore_png_1.default,
        type: "ERC20",
        address: deployAddresses_1.deployAddresses["Gold"],
    },
    {
        name: "Egg",
        abi: Egg_json_1.default,
        description: "A bountiful resource in Sunflower Land used for crafting",
        image: egg_png_1.default,
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
