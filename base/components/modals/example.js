const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { Discord: { Initializers: { Components } } } = require('../../modules/util.js');

module.exports = new Components.Modal(
    'NAME',
    new Components.Info(
        'NAME',
        'DESCRIPTION',
        'Base Modal',
    ),
    new ModalBuilder()
        .setCustomId('NAME')
        .setTitle('TITLE')
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('INPUT')
                        .setPlaceholder('Placeholder')
                        .setStyle(TextInputStyle.Short)
                        .setLabel('Label'),
                ),
        ),
)
    .setExecute(async (_interaction, _client) => { /* Do Stuff Here */ });
