const { Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message, client) {
        // Ignore if the author is a bot, if the message is in a DM, or if the message is partial
        if (message.author.bot ||
            message.channel.type === 'DM' ||
            message.partial) return;
        
        // Code for triggers
        const triggers = fs.readdirSync('./triggers').filter(file => file.endsWith('.js'));
        for (const file of triggers) {
            const triggerData = require(`../triggers/${file}`);
            for (const term of triggerData.terms) {
                if (message.content.toLowerCase().includes(term.toLowerCase())) {
                    triggerData.execute(message, client);
                    return;
                }
            }
        }
        // Do stuff here
    },
};