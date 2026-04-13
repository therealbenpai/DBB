import * as djs from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import * as fs from 'fs';
import _ from 'lodash';
import * as os from 'os';
import process from 'process';

import { Trigger } from './trigger';
import { Command } from './command';
import { Button, ContextMenu, Modal, SelectMenu } from './component';
import { Event } from './event';
import { Message, RuntimeStatistics } from './util';
import Logger from './logger';

interface BotInitalizationOptions {
	/** The directory that contains the command objects */
	commandsDir: string,
	/** The directory that contains the event objects */
	eventsDir: string,
	/** The directory that contains the trigger objects */
	triggersDir: string,
	/** The directory that contains the button objects */
	buttonsDir: string,
	/** The directory that contains the select menu objects */
	selectMenusDir: string,
	/** The directory that contains the context menu objects */
	contextMenusDir: string,
	/** The directory that contains the modal component objects */
	modalComponentsDir: string,
	/** The directory that contains the predefined message objects */
	predefinedMessagesDir: string,
	/** Intents to not be included when initializing the bot */
	removedIntents: djs.GatewayIntentBits[],
	/** Partials not to receive with the bot */
	removedPartials: djs.Partials[],
}

type RTS = InstanceType<typeof RuntimeStatistics>;

type MainRuntimeStats = 'textCommands' | 'slashCommands'
	| 'roleTriggers' | 'userTriggers'
	| 'channelTriggers' | 'messageTriggers'
	| 'modals' | 'buttons'
	| 'selectMenus' | 'contextMenus'
	| 'predefinedMessages';

type InitRuntimeStats = {
	[x in MainRuntimeStats]: InstanceType<typeof RuntimeStatistics>;
} & { events: Partial<Record<keyof djs.ClientEvents, InstanceType<typeof RuntimeStatistics>>> };

