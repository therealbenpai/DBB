const { Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * 
     * @param {import('discord.js').Client} client 
     */
    async execute(client) {
        client.bumpEvent(Events.ClientReady);
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
                modals: client.Components.get('modals').size
            },
            events: client.Events.size,
            triggers: client.Triggers.size
        }
        console.log(chalk`{bold [READY]} Logged in as {red ${client.user.username}}!`);
        console.log(chalk`{bold [READY]} Current ping: {rgb(255,127,0) ${currentStats.ping} ms}`);
        console.log(chalk`{bold [READY]} Current guilds: {yellow ${currentStats.guilds}}`);
        console.log(chalk`{bold [READY]} Current users: {green ${currentStats.users}}`);
        console.log(chalk`{bold [READY]} Current channels: {blue ${currentStats.channels}}`);
        console.log(chalk`{bold [READY]} Current commands: {rgb(180,0,250) ${currentStats.commands}}`);
        console.log(chalk`{bold [READY]} Current components: {rgb(255,100,100) ${Object.values(currentStats.components).reduce((a, b) => a + b, 0)}}`);
        console.log(chalk`{bold [READY]} Current events: {white ${currentStats.events}}`);
        console.log(chalk`{bold [READY]} Current triggers: {grey ${currentStats.triggers}}`);
    },
};