const { Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const currentStats = {
            ping: {
                value: Math.max(client.ws.ping, 0),
                color: ''
            },
            guilds: client.guilds.cache.size,
            users: client.users.cache.size,
            channels: client.channels.cache.size,   
        }
        if (currentStats.ping.value < 100) currentStats.ping.color = 'green';
        else if (currentStats.ping.value < 200) currentStats.ping.color = 'yellow';
        else if (currentStats.ping.value < 300) currentStats.ping.color = 'rgb(255,127,0)';
        else if (currentStats.ping.value < 400) currentStats.ping.color = 'red';
        console.log(chalk`{bold [READY]} Logged in as {red ${client.user.tag}}!`);
        console.log(chalk`{bold [READY]} Current ping: {${currentStats.ping.color} ${currentStats.ping.value} ms}`);
        console.log(chalk`{bold [READY]} Current guilds: {blue ${currentStats.guilds}}`);
        console.log(chalk`{bold [READY]} Current users: {yellow ${currentStats.users}}`);
        console.log(chalk`{bold [READY]} Current channels: {rgb(255,127,0) ${currentStats.channels}}`);
    },
};