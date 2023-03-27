const { Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    /**
     * 
     * @param {import('discord.js').BaseInteraction} interaction 
     * @param {*} client 
     */
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            fs
                .readdirSync(`${process.cwd()}/commands`)
                .filter(file => file.endsWith('.js'))
                .forEach(file => {
                    const commandData = require(`../commands/${file}`);
                    if (commandData.name === interaction.commandName) {
                        commandData.execute(interaction, client);
                        return;
                    }
                })
        } else if (interaction.isContextMenu()) {
            fs
                .readdirSync(`${process.cwd()}/components/contextMenus`)
                .filter(file => file.endsWith('.js'))
                .forEach(file => {
                    const contextMenuData = require(`../components/contextMenus/${file}`);
                    if (contextMenuData.name === interaction.commandName) {
                        contextMenuData.execute(interaction, client);
                        return;
                    }
                })
        } else if (interaction.isButton()) {
            fs
                .readdirSync(`${process.cwd()}/components/buttons`)
                .filter(file => file.endsWith('.js'))
                .forEach(file => {
                    const buttonData = require(`../components/buttons/${file}`);
                    if (buttonData.name === interaction.customId) {
                        buttonData.execute(interaction, client);
                        return;
                    }
                })
        } else if (interaction.isAnySelectMenu()) {
            fs
                .readdirSync(`${process.cwd()}/components/selectMenus`)
                .filter(file => file.endsWith('.js'))
                .forEach(file => {
                    const selectMenuData = require(`../components/selectMenus/${file}`);
                    if (selectMenuData.name === interaction.customId) {
                        selectMenuData.execute(interaction, client);
                        return;
                    }
                })
        } else if (interaction.isMessageComponent()) {
            fs
                .readdirSync(`${process.cwd()}/components/messageComponents`)
                .filter(file => file.endsWith('.js'))
                .forEach(file => {
                    const messageComponentData = require(`../components/messageComponents/${file}`);
                    if (messageComponentData.name === interaction.customId) {
                        messageComponentData.execute(interaction, client);
                        return;
                    }
                })
        } else if (interaction.isModalSubmit()) {
            fs
                .readdirSync(`${process.cwd()}/components/modals`)
                .filter(file => file.endsWith('.js'))
                .forEach(file => {
                    const modalData = require(`../components/modals/${file}`);
                    if (modalData.name === interaction.customId) {
                        modalData.execute(interaction, client);
                        return;
                    }
                })
        } else {
            await interaction.reply({ content: 'This interaction is not supported yet.', ephemeral: true });
        }
        // Do stuff here
    },
};