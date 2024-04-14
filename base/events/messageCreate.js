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
            .filter(([_, t]) => t.globalDisable === false)
            .forEach(([_, t]) => {
                if (
                    t.triggerCfgs.channel.activated
                    && (!t.triggerCfgs.channel.requirePrefix
                        || (t.triggerCfgs.channel.requirePrefix
                            && message.content.startsWith(client.configs.prefix)))
                    && (
                        (t.triggerCfgs.channel.ids.length > 0 && t.triggerCfgs.channel.ids.includes(message.channel.id))
                        || (t.triggerCfgs.channel.types.length > 0 && t.triggerCfgs.channel.types.includes(message.channel.type))
                    )
                ) {
                    client.runtimeStats.triggers.channelExecuted++;
                    return t.execute(message, client)
                }
                if (
                    t.triggerCfgs.role.activated
                    && t.triggerCfgs.role.ids.length > 0
                    && message.member.roles.cache.some(role => t.triggerCfgs.role.ids.includes(role.id))
                    && (!t.triggerCfgs.role.requirePrefix
                        || (t.triggerCfgs.role.requirePrefix
                            && message.content.startsWith(client.configs.prefix)))

                ) {
                    client.runtimeStats.triggers.roleExecuted++;
                    return t.execute(message, client)
                }
                if (
                    t.triggerCfgs.user.activated
                    && t.triggerCfgs.user.ids.length > 0
                    && t.triggerCfgs.user.ids.includes(message.author.id)
                    && (!t.triggerCfgs.user.requirePrefix
                        || (t.triggerCfgs.user.requirePrefix
                            && message.content.startsWith(client.configs.prefix)))
                ) {
                    client.runtimeStats.triggers.userExecuted++;
                    return t.execute(message, client)
                }
                if (
                    t.triggerCfgs.message.activated
                    && (!t.triggerCfgs.message.requirePrefix
                        || (t.triggerCfgs.message.requirePrefix
                            && message.content.startsWith(client.configs.prefix)))
                    && (
                        (
                            t.triggerCfgs.message.prefixes.length > 0
                            && t.triggerCfgs.message.prefixes.some(prefix => message.content.toLowerCase().startsWith(prefix.toLowerCase()))
                        )
                        || (
                            t.triggerCfgs.message.contains.length > 0
                            && t.triggerCfgs.message.contains.some(contains => message.content.toLowerCase().includes(contains.toLowerCase()))
                        )
                        || (
                            t.triggerCfgs.message.suffixes.length > 0
                            && t.triggerCfgs.message.suffixes.some(suffix => message.content.toLowerCase().endsWith(suffix.toLowerCase()))
                        )
                        || (
                            t.triggerCfgs.message.regex.length > 0
                            && t.triggerCfgs.message.regex.some(regex => regex.test(message.content.toLowerCase()))
                        )
                    )
                ) {
                    client.runtimeStats.triggers.messageExecuted++;
                    return t.execute(message, client)
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