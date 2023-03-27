const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');

module.exports = {
    name: 'NAME',
    data: new ContextMenuCommandBuilder()
        .setName('NAME')
        .setType(ApplicationCommandType.User),
    async execute(interaction, client) {
        const { targetUser: user, targetMember: member} = interaction
        // run some code here
    }
}