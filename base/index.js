const {
    Client,
    GatewayIntentBits,
    ActivityType,
    Partials,
    EmbedBuilder,
    PresenceUpdateStatus,
    Collection
} = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const chalk = require('chalk');
const os = require('os');
require('dotenv').config({ path: `${__dirname}/.env` });
//- Internal Functions
const Utils = require('./functions/massClass');
//- Constants
const baseDir = __dirname;
const {
    TOKEN: token,
    PREFIX: prefix,
    CLIENT_ID: clientID,
} = process.env;
//- Component Collections
const buttons = new Collection();
const selectMenus = new Collection();
const contextMenus = new Collection();
const modals = new Collection();
//- Base Collections
const commands = new Collection();
const events = new Collection();
const components = new Collection();
const triggers = new Collection();
const client = new Client({
    intents: Array.from(Object.values(GatewayIntentBits)),
    partials: Array.from(Object.values(Partials)),
    presence: {
        activities: [{ type: ActivityType.Watching, name: 'Filler Text' }],
        status: PresenceUpdateStatus.DoNotDisturb,
    }
});

client.bumpEvent = (evName) => {
    if (!client.runtimeStats.events.singularEventExecutions[evName]) client.runtimeStats.events.singularEventExecutions[evName] = 0;
    client.runtimeStats.events.singularEventExecutions[evName]++;
    client.runtimeStats.events.executed++;
}

const branding = {
    footer: {
        text: 'Filler Text'
    },
    color: 0x2F3136,
}

const runtimeStats = {
    commands: {
        registered: 0,
        textExecuted: 0,
        slashExecuted: 0,
    },
    triggers: {
        registered: 0,
        channelExecuted: 0,
        roleExecuted: 0,
        userExecuted: 0,
        messageExecuted: 0,
    },
    events: {
        registered: 0,
        executed: 0,
        singularEventExecutions: {}
    },
    components: {
        buttons: {
            registered: 0,
            executed: 0,
        },
        selectMenus: {
            registered: 0,
            executed: 0,
        },
        contextMenus: {
            registered: 0,
            executed: 0,
        },
        modals: {
            registered: 0,
            executed: 0,
        },
    },

}

client.runtimeStats = runtimeStats;

client.stats = () => {
    const stats = {
        ping: client.ws.ping,
        uptime: Utils.Formatter.list(Utils.Time.elapsedTime(Math.floor(process.uptime())).split(', ')),
        guilds: client.guilds.cache.size.toString(),
        ram: {
            botOnly: {
                rawValue: (process.memoryUsage().heapTotal / (1024 ** 2)).toFixed(2),
                percentage: ((process.memoryUsage().heapTotal / os.totalmem()) * 100).toFixed(2),
                unit: 'MB'
            },
            global: {
                rawValue: ((os.totalmem() - os.freemem()) / (1024 ** 2)).toFixed(2),
                percentage: (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2),
                unit: 'MB'
            }
        }
    }
    if (stats.ram.botOnly.rawValue > 1024) {
        stats.ram.botOnly.rawValue = (stats.ram.botOnly.rawValue / 1024).toFixed(2);
        stats.ram.botOnly.unit = 'GB';
    }
    if (stats.ram.global.rawValue > 1024) {
        stats.ram.global.rawValue = (stats.ram.global.rawValue / 1024).toFixed(2);
        stats.ram.global.unit = 'GB';
    }

    return stats;
}

client.baseDir = baseDir

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

client.embed = () => new EmbedBuilder(branding).setTimestamp();

fs
    .readdirSync(`${__dirname}/events`)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const event = require(`${__dirname}/events/${file}`);
        console.log(chalk`{bold Loaded event} {green ${event.name}}`);
        events.set(event.name, event);
        client.runtimeStats.events.registered++;
        (event.once) ?
            client.once(event.name, (...args) => event.execute(...args, client))
            : client.on(event.name, (...args) => event.execute(...args, client))
    });

const interactions = [];

const operations = [
    [`${__dirname}/commands`, (command) => {
        if (command.type.slash !== true) return;
        commands.set(command.name, command);
        console.log(chalk`{bold Loaded command} {blue ${command.name}}`);
        client.runtimeStats.commands.registered++;
        interactions.push(command.data.toJSON());
    }],
    [`${__dirname}/components/contextMenus`, (command) => {
        contextMenus.set(command.name, command);
        console.log(chalk`{bold Loaded contextMenu} {red ${command.name}}`);
        client.runtimeStats.components.contextMenus.registered++;
        interactions.push(command.data.toJSON());
    }],
    [`${__dirname}/components/buttons`, (command) => {
        buttons.set(command.name, command);
        console.log(chalk`{bold Loaded button} {red ${command.name}}`);
        client.runtimeStats.components.buttons.registered++;
    }],
    [`${__dirname}/components/selectMenus`, (command) => {
        selectMenus.set(command.name, command);
        console.log(chalk`{bold Loaded selectMenu} {red ${command.name}}`);
        client.runtimeStats.components.selectMenus.registered++;
    }],
    [`${__dirname}/components/modals`, (command) => {
        modals.set(command.name, command);
        console.log(chalk`{bold Loaded modal} {red ${command.name}}`);
        client.runtimeStats.components.modals.registered++;
    }],
    [`${__dirname}/triggers`, (trigger) => {
        triggers.set(trigger.name, trigger);
        console.log(chalk`{bold Loaded trigger} {red ${trigger.name}}`);
        client.runtimeStats.triggers.registered++;
    }],
]

operations.forEach(([x, c]) => fs.readdirSync(x).filter(file => file.endsWith('.js')).map(file => require(`${x}/${file}`)).forEach(c))

components.set('buttons', buttons);
components.set('selectMenus', selectMenus);
components.set('contextMenus', contextMenus);
components.set('modals', modals);

client.Commands = commands;
client.Events = events;
client.Components = components;
client.Triggers = triggers;

new REST({ version: '10' })
    .setToken(token)
    .put(Routes.applicationCommands(clientID), { body: interactions })
    .then(() => console.log(chalk.green`Successfully registered application commands.`))
    .catch(console.error);

client.login(token);

module.exports = client;