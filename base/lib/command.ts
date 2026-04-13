import * as djs from 'discord.js';
import type { Bot } from './bot';

type ClientInteraction<T extends djs.BaseInteraction | djs.Message> = (client: Bot, interaction: T) => void;

interface CommandRestrictionsI {
	/** The permission that is required to execute the command */
	readonly perms: djs.PermissionFlags[keyof djs.PermissionFlags][];
	/** The types of channels the command can be executed in */
	readonly channels: djs.ChannelType[];
	/** The IDs of the roles that can execute the command */
	readonly roles: string[];
	/** The IDs of the users that can execute the command */
	readonly users: string[];
	/** Whether or not the command can be executed in DMs */
	readonly dms: boolean;
}

const checkPerms = (
	permissions: djs.PermissionFlags[keyof djs.PermissionFlags][],
	member: djs.GuildMember
) => permissions.some((perm) => member.permissions.has(perm));

/**
 * A class that represents the restrictions that can be placed on a command
 */
export class CommandRestrictions implements CommandRestrictionsI {
	public readonly perms: djs.PermissionFlags[keyof djs.PermissionFlags][] = [];
	public readonly channels: djs.ChannelType[] = [];
	public readonly roles: string[] = [];
	public readonly users: string[] = [];
	public readonly dms: boolean = false;
	constructor(data: Partial<CommandRestrictionsI> = {}) {
		if (data?.perms) {
			this.perms = data.perms;
		}

		if (data?.channels) {
			this.channels = data.channels;
		}

		if (data?.roles) {
			this.roles = data.roles;
		}

		if (data?.users) {
			this.users = data.users;
		}

		if (data?.dms !== undefined) {
			this.dms = data.dms;
		}
	}

	public verifyCommandPermissions(client: Bot, interaction: djs.CommandInteraction) {
		const responseData = {
			success: false,
			message: ''
		};
		if (!!interaction.member && !(interaction.member instanceof djs.GuildMember)) {
			responseData.message = 'ERR: Member Check Failed';
			return responseData;
		}
		if (!!this.dms && interaction.channel?.isDMBased()) {
			responseData.message = client.configs.defaults.dmDisabled;
			return responseData;
		}
		if (!!this.channels && this.channels.includes(interaction.channel?.type!)) {
			responseData.message = client.configs.defaults.invalidChannelType;
			return responseData;
		}
		if (
			(
				!!this.perms
				&& interaction.member
				&& !checkPerms(this.perms, interaction.member as djs.GuildMember)
			)
			|| (
				!!this.roles
				&& !interaction.member?.roles.cache.some(({ id }) => this.roles.includes(id))
			)
			|| (!!this.users && !this.users.includes(interaction.member!.id))
		) {
			responseData.message = client.configs.defaults.noPerms;
			return responseData;
		}
		if (!!this.roles && !interaction.member?.roles.cache.some(({ id }) => this.roles.includes(id))) {
			responseData.message = client.configs.defaults.noPerms;
			return responseData;
		}
		if (!!this.users && !this.users.includes(interaction.member!.id)) {
			responseData.message = client.configs.defaults.noPerms;
			return responseData;
		}
		responseData.success = true;
		return responseData;
	}

	public verifyMessagePermissions(client: Bot, message: djs.Message) {
		const responseData = {
			success: false,
			message: ''
		};
		if (this.dms && message.channel.isDMBased()) {
			responseData.message = client.configs.defaults.dmDisabled;
			return responseData;
		}
		if (this.channels.length > 0 && !this.channels.includes(message.channel.type)) {
			responseData.message = client.configs.defaults.invalidChannelType;
			return responseData;
		}
		if (
			(this.perms && message.guild && !checkPerms(this.perms, message.member as djs.GuildMember))
			|| (
				this.roles.length > 0
				&& !message.member!.roles.cache.some((role) => this.roles.includes(role.id))
			)
			|| (this.users.length > 0 && !this.users.includes(message.author.id))
		) {
			responseData.message = client.configs.defaults.noPerms;
			return responseData;
		}
		responseData.success = true;
		return responseData;
	}
};

export interface CommandInfoI {
	/** The type of command */
	type: string;
	/** The description of the command */
	description: string;
	/**
	 * The usage of the command, using the following format:
	 * ```markdown
	 * `[...]` is used to denote optional arguments
	 *
	 * `<...>` is used to denote required arguments
	 *
	 * `|` is used to denote a choice between arguments
	 *
	 * `...` is used to denote a rest argument
	 * ```
	*/
	usage?: string;
	/** Examples of how to use the command */
	examples?: string[];
	/** Whether or not the command is disabled */
	disabled?: boolean;
	/** Aliases for the command */
	aliases?: string[];
}

/**
 * Information about a command
 */
export class CommandInfo implements CommandInfoI {
	public type: string;
	public description: string;
	public usage: string = '';
	public examples: string[] = [];
	public disabled: boolean = false;
	public aliases: string[] = [];
	constructor(data: CommandInfoI) {
		this.type = data.type;
		this.description = data.description;

		if (data.usage) {
			this.usage = data.usage;
		}

		if (data.examples) {
			this.examples = data.examples;
		}

		if (data.disabled !== undefined) {
			this.disabled = data.disabled;
		}

		if (data.aliases) {
			this.aliases = data.aliases;
		}
	}
};

interface CommandI {
	/** The name of the command */
	name: string;
	/** The triggers that can activate the command */
	triggers: string[];
	/** The information about the command */
	info: CommandInfo;
	/** The restrictions on the command */
	restrictions: CommandRestrictions;
	/** The type of command */
	type: {
		text: boolean;
		slash: boolean;
	};
	/** The data for the command */
	data: djs.SlashCommandBuilder;
	/** The function that is called when the command is executed */
	commandExecute: ClientInteraction<djs.ChatInputCommandInteraction>;
	/** The function that is called when the command is executed */
	messageExecute: ClientInteraction<djs.Message>;
	/** The function that is called when the command's autocomplete action is called */
	autocomplete: ClientInteraction<djs.AutocompleteInteraction>;
}

export class Command implements CommandI {
	public commandExecute: ClientInteraction<djs.ChatInputCommandInteraction> = () => { };
	public messageExecute: ClientInteraction<djs.Message> = () => { };
	public autocomplete: ClientInteraction<djs.AutocompleteInteraction> = () => { };
	constructor(
		public readonly name: string,
		public readonly triggers: string[],
		public readonly info: CommandInfo,
		public readonly restrictions: CommandRestrictions,
		public readonly type: { text: boolean, slash: boolean },
		public readonly data: djs.SlashCommandBuilder,
	) { }
	/** Set the function that is called when the slash command is executed */
	setCommand = (handler: ClientInteraction<djs.ChatInputCommandInteraction>) => {
		Object.assign(this, { commandExecute: handler })
		return this;
	};
	/** Set the function that is called when the text command is executed */
	setMessage = (handler: ClientInteraction<djs.Message>) => {
		Object.assign(this, { messageExecute: handler });
		return this;
	};
	/** Set the function that is called when the autocomplete action is called */
	setAutocomplete = (handler: ClientInteraction<djs.AutocompleteInteraction>) => {
		Object.assign(this, { autocomplete: handler });
		return this;
	};
	/** The class that represents the restrictions that can be placed on a command */
	static Restrictions = CommandRestrictions;
	/** The class that contains information about a command */
	static Info = CommandInfo;
};
