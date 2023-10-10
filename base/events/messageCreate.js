const { Events } = require('discord.js');
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
        client.bumpEvent(Events.MessageCreate);
        if (message.author.bot || message.partial) return;

        Array.from(client.Triggers.entries())
            .filter(([key, trigger]) => trigger.globalDisable === false)
            .forEach(([key, trigger]) => {
                if (trigger.triggerCfgs.channel.activated) {
                    if (trigger.triggerCfgs.channel.ids.length > 0 && trigger.triggerCfgs.channel.ids.includes(message.channel.id)) {
                        if (!trigger.triggerCfgs.channel.requirePrefix || (trigger.triggerCfgs.channel.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.channelExecuted++;
                            return trigger.execute(message, client)
                        }
                    }
                    if (trigger.triggerCfgs.channel.types.length > 0 && trigger.triggerCfgs.channel.types.includes(message.channel.type)) {
                        if (!trigger.triggerCfgs.channel.requirePrefix || (trigger.triggerCfgs.channel.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.channelExecuted++;
                            return trigger.execute(message, client)
                        }
                    }
                }
                if (trigger.triggerCfgs.role.activated) {
                    if (trigger.triggerCfgs.role.ids.length > 0 && message.member.roles.cache.some(role => trigger.triggerCfgs.role.ids.includes(role.id))) {
                        if (!trigger.triggerCfgs.role.requirePrefix || (trigger.triggerCfgs.role.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.roleExecuted++;
                            return trigger.execute(message, client)
                        }
                    }
                }
                if (trigger.triggerCfgs.user.activated) {
                    if (trigger.triggerCfgs.user.ids.length > 0 && trigger.triggerCfgs.user.ids.includes(message.author.id)) {
                        if (!trigger.triggerCfgs.user.requirePrefix || (trigger.triggerCfgs.user.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.userExecuted++;
                            return trigger.execute(message, client)
                        }
                    }
                }
                if (trigger.triggerCfgs.message.activated) {
                    if (trigger.triggerCfgs.message.prefixes.length > 0 && trigger.triggerCfgs.message.prefixes.some(prefix => message.content.toLowerCase().startsWith(prefix.toLowerCase()))) {
                        if (!trigger.triggerCfgs.message.requirePrefix || (trigger.triggerCfgs.message.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.messageExecuted++;
                            return trigger.execute(message, client)
                        }
                    }
                    if (trigger.triggerCfgs.message.contains.length > 0 && trigger.triggerCfgs.message.contains.some(contains => message.content.toLowerCase().includes(contains.toLowerCase()))) {
                        if (!trigger.triggerCfgs.message.requirePrefix || (trigger.triggerCfgs.message.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.messageExecuted++;
                            return trigger.execute(message, client)
                        }
                    }
                    if (trigger.triggerCfgs.message.suffixes.length > 0 && trigger.triggerCfgs.message.suffixes.some(suffix => message.content.toLowerCase().endsWith(suffix.toLowerCase()))) {
                        if (!trigger.triggerCfgs.message.requirePrefix || (trigger.triggerCfgs.message.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.messageExecuted++;
                            return trigger.execute(message, client)
                        }
                    }
                    if (trigger.triggerCfgs.message.regex.length > 0 && trigger.triggerCfgs.message.regex.some(regex => regex.test(message.content.toLowerCase()))) {
                        if (!trigger.triggerCfgs.message.requirePrefix || (trigger.triggerCfgs.message.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.messageExecuted++;
                            return trigger.execute(message, client)
                        }
                    }
                }
            })

        if (message.content.startsWith(client.configs.prefix)) {
            const commandBase = message.content.split(' ')[0].slice(client.configs.prefix.length).toLowerCase();
            for (let data of fs
                .readdirSync(`${client.baseDir}/commands`)
                .filter(file => file.endsWith('.js'))
                .map(file => require(`${client.baseDir}/commands/${file}`))
                .filter(command => command.triggers.includes(commandBase) && command.type.text === true)
            ) {
                client.runtimeStats.commands.textExecuted++;
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