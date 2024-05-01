const { Events } = require('discord.js');
const { Discord: { Initializers: { Event } } } = require('../modules/util.js');

module.exports = new Event(Events.MessageUpdate)
    .setExecute(async (client, oldMsg, newMsg) => {
        if (Array.of(
            newMsg.content === oldMsg.content,
            newMsg.author.bot,
            newMsg.channel.type === 'DM',
            newMsg.partial,
        ).some((value) => value)) {
            return;
        }
        if (newMsg.content.startsWith(client.configs.prefix)) {
            const cmd = Array.from(client.Commands.values())
                .find(
                    (command) => command.triggers
                        .includes(newMsg.content.split(' ')[0].slice(client.configs.prefix.length).toLowerCase()),
                );
            if (!cmd || !cmd.type.text) {
                return;
            }
            client.bumpRTS('commands.text');
            const failureReason = Array.of(
                cmd.blockDM && newMsg.channel.isDMBased(),
                cmd.channelLimits && !cmd.channelLimits.includes(newMsg.channel.type),
                Array.of(
                    cmd.requiredPerm && newMsg.guild && !newMsg.member.permissions.has(cmd.requiredPerm),
                    cmd.allowedRoles && !newMsg.member.roles.cache.some((role) => cmd.allowedRoles.includes(role.id)),
                    cmd.allowedUsers && !cmd.allowedUsers.includes(newMsg.author.id),
                ).some(Boolean),
                cmd.disabled,
            ).findIndex(Boolean);
            return failureReason
                ? newMsg.reply(
                    ['dmDisabled', 'invalidChannelType', 'noPerms', 'disabled']
                        .map((e) => client.configs.defaults[e])[failureReason - 1],
                )
                : cmd.messageExecute(newMsg, client);
        }
    });
