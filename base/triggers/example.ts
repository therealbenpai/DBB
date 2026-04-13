import { Trigger, TriggerMessage, TriggerChannel, TriggerRole, TriggerUser } from '../lib/trigger';

module.exports =
    new Trigger(
        'example',
        new TriggerMessage(false, true, { prefixes: [], contains: [], suffixes: [], regex: [] }),
        new TriggerChannel(false, true, { id: [], types: [] }),
        new TriggerRole(false, true, { id: [] }),
        new TriggerUser(false, true, { id: [] }),
    )
        .setExecute(async (client, message) => { /* Do Stuff Here */ })
        .setGlobalDisable(true);