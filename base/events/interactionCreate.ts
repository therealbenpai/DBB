import { Events } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { Event } from '../lib/event';

export default new Event(Events.InteractionCreate)
    .setExecute(async (client, interaction) => {
        if (interaction.isAutocomplete()) {
            return client.Commands.get(interaction.commandName)?.autocomplete(client, interaction);
        }
        if (interaction.isCommand()) {
            const command = client.Commands.get(interaction.commandName);
            if (!command) {
                return;
            }
            client.runtimeStats.slashCommands.execute();
            if (command.info.disabled) {
                return interaction.reply({ content: client.configs.defaults.disabled });
            }
            const permissionCheck = command.restrictions.verifyCommandPermissions(client, interaction);
            if (!permissionCheck.success) {
                return interaction.reply({ content: permissionCheck.message, ephemeral: true });
            }
            return command.commandExecute(client, interaction as ChatInputCommandInteraction);
        }
        // TODO!
        // if (interaction.isContextMenu()) {
        //     const command = client.ContextMenus.get(interaction.commandName);
        //     if (!command) {
        //         return;
        //     }
        //     client.bumpRTS('components.contextMenus');
        //     return command.commandExecute(interaction, client);
        // }
        if (
            interaction.isButton() ||
            interaction.isModalSubmit() ||
            interaction.isSelectMenu()
        ) {
            let interactionType: 'buttons' | 'modals' | 'selectMenus';
            let interactionName;
            if (interaction.isButton()) {
                interactionType = 'buttons';
                interactionName = 'Buttons';
            } else if (interaction.isModalSubmit()) {
                interactionType = 'modals';
                interactionName = 'Modals';
            } else {
                interactionType = 'selectMenus';
                interactionName = 'SelectMenus';
            }
            client.runtimeStats[`${interactionType}`].execute();
            // @ts-expect-error
            return client[interactionName]!
                .get(interaction.customId)
                .execute(client, interaction);
        }
    });
