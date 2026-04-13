import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { Button, ComponentInfo } from '../../lib/component';

module.exports = new Button(
    'customID',
    new ComponentInfo(
        'customID',
        'Button Description',
        'Primary',
    ),
    new ButtonBuilder()
        .setCustomId('customID')
        .setLabel('Button Label')
        .setStyle(ButtonStyle.Primary),
)
    .setExecute(async (_client, _interaction) => { /* Do Stuff Here */ });
