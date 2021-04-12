const { MessageEmbed, MessageAttachment } = require('discord.js');
const dataUriToBuffer = require('data-uri-to-buffer');
const fetch = require('node-fetch');
const gis = require('g-i-s');
//const { KSoftClient } = require('@ksoft/api');

module.exports = {
  name: 'cr-identify',
  description: 'cr-identify',
  cooldown: 1,
  async execute(client, channel, guild) {
    let timestamp = +new Date();

    fetch('http://roger.redevised.com/api/v1')
      .then((res) => res.text())
      .then((body) => {
        gis(body, async (err, res) => {
          if (err) console.error(err);
          // Maybe just yank the first result
          const answer = body;
          const filter = (response) => {
            return String(answer) === String(response.content.toLowerCase());
          };
          const embed = new MessageEmbed()
            .setImage(res[0].url)
            .setTitle(
              `${body.charAt(0)}${'#'.repeat(body.length - 2)}${body.charAt(body.length - 1)}`
            )
            .setColor('#4CD7FF');
          const msg = await channel.send('🔎 Identify', embed);
          channel
            .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then((collected) => {
              collected.first().react('724026367766691880');
              const embed = new MessageEmbed()
                .setColor('#4CD7FF')
                .setTitle(
                  `${collected.first().author.tag} got the answer in ${(
                    (collected.first().createdTimestamp - timestamp) /
                    1000
                  ).toFixed(2)} seconds!`
                )
                .setDescription(
                  `The answer was \`${answer}\`.\n\n[Jump to question](https://discordapp.com/channels/${guild.id}/${channel.id}/${msg.id})`
                );
              channel.send(embed);
            })
            .catch((collected) => {
              const embed = new MessageEmbed()
                .setColor('#F96EAA')
                .setTitle('Answer was unclaimed')
                .setDescription(
                  `No one got the answer! The answer was \`${answer}\`. Better luck next time.\n\n[Jump to question](https://discordapp.com/channels/${guild.id}/${channel.id}/${msg.id})`
                );
              channel.send(embed);
            });
        });
      });
  },
};
