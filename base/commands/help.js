const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    triggers: ['help'],
    info: {
        type: 'Support',
        name: 'help',
        description: 'Get help with the bot.',
        usage: 'help [command]',
        examples: ['help', 'help info'],
        aliases: ['help'],
    },
    blockDM: false,
    type: {
        slash: true,
        text: true
    },
    disabled: false,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with the bot')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('The command to get help with')
                .setAutocomplete(true)
        ),
    async commandExecute(interaction, client) {
        const command = interaction.options.getString('command');
        const embed = client.embed()
        if (command) {
            const data = { ...client.Commands.get(command).info, ...client.Commands.get(command).type, disabled: client.Commands.get(command).disabled }
            if (data == null) return interaction.reply({ content: 'That command does not exist.', ephemeral: true });
            embed
                .setTitle(`Help for ${data.name}`)
                .setDescription(data.description)
                .addFields(
                    {
                        name: 'Type',
                        value: data.type,
                    },
                    {
                        name: 'Usage',
                        value: `\`/${data.usage}\``,
                    },
                    {
                        name: 'Examples',
                        value: data.examples
                            .map(example => `\`/${example}\``)
                            .join('\n'),
                    },
                    {
                        name: 'Disabled',
                        value: data.disabled ? 'Yes' : 'No',
                    },
                    {
                        name: 'Allowed In DMs',
                        value: data.blockDM ? 'No' : 'Yes',
                    }
                )
            if (data.permissions) embed.addFields({
                name: 'Required Permissions',
                value: data.permissions.join(', ')
            })
        } else {
            const fields = {}
            const formattedFields = []
            Array.from(client.Commands.values())
                .filter(cmd => !cmd.disabled)
                .forEach(cmd => { fields[cmd.info.type] += `, \`${cmd.info.name}\`` })
            for (let [key, value] of Object.entries(fields)) {
                formattedFields.push({
                    name: key,
                    value: value.split('').slice(10).join('')
                })
            }
            embed
                .setTitle('Help')
                .setDescription('Use `/help [command]` to get help with a specific command.')
                .addFields(formattedFields)
        }
        interaction.reply({ embeds: [embed] });
    },
    async messageExecute(message, client) {
        const command = message.content.split(' ')[1];
        const embed = client.embed()
        if (command) {
            const data = { ...client.Commands.get(command).info, ...client.Commands.get(command).type, disabled: client.Commands.get(command).disabled }
            if (data == null) return message.reply('That command does not exist.');
            embed
                .setTitle(`Help for ${data.name}`)
                .setDescription(data.description)
                .addFields(
                    {
                        name: 'Type',
                        value: data.type,
                    },
                    {
                        name: 'Usage',
                        value: `\`${client.configs.prefix + data.usage}\``,
                    },
                    {
                        name: 'Examples',
                        value: data.examples
                            .map(example => `\`${client.configs.prefix + example}\``)
                            .join('\n'),
                    },
                    {
                        name: 'Aliases',
                        value: data.aliases
                            .map(alias => `\`${client.configs.prefix + alias}\``)
                            .join('\n'),
                    },
                    {
                        name: 'Disabled',
                        value: data.disabled ? 'Yes' : 'No',
                    },
                    {
                        name: 'Allowed In DMs',
                        value: data.blockDM ? 'No' : 'Yes',
                    }
                )
            if (data.permissions) embed.addFields({
                name: 'Required Permissions',
                value: data.permissions.join(', ')
            })
        } else {
            const fields = {}
            const formattedFields = []
            Array.from(client.Commands.values())
                .filter(cmd => !cmd.disabled)
                .forEach(cmd => { fields[cmd.info.type] += `, \`${client.configs.prefix}${cmd.info.name}\`` })
            for (let [key, value] of Object.entries(fields)) {
                formattedFields.push({
                    name: key,
                    value: value.split('').slice(10).join('')
                })
            }

            embed
                .setTitle('Help')
                .setDescription(`Use \`${client.configs.prefix}help [command]\` to get help with a specific command.`)
                .addFields(formattedFields)
        }
        message.reply({ embeds: [embed] });
    },
    /**
     * @param {import('discord.js').AutocompleteInteraction} interaction
     * @param {import('discord.js').Client} client
     */
    async autocomplete(interaction, client) {
        const choices = Array.from(client.Commands.values())
            .filter(cmd => !cmd.disabled && cmd.type.slash && cmd.info.name.toLowerCase().includes(interaction.options.getFocused()))
            .map(cmd => ({ name: cmd.info.name, value: cmd.info.name }))
        interaction.respond(choices)
    }
};