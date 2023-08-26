const { Events, MessageType, Message } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    /**
     * @param {import('discord.js').Message} message 
     * @param {import('discord.js').Client} client 
     * @returns 
     */
    async execute(message, client) {
        if (message.author.bot || message.partial) return;

        if (message.content.startsWith(client.configs.prefix)) {
            const commandBase = message.content.split(' ')[0].slice(client.configs.prefix.length).toLowerCase();
            for (let data of fs
                .readdirSync('./commands')
                .filter(file => file.endsWith('.js'))
                .map(file => require(`../commands/${file}`))
                .filter(command => command.triggers.includes(commandBase) && command.type.text === true)
            ) {
                if (data.blockDM && message.channel.isDMBased()) return message.reply({ content: client.configs.defaults.dmDisabled });
                else if (data.channelLimits && !data.channelLimits.includes(message.channel.type)) return message.reply({ content: client.configs.defaults.invalidChannelType });
                else if (data.requiredPerm && message.guild && !message.member.permissions.has(data.requiredPerm)) return message.reply({ content: client.configs.defaults.noPerms });
                else if (data.allowedRoles && !message.member.roles.cache.some(role => data.allowedRoles.includes(role.id))) return message.reply({ content: client.configs.defaults.noPerms });
                else if (data.allowedUsers && !data.allowedUsers.includes(message.author.id)) return message.reply({ content: client.configs.defaults.noPerms });
                else if (data.disabled) return message.reply({ content: client.config.defaults.disabled });
                else return data.messageExecute(message, client);
            }
        }
    }
};