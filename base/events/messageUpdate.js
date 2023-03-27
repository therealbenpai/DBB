const { Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageUpdate,
    once: false,
    async execute(oldMessage, newMessage, client) {
        // Ignore if the message is the same, if the author is a bot, if the message is in a DM, or if the message is partial
        if (newMessage.content === oldMessage.content ||
            newMessage.author.bot ||
            newMessage.channel.type === 'DM' ||
            newMessage.partial) return;
        
        // Code for triggers
        const triggers = fs.readdirSync(`${process.cwd()}/triggers`).filter(file => file.endsWith('.js'));
        for (const file of triggers) {
            const triggerData = require(`../triggers/${file}`);
            for (const term of triggerData.terms) {
                if (newMessage.content.toLowerCase().includes(term.toLowerCase())) {
                    triggerData.execute(newMessage, client);
                    return;
                }
            }
        }
        // Do stuff here
    },
};