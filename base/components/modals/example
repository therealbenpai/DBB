const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    name: 'NAME',
    data: new ModalBuilder()
        .setCustomId('NAME')
        .setTitle('TITLE')        
        .addComponents(
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('INPUT')
                        .setPlaceholder('Placeholder')
                        .setStyle(TextInputStyle.Short)
                        .setLabel('Label')
                )
        ),
    async execute(interaction, client) {
        // Do stuff here
    }
}
