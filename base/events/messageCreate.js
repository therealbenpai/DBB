const { Events } = require('discord.js');
const { Discord: { Initializers: { Event } } } = require('../modules/util.js');

module.exports = new Event(Events.MessageCreate)
    .setExecute(async (client, message) => {
        if (message.author.bot || message.partial) {
            return;
        }
        const { content } = message;
        Array.from(client.Triggers.entries())
            .filter(([_, t]) => t.globalDisable === false)
            .forEach(([_, trigger]) => {
                const { triggerConfig, execute } = trigger;
                const { channel, role, user, message: msg } = triggerConfig;
                const checkPrefix = (sector) => !triggerConfig[sector].requirePrefix ||
                    triggerConfig[sector].requirePrefix &&
                    content.startsWith(client.configs.prefix);
                const executed =
                    Array.of(
                        channel.activated && (
                            channel.ids.length > 0 &&
                            channel.ids.includes(message.channel.id) ||
                            channel.types.length > 0 &&
                            channel.types.includes(message.channel.type)
                        ),
                        role.activated &&
                        role.ids.length > 0 &&
                        message.member.roles.cache.some((role) => role.ids.includes(role.id)),
                        user.activated &&
                        user.ids.length > 0 &&
                        user.ids.includes(message.author.id),
                        msg.activated && Array.of(
                            msg.prefixes.length > 0 &&
                            msg.prefixes.some((prefix) => content.toLowerCase().startsWith(prefix.toLowerCase())),
                            msg.contains.length > 0 &&
                            msg.contains.some((contain) => content.toLowerCase().includes(contain.toLowerCase())),
                            msg.suffixes.length > 0 &&
                            msg.suffixes.some((suffix) => content.toLowerCase().endsWith(suffix.toLowerCase())),
                            msg.regex.length > 0 && msg.regex.some((regEx) => regEx.test(content.toLowerCase())),
                        ).some((b) => b),
                    )
                        .map((value, index) => value && checkPrefix(['channel', 'role', 'user', 'message'][index]))
                        .findIndex((value) => value === true);
                if (executed === -1) return;
                client.bumpRTS(`triggers.${['channel', 'role', 'user', 'message'][executed]}`);
                return execute(message, client);
            });
        if (content.startsWith(client.configs.prefix)) {
            const check = (v) => [null, [], false, undefined].includes(v)
            const command = Array.from(client.Commands.values())
                .find((cmd) => cmd.triggers
                    .includes(content.split(' ')[0].slice(client.configs.prefix.length).toLowerCase()));
            if (!command || !command.type.text) return;
            client.bumpRTS('commands.text');
            const fail = Array.of(
                check(command.blockDMs) && message.channel.isDMBased(),
                check(command.channelLimits) && command.channelLimits.includes(message.channel.type),
                Array.of(
                    Array.of(check(command.requiredPerm), message.guild, !message.member.permissions.has(command.requiredPerm)),
                    Array.of(check(command.allowedRoles), !message.member.roles.cache.some((role) => command.allowedRoles.includes(role.id))),
                    Array.of(check(command.allowedUsers), !command.allowedUsers.includes(message.author.id)),
                ).map(a => a.every(Boolean)).includes(true),
                command.disabled
            ).findIndex(true);
            return fail
                ? message.reply(['dmDisabled', 'invalidChannelType', 'noPerms', 'disabled'].map((e) => client.configs.defaults[e])[fail])
                : command.messageExecute(message, client);
        }
    });
