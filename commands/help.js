const { prefix } = require('./../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 1,
  execute(client, message, args) {
    const { commands } = message.client;
    let data = [];

    if (!args.length) {
      const embed = new MessageEmbed()
        .setColor('#4CD7FF')
        .setTitle(`Bot Commands`)
        .setDescription(
          `The prefix of the bot on this server is \`${prefix}\` For more information about a specific command, try: \`cr!help (command).`
        )
        .addField('⚙️ General — 2', '```help, ping, invite```', true)
        .addField('🛠️ Settings — 0', '``` ```', true)
        .addField('💰 Currency — 0', '``` ```', true)
        .setFooter(
          'To view a specific command do cr!help [command]',
          client.user.displayAvatarURL()
        );

      return message.channel.send(embed);
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      const embed = new MessageEmbed()
        .setColor('#f5386a')
        .setTitle('Query Error')
        .setDescription('Could not locate that command')
        .setFooter(
          `For more information try ${prefix}help (command). ex: ${prefix}help set or ${prefix}help top`,
          client.user.displayAvatarURL()
        );

      return message.channel.send(embed).then((msg) => {
        msg.delete({ timeout: 15000 });
      });
    }

    data.push(command.name);

    if (command.aliases) data.push(command.aliases.join(', '));
    if (command.description) data.push(command.description);
    data.push(`${prefix}${command.name} ${command.usage || ''}`);

    data.push(`${command.cooldown || 3} second(s)`);

    const embed = new MessageEmbed()
      .setColor('#0BCCAD')
      .setTitle(`Help | ${data[0]}`)
      .setDescription(`${data[2]}\n\n**Aliases:** ${data[1]}\n**Usage:** ${data[3]}`)
      .addField('Cooldown', `\`${data[4]}\``)
      .setFooter('To view all commands do shu help', client.user.displayAvatarURL());

    message.channel.send(embed);
  },
};