export class Bot extends djs.Client {
	/** The Token of the Bot */
	private readonly botToken: string;
	/** The Prefix of the Bot */
	public readonly prefix: string;
	/** The ID of the Bot */
	public readonly botId: string;
	public readonly buttonsDir: string | undefined;
	public readonly commandsDir: string | undefined;
	public readonly contextMenusDir: string | undefined;
	public readonly eventsDir: string | undefined;
	public readonly modalComponentsDir: string | undefined;
	public readonly predefinedMessagesDir: string | undefined;
	public readonly selectMenusDir: string | undefined;
	public readonly triggersDir: string | undefined;
	/** Interactions */
	public readonly interactions: (djs.SlashCommandBuilder | djs.ContextMenuCommandBuilder)[] = []
	public readonly runtimeStats: InitRuntimeStats;
	public readonly baseDir: string;
	public readonly configs: {
		prefix: string;
		defaults: {
			disabled: string;
			noPerms: string;
			dmDisabled: string;
			invalidChannelType: string;
		};
	};
	public readonly Commands: djs.Collection<string, Command> = new djs.Collection();
	public readonly Events: djs.Collection<string, Event> = new djs.Collection();
	public readonly Modals: djs.Collection<string, Modal> = new djs.Collection();
	public readonly Buttons: djs.Collection<string, Button> = new djs.Collection();
	public readonly SelectMenus: djs.Collection<string, SelectMenu> = new djs.Collection();
	public readonly ContextMenus: djs.Collection<string, ContextMenu> = new djs.Collection();
	public readonly Messages: djs.Collection<string, InstanceType<typeof Message>> = new djs.Collection();
	public readonly Triggers: djs.Collection<string, Trigger> = new djs.Collection();
	public readonly PredefinedMessages: djs.Collection<string, InstanceType<typeof Message>> = new djs.Collection();
	public readonly Statuses: djs.Collection<number, djs.ActivityOptions> = new djs.Collection();
	public readonly branding: djs.EmbedData;
	public readonly RESTClient: REST;
	public readonly logger: Logger = new Logger();
	constructor(
		id: string,
		token: string,
		prefix: string,
		options?: Partial<BotInitalizationOptions>
	) {
		super({
			intents: Object.values(djs.GatewayIntentBits) // All Intents
				.filter(value => {
					if (typeof value === 'string') return false;
					if (options?.removedIntents) return !options.removedIntents.includes(value);
					return true;
				}) as djs.GatewayIntentBits[],
			partials: Object.values(djs.Partials) // All Partials
				.filter(value => {
					if (typeof value === 'string') return false;
					if (options?.removedPartials) return !options.removedPartials.includes(value);
					return true;
				}) as djs.Partials[],
			presence: {
				activities: [],
				status: djs.PresenceUpdateStatus.Online,
			},
		});
		this.botId = id;
		this.prefix = prefix;
		this.botToken = token;
		this.commandsDir = options?.commandsDir;
		this.eventsDir = options?.eventsDir;
		this.triggersDir = options?.triggersDir;
		this.buttonsDir = options?.buttonsDir;
		this.selectMenusDir = options?.selectMenusDir;
		this.contextMenusDir = options?.contextMenusDir;
		this.modalComponentsDir = options?.modalComponentsDir;
		this.predefinedMessagesDir = options?.predefinedMessagesDir;
		Object.assign(this, options);
		this.runtimeStats = {
			textCommands: new RuntimeStatistics(),
			slashCommands: new RuntimeStatistics(),
			roleTriggers: new RuntimeStatistics(),
			userTriggers: new RuntimeStatistics(),
			channelTriggers: new RuntimeStatistics(),
			messageTriggers: new RuntimeStatistics(),
			events: {},
			modals: new RuntimeStatistics(),
			buttons: new RuntimeStatistics(),
			selectMenus: new RuntimeStatistics(),
			contextMenus: new RuntimeStatistics(),
			predefinedMessages: new RuntimeStatistics(),
		};
		this.baseDir = process.cwd();
		this.configs = {
			prefix: this.prefix,
			defaults: {
				disabled: 'This command is currently disabled',
				noPerms: 'You do not have permission to use this command.',
				dmDisabled: 'This command is disabled in DMs.',
				invalidChannelType: 'This command cannot be used in this channel type.',
			},
		};
		this.branding = {
			footer: { text: '' },
			color: 0x2F3136,
		}
		this.interactions = [];
		this.RESTClient = new REST({ version: '10' }).setToken(this.botToken);
		this
			.on('push.events', <K extends keyof djs.ClientEvents = keyof djs.ClientEvents>(event: Event<K>) => {
				this.runtimeStats.events[event.name] = new RuntimeStatistics();
				// @ts-expect-error -- This is fine, it just doesn't know that we set the name as the key in runtimeStats.events
				this.Events.set(event.name, event);
				this.on(event.name, async (...args) => {
					this.runtimeStats.events[event.name]?.execute();
					event.execute(this, ...args)
				});
			})
			.on('push.commands', (command: Command) => {
				this.Commands.set(command.name, command);
				if (command.type.text) this.runtimeStats.textCommands.register();
				if (command.type.slash) {
					this.runtimeStats.slashCommands.register();
					// @ts-expect-error
					this.interactions.push(command.data.toJSON());
				}
			})
			.on('push.triggers', (trigger: Trigger) => {
				this.Triggers.set(trigger.name, trigger);
				Object.entries(trigger.triggerConfig)
					.forEach(value => value[1].activated
						? (
							this.runtimeStats[`${value[0]}Triggers` as keyof typeof this.runtimeStats] as RuntimeStatistics
						)?.register()
						: null
					);
			})
			.on('push.buttons', (button: Button) => {
				this.Buttons.set(button.name, button);
				this.runtimeStats.buttons.register();
			})
			.on('push.contextMenus', (contextMenu: ContextMenu) => {
				this.ContextMenus.set(contextMenu.name, contextMenu);
				this.runtimeStats.contextMenus.register();
				// @ts-expect-error
				this.interactions.push(contextMenu.data.toJSON());
			})
			.on('push.selectMenus', (selectMenu: SelectMenu) => {
				this.SelectMenus.set(selectMenu.name, selectMenu);
				this.runtimeStats.selectMenus.register();
			})
			.on('push.modals', (modal: Modal) => {
				this.Modals.set(modal.name, modal);
				this.runtimeStats.modals.register();
			})
			.on('push.predefinedMessages', (message: InstanceType<typeof Message>) => {
				if (!(message instanceof Message)) return;
				const gv = message.getValue;
				this.PredefinedMessages.set(
					message.name,
					Object.assign(
						message, {
						getValue: (c: Bot) => {
							this.runtimeStats.predefinedMessages.execute();
							return gv(c);
						}
					}
					)
				);
				this.runtimeStats.predefinedMessages.register();
			});

		const readyEvent = new Event('ready')
			.setExecute(async (client) => {
				// eslint-disable-next-line no-console
				console.log('Bot is ready');
				const status = client.Statuses.random()
				if (!status) return;
				setInterval(() => client.user!.setPresence({ activities: [status] }), 15e3)
			});

		this.emit('push.events', readyEvent);
	}

