import type { ClientEvents } from 'discord.js';

import type { Bot } from './bot';

type EventHandler<K extends keyof ClientEvents> = (client: Bot, ...args: ClientEvents[K]) => void;

class Event<K extends keyof ClientEvents = keyof ClientEvents> {
	/** The function that is called when the event is emitted */
	public execute: EventHandler<K> = () => {};

	constructor(public readonly name: K) { }

	setExecute = (handler: EventHandler<K>) => {
		Object.assign(this, { execute: handler });
		return this;
	};
};

export default Event;
export { Event };
