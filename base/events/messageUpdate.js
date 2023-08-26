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
        if (newMessage.content.startsWith(client.configs.prefix)) {
            const commandBase = newMessage.content.split(' ')[0].slice(client.configs.prefix.length).toLowerCase();

            for (let data of fs
                .readdirSync('./commands')
                .filter(file => file.endsWith('.js'))
                .map(file => require(`../commands/${file}`))
                .filter(command => command.triggers.includes(commandBase) && command.type.text === true)
            ) {
                if (data.blockDM && newMessage.channel.isDMBased()) return newMessage.reply({ content: client.configs.defaults.dmDisabled });
                else if (data.channelLimits.length && !data.channelLimits.includes(newMessage.channel.type)) return newMessage.reply({ content: client.configs.defaults.invalidChannelType });
                else if (data.requiredPerm && newMessage.guild && !newMessage.member.permissions.has(data.requiredPerm)) return newMessage.reply({ content: client.configs.defaults.noPerms });
                else if (data.allowedRoles.length && !newMessage.member.roles.cache.some(role => data.allowedRoles.includes(role.id))) return newMessage.reply({ content: client.configs.defaults.noPerms });
                else if (data.allowedUsers.length && !data.allowedUsers.includes(newMessage.author.id)) return newMessage.reply({ content: client.configs.defaults.noPerms });
                else if (data.disabled) return newMessage.reply({ content: client.config.defaults.disabled });
                else return data.messageExecute(newMessage, client);
            }
        }
        // Do stuff here
    },
};