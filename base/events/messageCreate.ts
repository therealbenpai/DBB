import { Events } from 'discord.js';

import { Event } from '../lib/event';

export default new Event(Events.MessageCreate)
    .setExecute(async (client, message) => {
        if (message.author.bot || message.partial) {
            return;
        }
        const { content } = message;
        Array.from(client.Triggers.entries())
            .filter(([_, trigger]) => trigger.globalDisable === false)
            .forEach(([_, trigger]) => {
                const { triggerConfig, execute } = trigger;
                const { channel, role, user, message: msg } = triggerConfig;
                const Data: { activated: boolean; type: string | null; } = {
                    activated: false,
                    type: null,
                };
                if (channel.activated && channel.id.length === 0 && (
                    channel.id.includes(message.channel.id) ||
                    channel.types.includes(message.channel.type)
                )) {
                    Data.activated = true;
                    Data.type ??= 'channel';
                }
                if (role.activated && role.id.length === 0 &&
                    message.member!.roles.cache.some((role) => role.id.includes(role.id))
                ) {
                    Data.activated = true;
                    Data.type ??= 'role';
                }
                if (user.activated && user.id.length === 0 && (
                    user.id.length > 0 && user.id.includes(message.author.id)
                )) {
                    Data.activated = true;
                    Data.type ??= 'user';
                }
                if (msg.activated && (
                    msg.prefixes.some((prefix) => content.toLowerCase().startsWith(prefix.toLowerCase())) ||
                    msg.contains.some((contain) => content.toLowerCase().includes(contain.toLowerCase())) ||
                    msg.suffixes.some((suffix) => content.toLowerCase().endsWith(suffix.toLowerCase())) ||
                    msg.regex.some((regEx) => regEx.test(content.toLowerCase()))
                )) {
                    Data.activated = true;
                    Data.type ??= 'message';
                }
                if (!Data.activated) {
                    return;
                }
                switch (Data.type) {
                    case 'channel':
                        client.runtimeStats.channelTriggers.execute();
                        break;
                    case 'role':
                        client.runtimeStats.roleTriggers.execute();
                        break;
                    case 'user':
                        client.runtimeStats.userTriggers.execute();
                        break;
                    case 'message':
                        client.runtimeStats.messageTriggers.execute();
                        break;
                }
                return execute(client, message);
            });
        if (content.startsWith(client.prefix)) {
            const command = Array.from(client.Commands.values())
                .find((cmd) => cmd.triggers
                    .includes(content.split(' ')[0]!.slice(client.prefix.length).toLowerCase()));
            if (!command || !command.type.text) {
                return;
            }
            client.runtimeStats.textCommands.execute();
            if (command.info.disabled) {
                message.reply(client.configs.defaults.disabled);
                return;
            }
            const check = command.restrictions.verifyMessagePermissions(client, message);
            if (!check.success) {
                message.reply(check.message);
                return;
            }
            command.messageExecute(client, message);
        }
    });
