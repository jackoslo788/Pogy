const Discord = require('discord.js');
const { WebhookClient, MessageEmbed } = require('discord.js');
const config = require('../config.json');
const Guild = require('../database/schemas/Guild');

const premiumrip = new WebhookClient(config.webhook_id, config.webhook_url);

module.exports = async (client) => {
  const results = await Guild.find({ isPremium: true });
  if (!results || !results.length) return;

  for (const result of results) {
    if (Date.now() >= Number(result.premium.expiresAt)) {
      const guildPremium = client.guilds.cache.get(result.guildId);
      if (guildPremium) {
        const user = client.users.cache.get(result.premium.redeemedBy.id);
        if (user) {
          const embed = new Discord.MessageEmbed()
            .setColor(client.color.red)
            .setDescription(`Hey ${user.username}, Premium in ${guildPremium.name} has Just expired :(
\n__You can you re-new your server here! [https://pogy.xyz/premium](https://pogy.xyz/premium)__\n\nThank you for purchasing premium Previously! We hope you enjoyed what you purchased.\n\n**- Pogy**`);
          user.send(embed).catch(() => {});
        }

        const rip = new Discord.MessageEmbed()
          .setDescription(`**Premium Subscription**\n\n**Guild:** ${guildPremium.name} | **${guildPremium.id}**\nRedeemed by: ${user ? user.tag : 'Unknown'}\n**Plan:** ${result.premium.plan}`)
          .setColor('RED')
          .setTimestamp();

        premiumrip.send({
          username: 'Pogy Loose Premium',
          avatarURL: `${client.domain}/logo.png`,
          embeds: [rip],
        }).catch(() => {});
      }

      result.isPremium = false;
      result.premium.redeemedBy.id = null;
      result.premium.redeemedBy.tag = null;
      result.premium.redeemedAt = null;
      result.premium.expiresAt = null;
      result.premium.plan = null;

      await result.save().catch(() => {});
    }
  }
};
