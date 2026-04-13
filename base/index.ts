import { ActivityType } from 'discord.js';
import _ from 'lodash';

import { Bot } from './lib/bot';

const client = new Bot(
    process.env.CLIENT_ID!,
    process.env.TOKEN!,
    process.env.PREFIX ?? '',
    {
        buttonsDir: process.env.BUTTONS_DIR,
        commandsDir: process.env.COMMANDS_DIR,
        contextMenusDir: process.env.CONTEXT_MENUS_DIR,
        eventsDir: process.env.EVENTS_DIR,
        modalComponentsDir: process.env.MODAL_COMPONENTS_DIR,
        predefinedMessagesDir: process.env.PREDEFINED_MESSAGES_DIR,
        selectMenusDir: process.env.SELECT_MENUS_DIR,
        triggersDir: process.env.TRIGGERS_DIR,
    },
);

const statuses = [{ type: ActivityType.Watching, name: 'The Server' }];

for (const [id, status] of statuses.entries()) {
    client.addStatus(id, status);
}

await client.initModules();

client.start();

export default client;
