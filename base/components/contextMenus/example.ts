import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { ContextMenu, ComponentInfo } from '../../lib/component';

module.exports = new ContextMenu(
    'NAME',
    new ComponentInfo(
        'NAME',
        'DESCRIPTION',
        'User',
    ),
    new ContextMenuCommandBuilder()
        .setName('NAME')
        .setType(ApplicationCommandType.User),
)
    .setExecute(async (_client, _interaction) => { /* Do Stuff Here */ });
