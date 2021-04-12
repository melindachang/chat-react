module.exports = {
	name: 'ping',
	description: 'Ping!',
	category: 'General',
	cooldown: 1,
	execute(client, message) {
		message.channel.send('Pong.');
	},
};