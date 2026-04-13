import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';

import { Command } from '../lib/command';
import type { Bot } from '../lib/bot';
import { Embed } from '../lib/util';

const listAnd = (arr: string[]) => {
    if (arr.length === 0) {
        return 'None';
    }

    const formatter = new Intl.ListFormat('en-US', { type: 'conjunction' });
    return formatter.format(arr);
};

const processCmd = (
    client: Bot,
    command: Command | undefined = undefined,
    prefix: string = ''
) => {
    const embed = client.embed()
        .setTitle(`Help${command ? ` for ${command.name}` : ''}`)
        .setDescription(
            command
                ? command.info.description
                : `Use \`${prefix || '/'}help [command]\` to get help with a specific command.`,
        )
        .addFields(command
            ? specificCommand(command)
            : allCommands(client, prefix));
    if (command && command.restrictions.perms) {
        embed.addFields(
            Embed.Field(
                'Required Permissions',
                listAnd(
                    command.restrictions.perms
                        .map((perm) => Object
                            .entries(PermissionFlagsBits)
                            .find(([_, value]) => value === perm)![0]
                        )
                )
            )
        );
    }
    return embed;
};

const specificCommand = (command: Command) => [
    Embed.Field('Type', command.info.type),
    Embed.Field('Aliases', listAnd(command.triggers.map((trigger) => `\`${trigger}\``))),
    Embed.Field('Usage', `\`${command.info.usage}\``),
    Embed.Field('Examples', listAnd(command.info.examples.map((example) => `\`${example}\``))),
    Embed.Field('Status', command.info.disabled ? 'Disabled' : 'Enabled'),
    Embed.Field('DMs', command.restrictions.dms ? 'Allowed' : 'Not Allowed'),
    Embed.Field(
        'Channel Types',
        listAnd(
            Array.from(command.restrictions.channels)
                .map((limit) => Object.entries(ChannelType).find(([_, value]) => value === limit)![0]),
        ) || 'None',
    ),
    Embed.Field('Allowed Roles', listAnd(command.restrictions.roles.map((role) => `<&@${role}>`))),
    Embed.Field('Allowed Users', listAnd(command.restrictions.users.map((user) => `<@${user}>`))),
];

const allCommands = (client: Bot, prefix: string) => Array.from(client.Commands.values())
    .reduce((data, value) => {
        if (!data.find(([key, _]) => key === value.info.type)) {
            data.push([value.info.type, []]);
        }
        data[data.findIndex(([key, _]) => key === value.info.type)]![1].push(`${prefix || '/'}${value.name}`);
        return data;
    }, [] as [string, string[]][])
    .map(([key, value]) => Embed.Field(key, listAnd(value.map((cmd) => `\`${cmd}\``))));

const checkCommand = (textCommand: string | null, commandObject: Command | undefined) => {
    if (textCommand && !commandObject) {
        return 'That command does not exist.';
    }
    if (textCommand && commandObject && commandObject.info.disabled) {
        return 'That command is disabled.';
    }
};

export default new Command(
    'help',
    ['help', 'h'],
    new Command.Info({
        type: 'Information',
        description: 'Get help with the bot.',
        usage: 'help [command]',
        examples: ['help', 'help about'],
    }),
    new Command.Restrictions({ dms: true }),
    { slash: true, text: true },
    new SlashCommandBuilder()
        .setName('help')
        .addStringOption(
            (option) => option
                .setName('command')
                .setDescription('The command to get help with')
                .setAutocomplete(true)
        ) as SlashCommandBuilder,
)
    .setCommand(async (client, interaction) => {
        const command = client.Commands.get(interaction.options.getString('command')!);
        const check = checkCommand(interaction.options.getString('command'), command);
        if (check) {
            return interaction.reply(check);
        }
        interaction.reply({ embeds: [processCmd(client, command, '')] });
    })
    .setMessage(async (client, message) => {
        const cmdBase = message.content.split(' ').at(1);
        const command = client.Commands.get(cmdBase!);
        const check = checkCommand(cmdBase!, command);
        if (check) {
            return message.reply(check);
        }
        message.reply({ embeds: [processCmd(client, command, client.prefix)] });
    })
    .setAutocomplete(async (client, interaction) => {
        const choices = Array.from(client.Commands.values())
            .filter((cmd) => !cmd.info.disabled && cmd.info.type === 'slash' &&
                cmd.name.toLowerCase().includes(interaction.options.getFocused()))
            .map(({ name }) => ({ name, value: name }));
        interaction.respond(choices);
    });
