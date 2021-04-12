const { owners } = require('./../config.js');

module.exports = {
  name: 'reboot',
  description: 'Reboots bot',
  aliases: ['rb'],
  args: false,
  async execute(client, message, args) {
    if (!owners.includes(message.author.id)) return;
    await message.channel.send('Rebooting');
    process.exit(1);
  },
};
