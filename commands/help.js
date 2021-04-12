const { prefix } = require('./../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
	category: 'General',
  aliases: ['h', 'commands'],
  usage: '[command name]',
  cooldown: 1,
  execute(client, message, args) {
    const { commands } = message.client;
		let getCount = (cat) => {
			return Array.from(commands.filter(i => i.category.toLowerCase() === cat)).length
		}
		let getCommands = (cat) => {
			return commands.filter(i => i.category.toLowerCase() === cat).map(i => i.name).join(', ')
		}		

    let data = [];
    if (!args.length) {
      const embed = new MessageEmbed()
        .setColor('#4CD7FF')
        .setTitle(`Bot Commands`)
        .setDescription(
          `This bot's prefix is \`${prefix}\`.`
        )
        .addField(`⚙️ General — ${getCount('general')}`, `\`\`\`${getCommands('general')}\`\`\``, true)
        .addField(`🛠️ Developer — ${getCount('developer')}`, `\`\`\`${getCommands('developer')}\`\`\``, true)
        // .addField('💰 Currency — 0', '``` ```', true)
        .setFooter(
          `To view a specific command do ${prefix}help [command].`,
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
        .setDescription('Could not locate the specified command.')
        .setFooter(
          `For more information try ${prefix}help (command). ex: ${prefix}help ping`,
          client.user.displayAvatarURL()
        );

      return message.channel.send(embed).then((msg) => {
        msg.delete({ timeout: 15000 });
      });
    }

    data.push(command.name);
    data.push(command.description);
		command.category ? data.push(command.category) : data.push('None');
    command.aliases ? data.push(command.aliases.join(', ')) : data.push('None');
    data.push(`${prefix}${command.name} ${command.usage || ''}`);
    data.push(`${command.cooldown || 3} second(s)`);

    const embed = new MessageEmbed()
      .setColor('#0BCCAD')
      .setTitle(`Help | ${data[0]}`)
      .setDescription(`${data[1]}\n\n**Category:** ${data[2]}\n**Aliases:** ${data[3]}\n**Usage:** ${data[4]}`)
      .addField('Cooldown', `\`${data[5]}\``)
      .setFooter(`To view all commands do ${prefix}help`, client.user.displayAvatarURL());

    message.channel.send(embed);
  },
};
