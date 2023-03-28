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
        fs
        .readdirSync('./triggers')
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            const triggerData = require(`../triggers/${file}`);
            if (
                !triggerData.terms ||
                !triggerData.execute ||
                (triggerData.requirePrefix &&
                    !message.content.toLowerCase().startsWith(client.config.prefix))
            ) return;
            triggerData.terms.forEach((term) => {
                if (triggerData.requirePrefix) {
                    if (message.content.toLowerCase().startsWith(client.config.prefix + term)) {
                        triggerData.execute(message, client);
                        return
                    }
                } else {
                    if (message.content.toLowerCase().includes(term)) {
                        triggerData.execute(message, client);
                        return
                    }
                }
            })
        })
        // Do stuff here
    },
};