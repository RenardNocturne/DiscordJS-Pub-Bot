const { loadEvents, loadButtons, loadCommands } = require('./Utils/loader')
const { Intents, Client, Collection} = require('discord.js');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]});

client.commands = new Collection();
client.buttons = new Collection();

loadCommands(client);
loadEvents(client);
loadButtons(client);

client.config = require('./Utils/config');

console.log(client.config.TOKEN);
client.login(client.config.TOKEN).catch(err => console.error("❌ I can't log in ! Have you forgot to run node .\\init.js ? Have you provided a valid token ? \n \n Error:" + err));