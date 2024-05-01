const
    {
        Client,
        GatewayIntentBits: GIB,
        ActivityType,
        Partials,
        EmbedBuilder,
        PresenceUpdateStatus: Presence,
        Collection,
    } = require('discord.js'),
    { Routes } = require('discord-api-types/v10'),
    { REST } = require('@discordjs/rest'),
    { config } = require('dotenv'),
    Utils = require('./modules/util'),
    {
        Time,
        List,
        Discord: {
            Initializers: {
                Components: { _Button, _ContextMenu, _Modal, _SelectMenu },
                _Command,
                Event: _Ev,
                _Trigger,
                _Message,
            },
        },
    } = Utils,
    chalk = require('chalk'),
    fs = require('fs'),
    os = require('os');
config({ path: [`${__dirname}/.env`, `${process.cwd()}/.env`, './.env'].find((f) => fs.existsSync(f)) });

const mainClient = new Client({
    intents: Array.from(Object.values(GIB)),
    partials: Array.from(Object.values(Partials)),
    presence: {
        activities: [],
        status: Presence.Online,
    },
});

/** @type {Collection<string, _Button>} */
const Buttons = new Collection();
/** @type {Collection<string, _ContextMenu>} */
const ContextMenus = new Collection();
/** @type {Collection<string, _Modal>} */
const Modals = new Collection();
/** @type {Collection<string, _SelectMenu>} */
const SelectMenus = new Collection();

/** @type {Collection<string, _Command>} */
const Commands = new Collection();
/** @type {Collection<string, _Ev>} */
const Events = new Collection();
/** @type {Collection<string, _Trigger>} */
const Triggers = new Collection();
// eslint-disable-next-line @stylistic/max-len
/** @type {Collection<"buttons", Buttons>&Collection<"contextMenus", ContextMenus>&Collection<"modals", Modals>&Collection<"selectMenus", SelectMenus>} */
const Components = new Collection()
    .set('buttons', Buttons)
    .set('contextMenus', ContextMenus)
    .set('modals', Modals)
    .set('selectMenus', SelectMenus);

/** @type {Collection<string, _Message>} */
const PredefinedMessages = new Collection();

/** @type {Set<[int, string]>} */
const statuses = new Set()
    .add([ActivityType.Watching, 'The Server'])

const client = Object.assign(mainClient, {
    stats: () => {
        const botRam = process.memoryUsage().heapTotal;
        const rawBRam = (botRam / 1024 ** 2);
        const globalRam = os.totalmem() - os.freemem();
        const rawGRam = (globalRam / 1024 ** 2);
        return {
            ping: client.ws.ping,
            uptime: List.and(Time.elapsedTime(Math.floor(process.uptime())).split(', ')),
            guilds: client.guilds.cache.size.toString(),
            ram: {
                botOnly: {
                    rawValue: (rawBRam > 1024 ? rawBRam / 1024 : rawBRam).toFixed(2),
                    percentage: (botRam / os.totalmem() * 1e2).toFixed(2),
                    unit: botRam / 1024 ** 3 > 1 ? 'GB' : 'MB',
                },
                global: {
                    rawValue: (rawGRam > 1024 ? rawGRam / 1024 : rawGRam).toFixed(2),
                    percentage: (globalRam / os.totalmem() * 1e2).toFixed(2),
                    unit: globalRam / 1024 ** 3 > 1 ? 'GB' : 'MB',
                },
            },
        };
    },
    embed: () => new EmbedBuilder({
        footer: { text: '' },
        color: 0x2F3136,
    }).setTimestamp(),
    runtimeStats: {
        commands: {
            text: new Utils.RuntimeStatistics(),
            slash: new Utils.RuntimeStatistics(),
        },
        triggers: {
            registered: 0,
            role: new Utils.RuntimeStatistics(),
            user: new Utils.RuntimeStatistics(),
            channel: new Utils.RuntimeStatistics(),
            message: new Utils.RuntimeStatistics(),
        },
        events: Object.assign(new Utils.RuntimeStatistics(), { sEE: {} }),
        components: {
            modals: new Utils.RuntimeStatistics(),
            buttons: new Utils.RuntimeStatistics(),
            selectMenus: new Utils.RuntimeStatistics(),
            contextMenus: new Utils.RuntimeStatistics(),
        },
        predefinedMessages: new Utils.RuntimeStatistics(),
    },
    baseDir: __dirname,
    configs: {
        prefix: process.env.PREFIX ?? '',
        defaults: {
            disabled: 'This command is currently disabled',
            noPerms: 'You do not have permission to use this command.',
            dmDisabled: 'This command is disabled in DMs.',
            invalidChannelType: 'This command cannot be used in this channel type.',
        },
    },
    gRTS: (key) => eval(`client.runtimeStats.${key}`),
    gev: (name) => client.runtimeStats.events.sEE[`${name}`] = new Utils.RuntimeStatistics(),
    regRTS: (key) => client.gRTS(key).reg(),
    bumpRTS: (key) => client.gRTS(key).exec(),
    Commands,
    Events,
    Triggers,
    Components,
    PredefinedMessages,
    statuses,
    Utils,
});

