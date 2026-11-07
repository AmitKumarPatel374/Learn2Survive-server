require("dotenv").config();

const connectDB = require("./src/config/database/db");
const GameModel = require("./src/model/game.model");

connectDB();

GameModel.insertMany([
    // =========================================
    // 1. FLOOD
    // =========================================
    // {
    //     name: "Survival Kit Challenge for Flood",
    //     description: "Choose essential items and prepare yourself for an emergency.",
    //     disaster: "6a4d106309e371f090661ad5",
    //     gameType: "survival-kit",
    //     thumbnail: "https://ik.imagekit.io/Anuj/Survival_kit_challenge_flood.png",
    //     isPublished: true,
    //     gameConfig: {
    //         selectionLimit: 6,
    //         items: [
    //             { name: "Fresh Water", imageUrl: "https://api.iconify.design/mdi/water.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Ready-to-Eat Food", imageUrl: "https://api.iconify.design/mdi/food-apple.svg?color=%230D6EFD", rating: 5 },
    //             { name: "First Aid Kit", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Flashlight", imageUrl: "https://api.iconify.design/mdi/flashlight.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Emergency Radio", imageUrl: "https://api.iconify.design/mdi/radio.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Waterproof Document Pouch", imageUrl: "https://api.iconify.design/mdi/folder-lock.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Essential Medicines", imageUrl: "https://api.iconify.design/mdi/pill.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Life Jacket", imageUrl: "https://api.iconify.design/mdi/life-ring.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Power Bank", imageUrl: "https://api.iconify.design/mdi/battery-charging.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Emergency Whistle", imageUrl: "https://api.iconify.design/mdi/whistle.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Waterproof Backpack", imageUrl: "https://api.iconify.design/mdi/bag-personal.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Emergency Contact List", imageUrl: "https://api.iconify.design/mdi/contacts.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Raincoat", imageUrl: "https://api.iconify.design/mdi/weather-rainy.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Extra Clothes", imageUrl: "https://api.iconify.design/mdi/tshirt-crew.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Hygiene Kit", imageUrl: "https://api.iconify.design/mdi/hand-wash.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Cash", imageUrl: "https://api.iconify.design/mdi/cash.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Local Area Map", imageUrl: "https://api.iconify.design/mdi/map.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Umbrella", imageUrl: "https://api.iconify.design/mdi/umbrella.svg?color=%230D6EFD", rating: 1 },
    //             { name: "Laptop", imageUrl: "https://api.iconify.design/mdi/laptop.svg?color=%230D6EFD", rating: 0 },
    //             { name: "Football", imageUrl: "https://api.iconify.design/mdi/soccer.svg?color=%230D6EFD", rating: 0 }
    //         ]
    //     }
    // },

    // // =========================================
    // // 2. EARTHQUAKE
    // // =========================================
    // {
    //     name: "Survival Kit Challenge for Earthquake",
    //     description: "Choose essential items and prepare yourself for an emergency.",
    //     disaster: "6a4d10e309e371f090661ad7",
    //     gameType: "survival-kit",
    //     thumbnail: "X",
    //     isPublished: true,
    //     gameConfig: {
    //         selectionLimit: 6,
    //         items: [
    //             { name: "Fresh Water", imageUrl: "https://api.iconify.design/mdi/water.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Ready-to-Eat Food", imageUrl: "https://api.iconify.design/mdi/food-apple.svg?color=%230D6EFD", rating: 4 },
    //             { name: "First Aid Kit", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Flashlight", imageUrl: "https://api.iconify.design/mdi/flashlight.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Emergency Radio", imageUrl: "https://api.iconify.design/mdi/radio.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Power Bank", imageUrl: "https://api.iconify.design/mdi/battery-charging.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Emergency Whistle", imageUrl: "https://api.iconify.design/mdi/whistle.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Sturdy Walking Shoes", imageUrl: "https://api.iconify.design/mdi/shoe-sneaker.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Safety Helmet", imageUrl: "https://api.iconify.design/mdi/hard-hat.svg?color=%230D6EFD", rating: 5 },
    //             { name: "N95 Dust Mask", imageUrl: "https://api.iconify.design/mdi/face-mask.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Protective Gloves", imageUrl: "https://api.iconify.design/mdi/hand-back-right.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Safety Goggles", imageUrl: "https://api.iconify.design/mdi/goggles.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Essential Medicines", imageUrl: "https://api.iconify.design/mdi/pill.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Waterproof Document Pouch", imageUrl: "https://api.iconify.design/mdi/folder-lock.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Emergency Contact Card", imageUrl: "https://api.iconify.design/mdi/card-account-phone.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Thermal Blanket", imageUrl: "https://api.iconify.design/mdi/blanket.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Cash", imageUrl: "https://api.iconify.design/mdi/cash.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Glass Vase", imageUrl: "https://api.iconify.design/mdi/vase.svg?color=%230D6EFD", rating: 0 },
    //             { name: "Gaming Console", imageUrl: "https://api.iconify.design/mdi/gamepad-variant.svg?color=%230D6EFD", rating: 0 },
    //             { name: "Decorative Wall Clock", imageUrl: "https://api.iconify.design/mdi/clock-outline.svg?color=%230D6EFD", rating: 0 }
    //         ]
    //     }
    // },

    // // =========================================
    // // 3. BUILDING COLLAPSE
    // // =========================================
    // {
    //     name: "Survival Kit Challenge for Building Collapse",
    //     description: "Choose essential items and prepare yourself for an emergency.",
    //     disaster: "6a4d158e09e371f090661af3",
    //     gameType: "survival-kit",
    //     thumbnail: "X",
    //     isPublished: true,
    //     gameConfig: {
    //         selectionLimit: 6,
    //         items: [
    //             { name: "Emergency Whistle", imageUrl: "https://api.iconify.design/mdi/whistle.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Flashlight", imageUrl: "https://api.iconify.design/mdi/flashlight.svg?color=%230D6EFD", rating: 5 },
    //             { name: "N95 Dust Mask", imageUrl: "https://api.iconify.design/mdi/face-mask.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Sturdy Walking Shoes", imageUrl: "https://api.iconify.design/mdi/shoe-sneaker.svg?color=%230D6EFD", rating: 5 },
    //             { name: "First Aid Kit", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Safety Helmet", imageUrl: "https://api.iconify.design/mdi/hard-hat.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Protective Gloves", imageUrl: "https://api.iconify.design/mdi/hand-back-right.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Fresh Water", imageUrl: "https://api.iconify.design/mdi/water.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Energy Bars", imageUrl: "https://api.iconify.design/mdi/food-apple.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Emergency Radio", imageUrl: "https://api.iconify.design/mdi/radio.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Power Bank", imageUrl: "https://api.iconify.design/mdi/battery-charging.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Mobile Phone", imageUrl: "https://api.iconify.design/mdi/cellphone.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Safety Goggles", imageUrl: "https://api.iconify.design/mdi/goggles.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Thermal Blanket", imageUrl: "https://api.iconify.design/mdi/blanket.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Essential Medicines", imageUrl: "https://api.iconify.design/mdi/pill.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Emergency Contact Card", imageUrl: "https://api.iconify.design/mdi/card-account-phone.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Bright-Colored Signaling Cloth", imageUrl: "https://api.iconify.design/mdi/flag.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Small Signal Mirror", imageUrl: "https://api.iconify.design/mdi/mirror.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Perfume Bottle", imageUrl: "https://api.iconify.design/mdi/perfume.svg?color=%230D6EFD", rating: 0 },
    //             { name: "Headphones", imageUrl: "https://api.iconify.design/mdi/headphones.svg?color=%230D6EFD", rating: 0 }
    //         ]
    //     }
    // },

    // // =========================================
    // // 4. HEATWAVE
    // // =========================================
    // {
    //     name: "Survival Kit Challenge for Heatwave",
    //     description: "Choose essential items and prepare yourself for an emergency.",
    //     disaster: "6a4d130109e371f090661adf",
    //     gameType: "survival-kit",
    //     thumbnail: "X",
    //     isPublished: true,
    //     gameConfig: {
    //         selectionLimit: 6,
    //         items: [
    //             { name: "Fresh Water", imageUrl: "https://api.iconify.design/mdi/water.svg?color=%230D6EFD", rating: 5 },
    //             { name: "ORS Packets", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Cooling Towel", imageUrl: "https://api.iconify.design/mdi/towel.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Wide-Brimmed Hat", imageUrl: "https://api.iconify.design/mdi/hat-fedora.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Electrolyte Packets", imageUrl: "https://api.iconify.design/mdi/water-plus.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Lightweight Cotton Clothes", imageUrl: "https://api.iconify.design/mdi/tshirt-crew.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Digital Thermometer", imageUrl: "https://api.iconify.design/mdi/thermometer.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Essential Medicines", imageUrl: "https://api.iconify.design/mdi/pill.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Mobile Phone", imageUrl: "https://api.iconify.design/mdi/cellphone.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Sunscreen SPF 30+", imageUrl: "https://api.iconify.design/mdi/weather-sunny.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Portable Electric Fan", imageUrl: "https://api.iconify.design/mdi/fan.svg?color=%230D6EFD", rating: 3 },
    //             { name: "First Aid Kit", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Sunglasses", imageUrl: "https://api.iconify.design/mdi/sunglasses.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Umbrella", imageUrl: "https://api.iconify.design/mdi/umbrella.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Spray Bottle", imageUrl: "https://api.iconify.design/mdi/spray-bottle.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Ready-to-Eat Snacks", imageUrl: "https://api.iconify.design/mdi/food-apple.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Power Bank", imageUrl: "https://api.iconify.design/mdi/battery-charging.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Wet Wipes", imageUrl: "https://api.iconify.design/mdi/hand-wash.svg?color=%230D6EFD", rating: 2 },
    //             { name: "Wool Blanket", imageUrl: "https://api.iconify.design/mdi/blanket.svg?color=%230D6EFD", rating: 0 },
    //             { name: "Heavy Winter Jacket", imageUrl: "https://api.iconify.design/mdi/coat.svg?color=%230D6EFD", rating: 0 }
    //         ]
    //     }
    // },

    // // =========================================
    // // 5. TSUNAMI
    // // =========================================
    // {
    //     name: "Survival Kit Challenge for Tsunami",
    //     description: "Choose essential items and prepare yourself for an emergency.",
    //     disaster: "6a4d129709e371f090661add",
    //     gameType: "survival-kit",
    //     thumbnail: "X",
    //     isPublished: true,
    //     gameConfig: {
    //         selectionLimit: 6,
    //         items: [
    //             { name: "Fresh Water", imageUrl: "https://api.iconify.design/mdi/water.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Ready-to-Eat Food", imageUrl: "https://api.iconify.design/mdi/food-apple.svg?color=%230D6EFD", rating: 4 },
    //             { name: "First Aid Kit", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Flashlight", imageUrl: "https://api.iconify.design/mdi/flashlight.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Emergency Radio", imageUrl: "https://api.iconify.design/mdi/radio.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Power Bank", imageUrl: "https://api.iconify.design/mdi/battery-charging.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Waterproof Document Pouch", imageUrl: "https://api.iconify.design/mdi/folder-lock.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Essential Medicines", imageUrl: "https://api.iconify.design/mdi/pill.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Emergency Whistle", imageUrl: "https://api.iconify.design/mdi/whistle.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Sturdy Walking Shoes", imageUrl: "https://api.iconify.design/mdi/shoe-sneaker.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Emergency Contact Card", imageUrl: "https://api.iconify.design/mdi/card-account-phone.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Local Evacuation Map", imageUrl: "https://api.iconify.design/mdi/map.svg?color=%230D6EFD", rating: 5 },
    //             { name: "Small Emergency Backpack", imageUrl: "https://api.iconify.design/mdi/bag-personal.svg?color=%230D6EFD", rating: 4 },
    //             { name: "Life Jacket", imageUrl: "https://api.iconify.design/mdi/life-ring.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Extra Clothes", imageUrl: "https://api.iconify.design/mdi/tshirt-crew.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Hygiene Kit", imageUrl: "https://api.iconify.design/mdi/hand-wash.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Cash", imageUrl: "https://api.iconify.design/mdi/cash.svg?color=%230D6EFD", rating: 3 },
    //             { name: "N95 Dust Mask", imageUrl: "https://api.iconify.design/mdi/face-mask.svg?color=%230D6EFD", rating: 3 },
    //             { name: "Jewellery Box", imageUrl: "https://api.iconify.design/mdi/treasure-chest.svg?color=%230D6EFD", rating: 0 },
    //             { name: "Gaming Console", imageUrl: "https://api.iconify.design/mdi/gamepad-variant.svg?color=%230D6EFD", rating: 0 }
    //     ]
    // }
    {
        name: "Survival Kit Challenge for Drought",
        description: "Choose essential supplies to stay safe and prepared during prolonged water shortages and drought conditions.",
        disaster: "6a4d141f09e371f090661ae3",
        gameType: "survival-kit",
        thumbnail: "https://ik.imagekit.io/Anuj/Drought.webp",
        isPublished: true,
        gameConfig: {
            selectionLimit: 6,
            items: [
                { name: "Drinking Water", imageUrl: "https://api.iconify.design/mdi/water.svg?color=%230D6EFD", rating: 5 },
                { name: "Water Storage Containers", imageUrl: "https://api.iconify.design/mdi/water-outline.svg?color=%230D6EFD", rating: 5 },
                { name: "Water Purification Tablets", imageUrl: "https://api.iconify.design/mdi/pill.svg?color=%230D6EFD", rating: 5 },
                { name: "Water Filter", imageUrl: "https://api.iconify.design/mdi/water-check.svg?color=%230D6EFD", rating: 5 },
                { name: "Ready-to-Eat Food", imageUrl: "https://api.iconify.design/mdi/food-apple.svg?color=%230D6EFD", rating: 4 },
                { name: "ORS Packets", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 4 },
                { name: "First Aid Kit", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 4 },
                { name: "Essential Medicines", imageUrl: "https://api.iconify.design/mdi/pill.svg?color=%230D6EFD", rating: 4 },
                { name: "Wide-Brimmed Hat", imageUrl: "https://api.iconify.design/mdi/hat-fedora.svg?color=%230D6EFD", rating: 4 },
                { name: "Sunscreen", imageUrl: "https://api.iconify.design/mdi/sun-protection.svg?color=%230D6EFD", rating: 4 },
                { name: "Lightweight Cotton Clothes", imageUrl: "https://api.iconify.design/mdi/tshirt-crew.svg?color=%230D6EFD", rating: 4 },
                { name: "Emergency Radio", imageUrl: "https://api.iconify.design/mdi/radio.svg?color=%230D6EFD", rating: 4 },
                { name: "Flashlight", imageUrl: "https://api.iconify.design/mdi/flashlight.svg?color=%230D6EFD", rating: 3 },
                { name: "Power Bank", imageUrl: "https://api.iconify.design/mdi/battery-charging.svg?color=%230D6EFD", rating: 3 },
                { name: "Waterproof Document Pouch", imageUrl: "https://api.iconify.design/mdi/folder-lock.svg?color=%230D6EFD", rating: 3 },
                { name: "Emergency Contact Card", imageUrl: "https://api.iconify.design/mdi/card-account-phone.svg?color=%230D6EFD", rating: 3 },
                { name: "Cash", imageUrl: "https://api.iconify.design/mdi/cash.svg?color=%230D6EFD", rating: 3 },
                { name: "Watering Can", imageUrl: "https://api.iconify.design/mdi/watering-can.svg?color=%230D6EFD", rating: 1 },
                { name: "Gaming Console", imageUrl: "https://api.iconify.design/mdi/gamepad-variant.svg?color=%230D6EFD", rating: 0 },
                { name: "Decorative Fountain", imageUrl: "https://api.iconify.design/mdi/fountain.svg?color=%230D6EFD", rating: 0 }
            ]
        }
    },

    {
        name: "Survival Kit Challenge for Cold Wave",
        description: "Choose essential supplies to stay warm, protect yourself and survive extreme cold weather conditions.",
        disaster: "6a4d14aa09e371f090661ae7",
        gameType: "survival-kit",
        thumbnail: "https://ik.imagekit.io/Anuj/Cold_Wave.webp",
        isPublished: true,
        gameConfig: {
            selectionLimit: 6,
            items: [
                { name: "Thermal Blanket", imageUrl: "https://api.iconify.design/mdi/blanket.svg?color=%230D6EFD", rating: 5 },
                { name: "Warm Woolen Clothes", imageUrl: "https://api.iconify.design/mdi/jacket.svg?color=%230D6EFD", rating: 5 },
                { name: "Winter Jacket", imageUrl: "https://api.iconify.design/mdi/coat-rack.svg?color=%230D6EFD", rating: 5 },
                { name: "Woolen Gloves", imageUrl: "https://api.iconify.design/mdi/gloves.svg?color=%230D6EFD", rating: 5 },
                { name: "Woolen Cap", imageUrl: "https://api.iconify.design/mdi/hat-winter.svg?color=%230D6EFD", rating: 5 },
                { name: "Warm Socks", imageUrl: "https://api.iconify.design/mdi/socks.svg?color=%230D6EFD", rating: 4 },
                { name: "Sturdy Winter Shoes", imageUrl: "https://api.iconify.design/mdi/boot.svg?color=%230D6EFD", rating: 4 },
                { name: "Drinking Water", imageUrl: "https://api.iconify.design/mdi/water.svg?color=%230D6EFD", rating: 4 },
                { name: "Ready-to-Eat Food", imageUrl: "https://api.iconify.design/mdi/food-apple.svg?color=%230D6EFD", rating: 4 },
                { name: "First Aid Kit", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 4 },
                { name: "Essential Medicines", imageUrl: "https://api.iconify.design/mdi/pill.svg?color=%230D6EFD", rating: 4 },
                { name: "Emergency Radio", imageUrl: "https://api.iconify.design/mdi/radio.svg?color=%230D6EFD", rating: 4 },
                { name: "Flashlight", imageUrl: "https://api.iconify.design/mdi/flashlight.svg?color=%230D6EFD", rating: 4 },
                { name: "Power Bank", imageUrl: "https://api.iconify.design/mdi/battery-charging.svg?color=%230D6EFD", rating: 3 },
                { name: "Hot Water Bottle", imageUrl: "https://api.iconify.design/mdi/bottle-tonic.svg?color=%230D6EFD", rating: 4 },
                { name: "Waterproof Document Pouch", imageUrl: "https://api.iconify.design/mdi/folder-lock.svg?color=%230D6EFD", rating: 3 },
                { name: "Emergency Contact Card", imageUrl: "https://api.iconify.design/mdi/card-account-phone.svg?color=%230D6EFD", rating: 3 },
                { name: "Cash", imageUrl: "https://api.iconify.design/mdi/cash.svg?color=%230D6EFD", rating: 2 },
                { name: "Beach Umbrella", imageUrl: "https://api.iconify.design/mdi/beach.svg?color=%230D6EFD", rating: 0 },
                { name: "Ice Cream", imageUrl: "https://api.iconify.design/mdi/ice-cream.svg?color=%230D6EFD", rating: 0 }
            ]
        }
    },

    {
        name: "Survival Kit Challenge for Cyclone",
        description: "Choose essential supplies to protect yourself and prepare for strong winds, heavy rainfall and flooding during a cyclone.",
        disaster: "6a4d116209e371f090661ad9",
        gameType: "survival-kit",
        thumbnail: "https://ik.imagekit.io/Anuj/Cyclone.webp",
        isPublished: true,
        gameConfig: {
            selectionLimit: 6,
            items: [
                { name: "Drinking Water", imageUrl: "https://api.iconify.design/mdi/water.svg?color=%230D6EFD", rating: 5 },
                { name: "Ready-to-Eat Food", imageUrl: "https://api.iconify.design/mdi/food-apple.svg?color=%230D6EFD", rating: 5 },
                { name: "First Aid Kit", imageUrl: "https://api.iconify.design/mdi/medical-bag.svg?color=%230D6EFD", rating: 5 },
                { name: "Emergency Radio", imageUrl: "https://api.iconify.design/mdi/radio.svg?color=%230D6EFD", rating: 5 },
                { name: "Flashlight", imageUrl: "https://api.iconify.design/mdi/flashlight.svg?color=%230D6EFD", rating: 5 },
                { name: "Power Bank", imageUrl: "https://api.iconify.design/mdi/battery-charging.svg?color=%230D6EFD", rating: 4 },
                { name: "Waterproof Document Pouch", imageUrl: "https://api.iconify.design/mdi/folder-lock.svg?color=%230D6EFD", rating: 5 },
                { name: "Essential Medicines", imageUrl: "https://api.iconify.design/mdi/pill.svg?color=%230D6EFD", rating: 5 },
                { name: "Emergency Whistle", imageUrl: "https://api.iconify.design/mdi/whistle.svg?color=%230D6EFD", rating: 4 },
                { name: "Waterproof Backpack", imageUrl: "https://api.iconify.design/mdi/bag-personal.svg?color=%230D6EFD", rating: 4 },
                { name: "Raincoat", imageUrl: "https://api.iconify.design/mdi/weather-pouring.svg?color=%230D6EFD", rating: 4 },
                { name: "Emergency Contact Card", imageUrl: "https://api.iconify.design/mdi/card-account-phone.svg?color=%230D6EFD", rating: 4 },
                { name: "Local Evacuation Map", imageUrl: "https://api.iconify.design/mdi/map.svg?color=%230D6EFD", rating: 5 },
                { name: "Sturdy Walking Shoes", imageUrl: "https://api.iconify.design/mdi/shoe-sneaker.svg?color=%230D6EFD", rating: 4 },
                { name: "Extra Clothes", imageUrl: "https://api.iconify.design/mdi/tshirt-crew.svg?color=%230D6EFD", rating: 3 },
                { name: "Hygiene Kit", imageUrl: "https://api.iconify.design/mdi/hand-wash.svg?color=%230D6EFD", rating: 3 },
                { name: "Cash", imageUrl: "https://api.iconify.design/mdi/cash.svg?color=%230D6EFD", rating: 3 },
                { name: "Life Jacket", imageUrl: "https://api.iconify.design/mdi/life-ring.svg?color=%230D6EFD", rating: 3 },
                { name: "Gaming Console", imageUrl: "https://api.iconify.design/mdi/gamepad-variant.svg?color=%230D6EFD", rating: 0 },
                { name: "Decorative Glass Vase", imageUrl: "https://api.iconify.design/mdi/vase.svg?color=%230D6EFD", rating: 0 }
            ]
        }
    }


])
    .then(result => {
        console.log(`${result.length} games inserted successfully`);
    })
    .catch(error => {
        console.error("Error inserting games:", error);
    });
