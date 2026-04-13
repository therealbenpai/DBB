import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

import { Command } from '../lib/command';

export default new Command(
    'NAME',
    [],
    new Command.Info({
        type: 'Development',
        description: '',
    }),
    new Command.Restrictions({
        perms: [PermissionFlagsBits.Administrator],
    }),
    { slash: true, text: true },
    new SlashCommandBuilder()
        .setName('NAME')
        .setDescription('DESCRIPTION'),
)
    .setCommand(async (_interaction, _client) => { /* Do Stuff Here */ })
    .setMessage(async (_message, _client) => { /* Do Stuff Here */ })
    .setAutocomplete(async (_interaction, _client) => { /* Do Stuff Here */ });
