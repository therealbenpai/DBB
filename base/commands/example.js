const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Discord: { Initializers: { Command } } } = require('../modules/util.js');
module.exports =
    new Command(
        'NAME',
        [],
        new Command.Info({
            type: 'Development',
            description: '',
            usage: '',
            examples: [''],
            disabled: false,
        }),
        new Command.Restrictions({
            perm: PermissionFlagsBits.Administrator,
            channels: [],
            roles: [],
            users: [],
            dms: true,
        }),
        { slash: true, text: true },
        new SlashCommandBuilder()
            .setName('NAME')
            .setDescription('DESCRIPTION'),
    )
        .setCommand(async (_interaction, _client) => { /* Do Stuff Here */ })
        .setMessage(async (_message, _client) => { /* Do Stuff Here */ })
        .setAutocomplete(async (_interaction, _client) => { /* Do Stuff Here */ });
