const { Client, GatewayIntentBits, ActivityType, Partials } = require('discord.js');
require('dotenv').config();
const {
    TOKEN: token,
    PREFIX: prefix,
    CLIENT_ID: clientID,
} = process.env;
const Utils = require('./functions/massClass');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const chalk = require('chalk');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.ThreadMember
    ]
});

client.Utils = Utils
client.configs = {
    prefix: prefix,
}

fs
    .readdirSync('./events')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const event = require(`./events/${file}`);
        console.log(chalk.green`Loaded event ${event.name}`);
        (event.once) ?
            client.once(event.name, (...args) => event.execute(...args, client))
            : client.on(event.name, (...args) => event.execute(...args, client))
    });

const interactions = [];

fs
    .readdirSync('./commands')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const command = require(`./commands/${file}`);
        console.log(chalk.green`Loaded command ${command.name}`);
        interactions.push(command.data.toJSON());
    });

fs
    .readdirSync('./components/contextMenus')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const command = require(`./components/contextMenus/${file}`);
        console.log(chalk.green`Loaded context menu ${command.name}`);
        interactions.push(command.data.toJSON());
    });

new REST({ version: '10' })
    .setToken(token)
    .put(Routes.applicationCommands(clientID), { body: interactions })
    .then(() => console.log(chalk.green`Successfully registered application commands.`))
    .catch(console.error);

client.login(token);