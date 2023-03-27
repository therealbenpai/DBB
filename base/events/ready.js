const { Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const currentStats = {
            ping: client.ws.ping,
            guilds: client.guilds.cache.size,
            users: client.users.cache.size,
            channels: client.channels.cache.size,   
        }
        console.log(chalk.bold`[READY] Logged in as {red ${client.user.tag}}!`);
        console.log(chalk.bold`[READY] Current ping: {green ${currentStats.ping}}ms`);
        console.log(chalk.bold`[READY] Current guilds: {blue ${currentStats.guilds}}`);
        console.log(chalk.bold`[READY] Current users: {yellow ${currentStats.users}}`);
        console.log(chalk.bold`[READY] Current channels: {red ${currentStats.channels}}`);
    },
};