const { Client, Collection } = require('discord.js');
const { prefix, token } = require('./config.js');
const crWord = require('./events/word.js');
const crScramble = require('./events/unscramble.js');
const crMath = require('./events/math.js');
const crIdentify = require('./events/identify.js');
const { readdirSync } = require('fs');
const { registerFont } = require('canvas');

registerFont('./assets/fonts/CircularStd-Book.ttf', { family: 'Circular' });

const client = new Client();

client.commands = new Collection();

const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const cooldowns = new Collection();

client.once('ready', () => {
  client.user.setActivity(`${prefix}help`);
  console.log('Ready');
});

client.on('message', (message) => {
  if (message.author.bot) return;

  if (Math.floor(Math.random() * 100) + 1 === 3 && !message.author.bot) {
    // const channel = message.guild.channels.cache.find(
    //   (c) => c.name.includes('chat-react') || c.name.includes('chatreact')
    // );
		const channel = message.channel;
    const i = Math.floor(Math.random() * 4) + 1;
    if (i === 1) crWord.execute(client, channel, message.guild);
    if (i === 2) crMath.execute(client, channel, message.guild);
    if (i === 3) crScramble.execute(client, channel, message.guild);
    if (i === 4) crIdentify.execute(client, channel, message.guild);
  }

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply(`I can't execute that command inside DMs!`);
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
          command.name
        }\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
  }
});

client.login(token);
