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
        if (interaction.isAutocomplete()) return client.Commands.get(interaction.commandName).autocomplete(interaction, client);
        if (interaction instanceof ChatInputCommandInteraction) {
            const command = client.Commands.get(interaction.commandName);
            if (!command) return;
            client.bumpRTS('commands.slash');
            const check = (v) => [null, [], false, undefined].includes(v)
            const fail = Array.of(
                check(command.blockDM) && interaction.channel.isDMBased(),
                check(command.channelLimits) && command.channelLimits.every((value) => value !== interaction.channel.type),
                Array.of(
                    check(command.requiredPerm) && interaction.guild && !interaction.member.permissions.has(command.requiredPerm),
                    check(command.allowedRoles) && !interaction.member.roles.cache.some((role) => command.allowedRoles.includes(role.id)),
                    check(command.allowedUsers) && !command.allowedUsers.includes(interaction.user.id),
                ).map((value) => value.every(Boolean)).includes(true),
                command.disabled,
            ).indexOf(true);
            return fail !== -1
                ? interaction.reply({ content: ['dmDisabled', 'invalidChannelType', 'noPerms', 'disabled'].map((e) => client.configs.defaults[e])[fail] })
                : command.commandExecute(interaction, client);
        }
        const interactionType = [
            [ButtonInteraction, 'buttons'],
            [ModalSubmitInteraction, 'modals'],
            [StringSelectMenuInteraction, 'selectMenus'],
            [ContextMenuCommandInteraction, 'contextMenus'],
        ].find(([inter]) => interaction instanceof inter);
        if (!interactionType) return await interaction.reply({ content: 'This interaction is not supported yet.', ephemeral: true });
        const InterType = interactionType[1];
        client.bumpRTS(`components.${InterType}`);
        return client.Components.get(InterType)
            .get(interaction[InterType === 'contextMenus' ? 'commandName' : 'customId'])
            .execute(interaction, client);
    });
