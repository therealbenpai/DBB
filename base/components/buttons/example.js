const { ButtonBuilder, ButtonStyle } = require('discord.js');
const { Discord: { Initializers: { Components } } } = require('../../modules/util.js');

module.exports = new Components.Button(
    'customID',
    new Components.Info(
        'customID',
        'Button Description',
        'Primary',
    ),
    new ButtonBuilder()
        .setCustomId('customID')
        .setLabel('Button Label')
        .setStyle(ButtonStyle.Primary),
)
    .setExecute(async (_interaction, _client) => { /* Do Stuff Here */ });
