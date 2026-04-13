import * as djs from 'discord.js';
import type { Bot } from './bot';

/**
 * A class that works with times
 */
export class Timer {
	static STMDict2 = new Map()
		.set('y', ['year', 31_104e6])
		.set('M', ['month', 2_592e6])
		.set('d', ['day', 864e5])
		.set('h', ['hour', 36e5])
		.set('m', ['minute', 6e4])
		.set('s', ['second', 1e3]) as Map<string, [string, number]>;
	static stm = (v: string, k: string) => Number(v.slice(0, -1)) * (this.STMDict2.get(k)!.at(1) as number);
	static ts = {
		locale: 'en-US',
		options: {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			weekday: 'long',
			timeZone: 'America/Detroit',
			timeZoneName: 'longGeneric',
		} satisfies Intl.DateTimeFormatOptions,
	};
	/** Converts a Date or number to a timestamp */
	static timestamp = (value: Date | number) => new Intl.DateTimeFormat(this.ts.locale, this.ts.options).format(value);
	/** Converts a string to milliseconds */
	static stringToMilliseconds = (timeString: string) => timeString
		.split(' ')
		.map((value: string) => this.stm(value, value.slice(-1)))
		.reduce((a, b) => a + b, 0);
	/** Converts a string to seconds */
	static stringToSeconds = (timeString: string) => this.stringToMilliseconds(timeString) / 1e3;
	/** Converts a string to seconds */
	static unixTime = (date: Date) => Math.round(Date.parse(date.toISOString()) / 1e3);
}

/**
 * A class that contains methods for creating embeds
 */
export class Embed {
	/** Quickly create a field for an embed */
	static Field = (name: string, value: string, inline = false) => ({ name, value, inline });
	/** Quickly create an author for an embed */
	static Author = (name: string, url: string | undefined | null = null, iconURL: string | undefined | null = null) => ({ name, url, iconURL });
	/** Quickly create a footer for an embed */
	static Footer = (text: string, url: string | undefined | null = null) => ({ text, url });
};

export class Message {
	/** The name of the message */
	name: string;
	/** The display name of the message */
	displayName: string;
	/** The function that is called when the message is called */
	//@ts-expect-error
	async getValue(client: Bot): Promise<Partial<djs.APIMessage>> { }
	constructor(name: string, displayName: string) {
		this.name = name;
		this.displayName = displayName;
	}
	content = (handler: (client: Bot) => Partial<djs.APIMessage>) => Object.assign(this, { getValue: handler });
};

export class RuntimeStatistics {
	/** The number of times `X` has been registered */
	protected registered: number;
	/** The number of times `X` has been executed */
	protected executed: number;
	constructor() {
		this.registered = 0;
		this.executed = 0;
	}
	/** Increment the number of times `X` has been registered */
	register = () => ++this.registered;
	/** Increment the number of times `X` has been executed */
	execute = () => ++this.executed;
	/** Return the statistics */
	stats = () => ({ registered: this.registered, executed: this.executed });
	/** Reset the statistics */
	reset = () => {
		this.registered = 0;
		this.executed = 0;
	};
};
