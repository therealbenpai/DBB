import { Event } from '../lib/event';
import { Events } from 'discord.js';

export default new Event(Events.Debug)
    .setExecute(async (client, ...args) => { /* Do Stuff Here */ });
