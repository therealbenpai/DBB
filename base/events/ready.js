const { Events } = require('discord.js');
const { Discord: { Initializers: { Event } } } = require('../modules/util.js');

module.exports = new Event(Events.ClientReady)
    .setExecute(async (client) => {
        const currentStats = {
            ping: Math.max(client.ws.ping, 0),
            guilds: client.guilds.cache.size,
            users: client.users.cache.size,
            channels: client.channels.cache.size,
            commands: client.Commands.size,
            components: {
                contextMenus: client.Components.get('contextMenus').size,
                buttons: client.Components.get('buttons').size,
                selectMenus: client.Components.get('selectMenus').size,
                modals: client.Components.get('modals').size,
            },
            events: client.Events.size,
            triggers: client.Triggers.size,
        };
        Array
            .of(`Logged in as {red ${client.user.username}}!`)
            .concat(Array.of(
                `Ping: {rgb(255,127,0) ${currentStats.ping} ms}`,
                `Guilds: {yellow ${currentStats.guilds}}`,
                `Users: {green ${currentStats.users}}`,
                `Channels: {blue ${currentStats.channels}}`,
                `Commands: {rgb(180,0,250) ${currentStats.commands}}`,
                `Components: {rgb(255,100,100) ${Object.values(currentStats.components)
                    .reduce((value1, value2) => value1 + value2, 0)
                }}`,
                `Events: {white ${currentStats.events}}`,
                `Triggers: {grey ${currentStats.triggers}}`,
                `Pre-defined messages: {cyan ${client.PredefinedMessages.size}}`,
                `Statuses selection size: {rgb(0,255,255) ${client.statuses.size}}`,
            )
                .map((m) => `Current ${m}`))
            .map((m) => `{bold [READY]} ${m}`)
            .forEach((m) => import('chalk-template').then(({ template }) => console.log(template(m))));
        setInterval(() => {
            const [type, name] = Array.from(client.statuses).sort(() => Math.random() - 0.5)[0];
            client.user.setPresence({ activities: [{ type, name }] });
        }, 15e3);
    });
