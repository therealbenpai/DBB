const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const {
    Text,
    Discord: { Utils: { Markdown, EmbedUtils, Mentions }, Initializers: { Command } },
    List,
} = require('../modules/util.js');
// @eslint-ignore-next-line no-unused-vars
const handle = (client, command) => {
    const embed = client.embed()
        .setTitle(`Help${command ? ` for ${command.name}` : ''}`)
        .setDescription(command ? command.description : 'Use `/help [command]` to get help with a specific command.')
        .addFields(command
            ? [
                EmbedUtils.qField('Type', command.type),
                EmbedUtils.qField('Aliases', List.and(command.triggers.map(Markdown.inlineCode))),
                EmbedUtils.qField('Usage', Markdown.inlineCode(command.usage)),
                EmbedUtils.qField('Examples', command.examples.map(Markdown.inlineCode).join('\n')),
                EmbedUtils.qField('Status', Text.enabledDisabled(!command.disabled)),
                EmbedUtils.qField('DMs', Text.enabledDisabled(!command.blockDM)),
                EmbedUtils.qField(
                    'Required Permissions',
                    command.requiredPerm
                        ? Object.entries(PermissionFlagsBits).find(([_, value]) => value === command.requiredPerm)[0]
                        : 'None',
                ),
                EmbedUtils.qField(
                    'Channel Types',
                    List.and(
                        command.channelLimits
                            .map((x) => Object.entries(ChannelType).find(([_, value]) => value === x)[0]),
                    ) || 'None',
                ),
                EmbedUtils.qField('Allowed Roles', List.and(command.allowedRoles.map(Mentions.role)) || 'None'),
                EmbedUtils.qField('Allowed Users', List.and(command.allowedUsers.map(Mentions.user)) || 'None'),
            ]
            : Array.from(client.Commands.values())
                .reduce((d, value) => {
                    if (!d.find(([key, _]) => key === value.info.type)) {
                        d.push([value.info.type, []]);
                    }
                    d[d.findIndex(([key, _]) => key === value.info.type)][1].push(`/${value.info.name}`);
                    return d;
                }, [])
                .map(([key, value]) => EmbedUtils.qField(key, List.and(value.map(Markdown.inlineCode)))));
    if (command.permissions) {
        embed.addFields(EmbedUtils.qField('Required Permissions', List.and(command.permissions)));
    }
};

const checkCommand = (cmd, command) => cmd && !command
    ? 'That command does not exist.'
    : command && command.disabled
        ? 'That command is disabled.'
        : null;

module.exports =
    new Command(
        'help',
        ['help', 'h'],
        new Command.Info({
            type: 'Information',
            description: 'Get help with the bot.',
            usage: 'help [command]',
            examples: ['help', 'help emit'],
            disabled: false,
        }),
        new Command.Restrictions({ dms: true }),
        { slash: true, text: true },
        new SlashCommandBuilder()
            .setName('help')
            .setDescription('Get help with the bot.')
            .addStringOption((option) => option
                .setName('command')
                .setDescription('The command to get help with')
                .setAutocomplete(true)),
    )
        .setCommand(async (interaction, client) => {
            const command = client.Commands.get(interaction.options.getString('command'));
            const check = checkCommand(interaction.options.getString('command'), command);
            if (check) {
                return interaction.reply(check);
            }
            interaction.reply({ embeds: [handle(client, Object.assign({}, command, command.info, command.type) || null)] });
        })
        .setMessage(async (message, client) => {
            const command = client.Commands.get(message.content.split(' ').at(1));
            const check = checkCommand(message.content.split(' ').at(1), command);
            if (check) {
                return message.reply(check);
            }
            message.reply({ embeds: [handle(client, Object.assign({}, command, command.info, command.type) || null)] });
        })
        .setAutocomplete(async (interaction, client) => {
            const choices = Array.from(client.Commands.values())
                .filter((cmd) => Array.of(
                    !cmd.disabled,
                    cmd.type.slash,
                    cmd.info.name.toLowerCase().includes(interaction.options.getFocused()),
                ).every(Boolean))
                .map((cmd) => ({ name: cmd.info.name, value: cmd.info.name }));
            interaction.respond(choices);
        });
