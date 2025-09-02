// index.js
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, ClientUser, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Discord.Client({
  intents: [
    // (your intents here)
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,


  ],
});

const prefix = '.';

// Collection to hold all commands
client.commands = new Map();

// Load commands from /commands folder
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Message event:
client.on('messageCreate', async message => {
  console.log(`Message received: ${message.content} from ${message.author.tag}`);
  console.log("Is message a reply?", !!message.reference);

  // Ignore bots and messages without prefix
  if (message.author.id === client.user.id || !message.content.startsWith(prefix)) return;

  // Split command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Get command and run it
  if (client.commands.has(commandName)) {
    try {
      await client.commands.get(commandName).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing that command.');
    }

  }
});

client.once('ready', () => {
  console.log('Bot is online');
});

client.login(process.env.BOT_TOKEN);
