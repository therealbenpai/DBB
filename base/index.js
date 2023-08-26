const {
    Client,
    GatewayIntentBits,
    ActivityType,
    Partials,
    EmbedBuilder,
    PresenceUpdateStatus
} = require('discord.js');

const Utils = require('./functions/massClass');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const chalk = require('chalk');
require('dotenv').config();
const {
    TOKEN: token,
    PREFIX: prefix,
    CLIENT_ID: clientID,
} = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
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
    ],
    presence: {
        activities: [
            {
                type: ActivityType.Watching,
                name: 'Sanrio Cottage'
            }
        ],
        status: PresenceUpdateStatus.DoNotDisturb,
    }
});

const branding = {
    footer: {
        text: 'Filler Text'
    }
}

client.Utils = Utils
client.configs = {
    prefix: prefix ?? '',
    defaults: {
        disabled: 'This command is currently disabled',
        noPerms: 'You do not have permission to use this command.',
        dmDisabled: 'This command is disabled in DMs.',
        invalidChannelType: 'This command cannot be used in this channel type.',
    },
}

client.embed = () => new EmbedBuilder()
    .setColor(0x00FF00)
    .setFooter(branding.footer)
    .setTimestamp();

fs
    .readdirSync('./events')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const event = require(`./events/${file}`);
        console.log(chalk`{bold Loaded event} {green ${event.name}}`);
        (event.once) ?
            client.once(event.name, (...args) => event.execute(...args, client))
            : client.on(event.name, (...args) => event.execute(...args, client))
    });

const interactions = [];

fs
    .readdirSync('./commands')
    .filter(file => file.endsWith('.js'))
    .map(file => require(`./commands/${file}`))
    .filter(command => command.type.slash === true)
    .forEach(command => {
        console.log(chalk`{bold Loaded command} {blue ${command.name}}`);
        interactions.push(command.data.toJSON());
    });

fs
    .readdirSync('./components/contextMenus')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const command = require(`./components/contextMenus/${file}`);
        console.log(chalk`{bold Loaded context menu} {red ${command.name}}`);
        interactions.push(command.data.toJSON());
    });

new REST({ version: '10' })
    .setToken(token)
    .put(Routes.applicationCommands(clientID), { body: interactions })
    .then(() => console.log(chalk.green`Successfully registered application commands.`))
    .catch(console.error);

client.login(token);