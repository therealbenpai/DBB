import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Modal, ComponentInfo } from '../../lib/component';

module.exports = new Modal(
    'NAME',
    new ComponentInfo(
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
