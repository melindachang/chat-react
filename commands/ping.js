module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	execute(client, message) {
		message.channel.send('Pong.');
	},
};