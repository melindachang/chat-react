const { MessageEmbed, MessageAttachment } = require('discord.js');
const random = require('random-words');
const textToImage = require('text-to-image');
const dataUriToBuffer = require('data-uri-to-buffer');

module.exports = {
  name: 'cr-word',
  description: 'cr-word',
  cooldown: 1,
  async execute(client, channel, guild) {
    let word = random({ min: 2, max: 6 }).join(' ');
    let timestamp = +new Date();

    const dataURI = await textToImage.generate(word, {
      bgColor: 'rgba(0, 0, 0, 0)',
      textColor: '#4CD7FF',
      fontFamily: 'Circular',
      fontSize: 60,
      maxWidth: 1000,
      lineHeight: 80,
    });
    const imageStream = dataUriToBuffer(dataURI);
    const attachment = new MessageAttachment(imageStream, 'cr-math.jpg');

    const filter = (response) => {
      return String(word) === String(response.content);
    };

    const msg = await channel.send('⌨️ Quick type', attachment);

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
            `The answer was \`${word}\`.\n\n[Jump to question](https://discordapp.com/channels/${guild.id}/${channel.id}/${msg.id})`
          );
        channel.send(embed);
      })
      .catch((collected) => {
        const embed = new MessageEmbed()
          .setColor('#F96EAA')
          .setTitle('Answer was unclaimed')
          .setDescription(
            `No one got the answer! The answer was \`${word}\`. Better luck next time.\n\n[Jump to question](https://discordapp.com/channels/${guild.id}/${channel.id}/${msg.id})`
          );
        channel.send(embed);
      });
  },
};
