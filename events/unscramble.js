const { MessageEmbed, MessageAttachment } = require('discord.js');
const random = require('random-words');
const textToImage = require('text-to-image');
const dataUriToBuffer = require('data-uri-to-buffer');

module.exports = {
  name: 'cr-scramble',
  description: 'cr-scramble',
  cooldown: 1,
  async execute(client, channel, guild) {
    let word = random();

    while (word.length > 10 || word.length < 5) {
      word = random();
    }

    let timestamp = +new Date();

    let scrambled = word.split('');
    let ends = [scrambled.shift(), scrambled.pop()];
    while (word.includes(scrambled.join(''))) {
      scrambled.sort(() => {
        return Math.random() - 0.5;
      });
    }

    scrambled = `${ends[0]}${scrambled.join('')}${ends[1]}`;

    const dataURI = await textToImage.generate(scrambled, {
      maxWidth: 1000,
      fontSize: 60,
      fontFamily: 'Circular',
      lineHeight: 80,
      bgColor: 'rgba(0, 0, 0, 0)',
      textColor: '#4CD7FF',
    });
    const imageStream = dataUriToBuffer(dataURI);
    const attachment = new MessageAttachment(imageStream, 'cr-math.jpg');

    const filter = (response) => {
      return String(word) === String(response.content);
    };

    const msg = await channel.send('🍯 Unscramble', attachment);

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
				// setTimeout(() => {
				// 	message.channel.fetchMessages({
				// 		limit: 100
				// 	}).then(messages => {
				// 		messages = messages.filter(m => m.author.id === "455962755682402314").array().slice(0, 2);
				// 		message.channel.bulkDelete(messages)
				// 			.catch(console.log)
				// 	})
				// 	collected.first().delete();
				// }, 5000)
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