	initModules = async () => {
		const moduleDirs = [] as [string, (arg0: any) => void][];

		if (this.eventsDir) {
			moduleDirs.push([this.eventsDir, (event) => { this.emit('push.events', event) }])
		};

		if (this.commandsDir) {
			moduleDirs.push([this.commandsDir, (command) => { this.emit('push.commands', command) }])
		};

		if (this.triggersDir) {
			moduleDirs.push([this.triggersDir, (trigger) => { this.emit('push.triggers', trigger) }])
		};

		if (this.buttonsDir) {
			moduleDirs.push([this.buttonsDir, (button) => { this.emit('push.buttons', button) }])
		};

		if (this.contextMenusDir) {
			moduleDirs.push([this.contextMenusDir, (contextMenu) => { this.emit('push.contextMenus', contextMenu) }])
		};

		if (this.selectMenusDir) {
			moduleDirs.push([this.selectMenusDir, (selectMenu) => { this.emit('push.selectMenus', selectMenu) }])
		};

		if (this.modalComponentsDir) {
			moduleDirs.push([this.modalComponentsDir, (modal) => { this.emit('push.modals', modal) }])
		};

		if (this.predefinedMessagesDir) {
			moduleDirs.push([this.predefinedMessagesDir, (message) => { this.emit('push.predefinedMessages', message) }])
		};

		for (const s of moduleDirs) {
			fs.readdirSync(s![0])
				.filter(file => ['.ts', '.js'].some(ext => file.endsWith(ext)) && !file.startsWith('example'))
				.forEach(async (file: any) => {
					const { default: module } = await import(`${s![0] as string}/${file}`);
					(s![1] as (arg0: any) => void)(module);
				})
		}

		return this;
	};

	embed = () => new djs.EmbedBuilder(this.branding).setTimestamp()

	stats = () => {
		const getFixed = (n: number) => n.toFixed(2);
		const getStats = (main: number) => {
			const unit = Math.log2(main);
			const formatter = new Intl.NumberFormat('en-US', {
				maximumFractionDigits: 2,
				style: 'unit',
				unit: ['bytes', 'kilobytes', 'megabytes', 'gigabytes', 'terabytes'][Math.floor(unit / 10)],
			});
			return {
				percentage: getFixed(main / os.totalmem() * 1e2),
				fmt: formatter.format(main / (Math.floor(unit / 10) * 10)),
			}
		};
		return {
			ping: this.ws.ping,
			guilds: this.guilds.cache.size.toString(),
			ram: {
				botOnly: getStats(process.memoryUsage().heapTotal),
				global: getStats(os.totalmem() - os.freemem()),
			},
		};
	};

	generateEvent = (name: string) => {
		Object.assign(this.runtimeStats.events, { [`${name}`]: new RuntimeStatistics() })
		return this;
	};

	setBranding = (branding: djs.EmbedData) => {
		Object.assign(this.branding, branding);
		return this;
	};

	addStatus = (id: number, status: djs.ActivityOptions) => {
		this.Statuses.set(id, status);
		return this;
	};

	removeStatus = (id: number) => {
		this.Statuses.delete(id);
		return this;
	};

	start() {
		void this.RESTClient.put(Routes.applicationCommands(this.botId), { body: this.interactions });
		void this.login(this.botToken);
	};
}

export default Bot;