const interactions = [];
const operations = [
    [
        `${__dirname}/events`,
        (event) => {
            Events.set(event.event, event);
            client.regRTS('events');
            client.gev(event.event);
            client.on(event.event, (...args) => {
                client.bumpRTS(`events.sEE.${event.event}`);
                return event.execute(client, ...args);
            });
            console.log(chalk`{bold Loaded event} {green ${event.event}}`);
        },
    ],
    [
        `${__dirname}/commands`,
        (command) => {
            Commands.set(command.name, command);
            if (command.type.text) {
                client.regRTS('commands.text');
            }
            if (command.type.slash) {
                client.regRTS('commands.slash');
                interactions.push(command.data.toJSON());
            }
            console.log(chalk`{bold Loaded command} {blue ${command.name}}`);
        },
    ],
    [
        `${__dirname}/triggers`,
        (trigger) => {
            Triggers.set(trigger.name, trigger);
            if (trigger.triggerConfig.channel.activated) {
                client.regRTS('triggers.channel');
            }
            if (trigger.triggerConfig.role.activated) {
                client.regRTS('triggers.role');
            }
            if (trigger.triggerConfig.user.activated) {
                client.regRTS('triggers.user');
            }
            if (trigger.triggerConfig.message.activated) {
                client.regRTS('triggers.message');
            }
            console.log(chalk`{bold Loaded trigger} {yellow ${trigger.name}}`);
        },
    ],
    [
        `${__dirname}/components/contextMenus`,
        (command) => {
            Components.get('contextMenus').set(command.name, command);
            client.regRTS('components.contextMenus');
            interactions.push(command.data.toJSON());
            console.log(chalk`{bold Loaded contextMenu} {magenta ${command.name}}`);
        },
    ],
    [
        `${__dirname}/components/buttons`,
        (command) => {
            Components.get('buttons').set(command.name, command);
            client.regRTS('components.buttons');
            console.log(chalk`{bold Loaded button} {cyan ${command.name}}`);
        },
    ],
    [
        `${__dirname}/components/selectMenus`,
        (command) => {
            Components.get('selectMenus').set(command.name, command);
            client.regRTS('components.selectMenus');
            console.log(chalk`{bold Loaded selectMenu} {red ${command.name}}`);
        },
    ],
    [
        `${__dirname}/components/modals`,
        (command) => {
            Components.get('modals').set(command.name, command);
            client.regRTS('components.modals');
            console.log(chalk`{bold Loaded modal} {red ${command.name}}`);
        },
    ],
    [
        `${__dirname}/messages`,
        /** @param {_Message} msg */
        (msg) => {
            const gv = msg.getValue;
            PredefinedMessages.set(msg.name, Object.assign(msg, {
                getValue: (c) => {
                    client.bumpRTS('predefinedMessages');
                    return gv(c);
                },
            }));
            client.regRTS('predefinedMessages');
            console.log(chalk`{bold Loaded Pre-defined message} {red ${msg.name}}`);
        },
    ],
];

// ? Sectors:
// ? 0: Directory,
// ? 1: Operation

operations
    .forEach((sect) => fs.readdirSync(sect[0])
        .filter((file) => file !== 'example.js')
        .map((file) => require(`${sect[0]}/${file}`))
        .forEach(sect[1]));
new REST({ version: '10' })
    .setToken(process.env.TOKEN)
    .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: interactions })
    .then(() => console.log(chalk.green`Successfully registered application commands.`))
    .catch(console.error);
client.login(process.env.TOKEN);
module.exports = client;
