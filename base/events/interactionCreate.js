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
                .map(file => require(`../commands/${file}`))
                .filter(file => file.type.slash === true && file.name === interaction.commandName)
                .forEach(file => {
                    if (file.blockDM && interaction.channel.isDMBased()) return interaction.reply({ content: client.configs.defaults.dmDisabled });
                    else if (file.channelLimits && !file.channelLimits.includes(interaction.channel.type)) return interaction.reply({ content: client.configs.defaults.invalidChannelType });
                    else if (file.requiredPerm && interaction.guild && !interaction.member.permissions.has(file.requiredPerm)) return interaction.reply({ content: client.configs.defaults.noPerms });
                    else if (file.allowedRoles && !interaction.member.roles.cache.some(role => file.allowedRoles.includes(role.id))) return interaction.reply({ content: client.configs.defaults.noPerms });
                    else if (file.allowedUsers && !file.allowedUsers.includes(interaction.user.id)) return interaction.reply({ content: client.configs.defaults.noPerms });
                    else if (file.disabled) return interaction.reply({ content: client.config.defaults.disabled });
                    else return file.commandExecute(interaction, client);
                })
        } else if (interaction.isContextMenuCommand()) {
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
                    const selectMenuData = require(`../components/modals/${file}`);
                    if (selectMenuData.name === interaction.customId) {
                        selectMenuData.execute(interaction, client);
                        return;
                    }
                })
        } else {
            await interaction.reply({ content: 'This interaction is not supported yet.', ephemeral: true });
        }
        // Do stuff here
    },
};