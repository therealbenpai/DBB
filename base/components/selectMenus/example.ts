import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { SelectMenu, ComponentInfo } from '../../lib/component';

module.exports = new SelectMenu(
    'NAME',
    new ComponentInfo(
        'NAME',
        'DESCRIPTION',
        'String',
    ),
    new StringSelectMenuBuilder()
        .setCustomId('NAME')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder('Placeholder')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Label')
                .setValue('Value')
                .setDescription('Description'),
        ),
)
    .setExecute(async (_interaction, _client) => { /* Do Stuff Here */ });
