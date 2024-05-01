const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { Discord: { Initializers: { Components } } } = require('../../modules/util.js');

module.exports = new Components.SelectMenu(
    'NAME',
    new Components.Info(
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
