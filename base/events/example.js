const { Events } = require('discord.js');
const { Discord: { Initializers: { Event } } } = require('../modules/util.js');

module.exports = new Event(Events.EVENT)
    .setExecute(async (_client, ..._args) => { /* Do Stuff Here */ });
