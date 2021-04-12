const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "invite",
	description: "Get bot invite link",
	category: 'General',
	aliases: ['inv'],
	cooldown: 1,
	args: false,
	execute(client, message) {
		const embed = new MessageEmbed()
			.setColor('#4CD7FF')
			.addField('Add me to your server!', '[Invite](https://discord.com/api/oauth2/authorize?client_id=455962755682402314&permissions=388160&scope=bot)')
		message.channel.send(embed);
	}
}