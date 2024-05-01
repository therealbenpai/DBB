/* eslint-disable @typescript-eslint/no-unused-vars */
const { Discord: { Utils: { EmbedUtils }, Initializers: { Message: Msg } } } = require('../modules/util.js');
const { EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = new Msg(
    'NAME',
    'READABLE NAME',
)
    .content((client) => { /* Do Stuff Here*/ });
