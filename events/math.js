const { MessageEmbed, MessageAttachment } = require('discord.js');
const randomMathQuestion = require('random-math-question');
const textToImage = require('text-to-image');
const dataUriToBuffer = require('data-uri-to-buffer');

module.exports = {
  name: 'cr-math',
  description: 'cr-math',
  cooldown: 1,
  async execute(client, channel, guild) {
    let timestamp = +new Date();

    let { question, answer } = randomMathQuestion.get({
      numberRange: '1-10',
      amountOfNumber: '2-5',
      operations: ['*', '+', '-'],
      nagative: {
        containsNagatives: true,
        negativeChance: '20%',
      },
      exponent: {
        containsExponents: false,
        exponentChance: '0%',
        exponentRange: '0-0',
      },
    });

    const dataURI = await textToImage.generate(question.split('*').join('x'), {
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
      return String(answer) === String(response.content);
    };

    const msg = await channel.send('📊 Calculate', attachment);

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
  },
};
