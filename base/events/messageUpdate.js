const { Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageUpdate,
    once: false,
    async execute(oldMessage, newMessage, client) {
        client.bumpEvent(Events.MessageUpdate);
        // Ignore if the message is the same, if the author is a bot, if the message is in a DM, or if the message is partial
        if (newMessage.content === oldMessage.content ||
            newMessage.author.bot ||
            newMessage.channel.type === 'DM' ||
            newMessage.partial) return;

        // Code for triggers
        if (newMessage.content.startsWith(client.configs.prefix)) {
            const commandBase = newMessage.content.split(' ')[0].slice(client.configs.prefix.length).toLowerCase();
            const data = client.Commands.get(commandBase);
            if (!data || !data.type.text) return;
            if (data.blockDM && message.channel.isDMBased()) return newMessage.reply({ content: client.configs.defaults.dmDisabled });
            else if (data.channelLimits && !data.channelLimits.includes(newMessage.channel.type)) return newMessage.reply({ content: client.configs.defaults.invalidChannelType });
            else if (data.requiredPerm && message.guild && !newMessage.member.permissions.has(data.requiredPerm)) return newMessage.reply({ content: client.configs.defaults.noPerms });
            else if (data.allowedRoles && !message.member.roles.cache.some(role => data.allowedRoles.includes(role.id))) return newMessage.reply({ content: client.configs.defaults.noPerms });
            else if (data.allowedUsers && !data.allowedUsers.includes(newMessage.author.id)) return newMessage.reply({ content: client.configs.defaults.noPerms });
            else if (data.disabled) return newMessage.reply({ content: client.config.defaults.disabled });
            else return data.messageExecute(message, client);
        }
        // Do stuff here
    },
};