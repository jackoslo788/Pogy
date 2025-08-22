const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Premium = require('../../database/schemas/GuildPremium');
const moment = require("moment");
require("moment-duration-format");
const config = require('../../config.json');
const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient(config.webhook_id, config.webhook_url);
let uniqid = require('uniqid');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'redeem',
        description: `Redeem a Premium code!`,
        category: 'Utility',
        cooldown: 3,
        userPermission: ["MANAGE_GUILD"]
      });
    }

    async run(message, args) {
     const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)
      
   let code = args[0] ? args[0].toUpperCase() : null;

    if(!code) return message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${message.client.emoji.fail} Please Specify a code to redeem`))

    const premium = await Premium.findOne({
      code: code
    })

    if(premium){

if (Number(premium.expiresAt) < Date.now()) {
  return message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${message.client.emoji.fail} This code has expired`))
}

    const extension = Number(premium.expiresAt) - Date.now();
    const alreadyPremium = guildDB.isPremium;

    guildDB.premium.redeemedBy.id = message.author.id;
    guildDB.premium.redeemedBy.tag = message.author.tag;
    guildDB.premium.redeemedAt = Date.now();

    if (alreadyPremium) {
      guildDB.premium.expiresAt = Number(guildDB.premium.expiresAt || Date.now()) + extension;
    } else {
      guildDB.isPremium = true;
      guildDB.premium.expiresAt = premium.expiresAt;
      guildDB.premium.plan = premium.plan;
    }

    try {
      await guildDB.save();
    } catch (err) {
      console.error("Failed to save premium data:", err);
      return message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${message.client.emoji.fail} Failed to save premium data, please try again later.`));
    }

    try {
      await premium.deleteOne();
    } catch (err) {
      console.error("Failed to delete premium code:", err);
      return message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${message.client.emoji.fail} Failed to redeem the premium code, please contact support.`));
    }

const expires = moment(Number(guildDB.premium.expiresAt)).format("dddd, MMMM Do YYYY HH:mm:ss");
const remaining = moment.duration(Number(guildDB.premium.expiresAt) - Date.now()).format("D [days], H [hrs], m [mins], s [secs]");

let ID = uniqid(undefined, `-${code}`);
const date = require('date-and-time');
const now = new Date();
let DDate = date.format(now, 'YYYY/MM/DD HH:mm:ss');

    try {
await message.author.send(new Discord.MessageEmbed()
    .setDescription(`**Premium Subscription**\n\nYou've recently redeemed ${alreadyPremium ? 'an additional' : 'a'} code in **${message.guild.name}** and here is your receipt:\n\n **Reciept ID:** ${ID}\n**Redeem Date:** ${DDate}\n**Guild Name:** ${message.guild.name}\n**Guild ID:** ${message.guild.id}\n**Expires At:** ${expires}\n**Remaining:** ${remaining}`)
      .setColor(message.guild.me.displayHexColor)
      .setFooter(message.guild.name))
    } catch (err){
console.log(err)
 message.channel.send(new Discord.MessageEmbed().setDescription(`**Congratulations!**\n\n**${message.guild.name}** ${alreadyPremium ? 'premium has been extended!' : 'Is now a premium guild! Thanks a ton!'}\n\nIf you have any questions please contact me [here](https://discord.gg/duBwdCvCwW)\n\n**Could not send your Reciept via dms so here it is:**\n**Reciept ID:** ${ID}\n**Redeem Date:** ${DDate}\n**Guild Name:** ${message.guild.name}\n**Guild ID:** ${message.guild.id}\n\n**Please make sure to keep this information safe, you might need it if you ever wanna refund / transfer servers.**\n\n**Expires At:** ${expires}\n**Remaining:** ${remaining}`).setColor(message.guild.me.displayHexColor).setFooter(message.guild.name));

      return;
    }


    message.channel.send(new Discord.MessageEmbed().setDescription(`**Congratulations!**\n\n**${message.guild.name}** ${alreadyPremium ? 'premium has been extended!' : 'Is now a premium guild! Thanks a ton!'}\n\nIf you have any questions please contact me [here](https://discord.gg/FqdH4sfKBg)\n**your receipt has been sent via dms**\n\n**Expires At:** ${expires}\n**Remaining:** ${remaining}`).setColor(message.guild.me.displayHexColor).setFooter(message.guild.name));

const embedPremium = new Discord.MessageEmbed()
      .setDescription(`**Premium Subscription**\n\n**${message.author.tag}** Redeemed ${alreadyPremium ? 'an additional' : 'a'} code in **${message.guild.name}**\n\n **Reciept ID:** ${ID}\n**Redeem Date:** ${DDate}\n**Guild Name:** ${message.guild.name}\n**Guild ID:** ${message.guild.id}\n**Redeemer Tag:** ${message.author.tag}\n**Redeemer ID:** ${message.author.id}\n\n**Expires At:** ${expires}\n**Remaining:** ${remaining}`)
      .setColor(message.guild.me.displayHexColor)

webhookClient.send({
        username: 'Pogy Premium',
        avatarURL: `${message.client.domain}/logo.png`,
        embeds: [embedPremium],
      });

    } else {
        return message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${message.client.emoji.fail} I could not the following Code.`))
    }

    }
};
