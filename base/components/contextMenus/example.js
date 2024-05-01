const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
const { Discord: { Initializers: { Components } } } = require('../../modules/util.js');

module.exports = new Components.ContextMenu(
    'NAME',
    new Components.Info(
        'NAME',
        'DESCRIPTION',
        'User',
    ),
    new ContextMenuCommandBuilder()
        .setName('NAME')
        .setType(ApplicationCommandType.User),
)
    .setExecute(async (_interaction, _client) => { /* Do Stuff Here */ });
