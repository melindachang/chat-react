const { owners, prefix } = require('./../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'reload',
  description: 'Reloads a command',
	category: 'Developer',
  aliases: ['rl'],
  args: true,
  execute(client, message, args) {
    if (!owners.includes(message.author.id)) return;
    
    const commandName = args[0].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      const embed = new MessageEmbed()
        .setColor('#f5386a')
        .setTitle('Query Error')
        .setDescription('Could not locate the specified command.')

      return message.channel.send(embed).then((msg) => {
        msg.delete({ timeout: 15000 });
      });
    }


    delete require.cache[require.resolve(`./${command.name}.js`)];

    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`Command \`${command.name}\` was reloaded!`);
    } catch (error) {
      console.log(error);
      message.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
      );
    }
  },
};
