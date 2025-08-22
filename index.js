const PogyClient = require("./Pogy");
const config = require("./config.json");
const domain = require("./config.js");


const Pogy = new PogyClient(config);

const color = require("./data/colors");
Pogy.color = color;

Pogy.domain = domain.domain || `https://pogy.xyz`;

const emoji = require("./data/emoji");
Pogy.emoji = emoji;

const cron = require('node-cron');
const expirePremium = require('./services/premiumExpiry');

let client = Pogy
const jointocreate = require("./structures/jointocreate");
jointocreate(client);

Pogy.react = new Map()
Pogy.fetchforguild = new Map()

if(config.dashboard === "true"){
    const Dashboard = require("./dashboard/dashboard");
    Dashboard(client); 
}

        
Pogy.start();

cron.schedule('0 * * * *', () => expirePremium(Pogy));









  
