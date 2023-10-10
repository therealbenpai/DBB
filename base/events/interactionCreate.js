const {
    Events,
    ContextMenuCommandInteraction,
    ButtonInteraction,
    StringSelectMenuInteraction,
    ModalSubmitInteraction,
    ChatInputCommandInteraction
} = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    /**
     * 
     * @param {import('discord.js').BaseInteraction} interaction 
     * @param {import('discord.js').Client} client 
     */
    async execute(interaction, client) {
        client.bumpEvent(Events.InteractionCreate);
        if (interaction.isAutocomplete()) return client.Commands.get(interaction.commandName).autocomplete(interaction, client);
        if (interaction instanceof ChatInputCommandInteraction) {
            const command = client.Commands.get(interaction.commandName);
            if (!command || !command.type.slash) return;
            client.runtimeStats.commands.slashExecuted++;
            (command.blockDM && interaction.channel.isDMBased()) ?
                interaction.reply({ content: client.configs.defaults.dmDisabled }) :
                (command.channelLimits && !command.channelLimits.includes(interaction.channel.type)) ?
                    interaction.reply({ content: client.configs.defaults.invalidChannelType }) :
                    (command.requiredPerm && interaction.guild && !interaction.member.permissions.has(command.requiredPerm)) ?
                        interaction.reply({ content: client.configs.defaults.noPerms }) :
                        (command.allowedRoles && !interaction.member.roles.cache.some(role => command.allowedRoles.includes(role.id))) ?
                            interaction.reply({ content: client.configs.defaults.noPerms }) :
                            (command.allowedUsers && !command.allowedUsers.includes(interaction.user.id)) ?
                                interaction.reply({ content: client.configs.defaults.noPerms }) :
                                (command.disabled) ?
                                    interaction.reply({ content: client.config.defaults.disabled }) :
                                    command.commandExecute(interaction, client);
        }
        else if (interaction instanceof ContextMenuCommandInteraction) {
            client.runtimeStats.components.contextMenus.executed++;
            return client.Components.get('contextMenus').get(interaction.commandName).execute(interaction, client)
        }
        else if (interaction instanceof ButtonInteraction) {
            client.runtimeStats.components.buttons.executed++;
            return client.Components.get('buttons').get(interaction.customId).execute(interaction, client)
        }
        else if (interaction instanceof StringSelectMenuInteraction) {
            client.runtimeStats.components.selectMenus.executed++;
            return client.Components.get('selectMenus').get(interaction.customId).execute(interaction, client)
        }
        else if (interaction instanceof ModalSubmitInteraction) {
            client.runtimeStats.components.modals.executed++;
            return client.Components.get('selectMenus').get(interaction.customId).execute(interaction, client)
        }
        else return await interaction.reply({ content: 'This interaction is not supported yet.', ephemeral: true })
        // Do stuff here
    },
};