const {
    Events,
    ContextMenuCommandInteraction,
    ButtonInteraction,
    StringSelectMenuInteraction,
    ModalSubmitInteraction,
    ChatInputCommandInteraction,
} = require('discord.js');
const { Discord: { Initializers: { Event } } } = require('../modules/util.js');

module.exports = new Event(Events.InteractionCreate)
    .setExecute(async (client, interaction) => {
        if (interaction.isAutocomplete()) {
            return client.Commands.get(interaction.commandName).autocomplete(interaction, client);
        }
        if (interaction instanceof ChatInputCommandInteraction) {
            const command = client.Commands.get(interaction.commandName);
            if (!command) {
                return;
            }
            client.bumpRTS('commands.slash');
            const failureReason = [null, [], false, undefined].every((value) => command.blockDM !== value) &&
                interaction.channel.isDMBased()
                ? 1
                : [null, [], false, undefined].every((value) => command.channelLimits !== value) &&
                    command.channelLimits.every((value) => value !== interaction.channel.type)
                    ? 2
                    : Array.of(
                        Array.of(
                            [null, [], false, undefined].every((value) => command.requiredPerm !== value),
                            interaction.guild,
                            !interaction.member.permissions.has(command.requiredPerm),
                        ),
                        Array.of(
                            [null, [], false, undefined].every((value) => command.allowedRoles !== value),
                            !interaction.member.roles.cache.some((role) => command.allowedRoles.includes(role.id)),
                        ),
                        Array.of(
                            [null, [], false, undefined].every((value) => command.allowedUsers !== value),
                            !command.allowedUsers.includes(interaction.user.id),
                        ),
                    ).map((value) => value.every((x) => Boolean(x)))
                        .some((value) => Boolean(value))
                        ? 3
                        : command.disabled
                            ? 4
                            : 0;
            return failureReason
                ? interaction.reply({
                    content: ['dmDisabled', 'invalidChannelType', 'noPerms', 'disabled']
                        .map((e) => client.configs.defaults[e])[failureReason - 1],
                })
                : command.commandExecute(interaction, client);
        }
        const interactionType = [
            [ButtonInteraction, 'buttons'],
            [ModalSubmitInteraction, 'modals'],
            [StringSelectMenuInteraction, 'selectMenus'],
            [ContextMenuCommandInteraction, 'contextMenus'],
            // Maps the component type to a key
        ].find(([inter]) => interaction instanceof inter);
        if (!interactionType) {
            return await interaction.reply({ content: 'This interaction is not supported yet.', ephemeral: true });
        }
        const InterType = interactionType[1];
        client.bumpRTS(`components.${InterType}`);
        return client.Components.get(InterType)
            // Gets the proper Identifier for the interaction
            .get(interaction[InterType === 'contextMenus' ? 'commandName' : 'customId'])
            .execute(interaction, client);
        // Do stuff here
    });
