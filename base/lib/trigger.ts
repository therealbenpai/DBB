import * as djs from 'discord.js';
import type { Bot } from './bot';

type ClientInteraction<T extends djs.BaseInteraction | djs.Message> = (client: Bot, interaction: T) => void;

class TriggerBase {
	/** Whether or not the trigger is activated */
	activated: boolean;
	/** Whether or not the trigger requires that the message be prefixed to be activated */
	prefix: boolean;
	constructor(activated: boolean, prefix: boolean) {
		this.activated = activated;
		this.prefix = prefix;
	}
}

/**
 * A class that represents the exection conditions dealing with messages for a trigger
 */
class TriggerMessage extends TriggerBase {
	/** The prefixes that the message can start with */
	prefixes: string[];
	/** The substrings that the message can contain */
	contains: string[];
	/** The suffixes that the message can end with */
	suffixes: string[];
	/** The regular expressions that the message can match */
	regex: RegExp[];
	constructor(activated: boolean, prefix: boolean, config: { prefixes: string[] | null; contains: string[] | null; suffixes: string[] | null; regex: RegExp[] | null; } | undefined) {
		super(activated, prefix);
		this.prefixes = config!.prefixes ?? [];
		this.contains = config!.contains ?? [];
		this.suffixes = config!.suffixes ?? [];
		this.regex = config!.regex ?? [];
	}
};

/**
 * A class that represents the execution conditions dealing with channels for a trigger
 */
class TriggerChannel extends TriggerBase {
	/** The IDs of the channels that the trigger can be activated in */
	id: string[];
	/** The types of channels that the trigger can be activated in */
	types: djs.ChannelType[];
	constructor(activated: boolean, prefix: boolean, config: { id: string[] | null; types: djs.ChannelType[] | null; } | undefined) {
		super(activated, prefix);
		this.id = config!.id ?? [];
		this.types = config!.types ?? [];
	}
};

/**
 * A class that represents the execution conditions dealing with roles for a trigger
 */
class TriggerRole extends TriggerBase {
	/** The IDs of the roles that can activate the trigger */
	id: string[];
	constructor(activated: boolean, prefix: boolean, config: { id: string[] | null; } | undefined) {
		super(activated, prefix);
		this.id = config!.id ?? [];
	}
};

/**
 * A class that represents the execution conditions dealing with users for a trigger
 */
class TriggerUser extends TriggerBase {
	/** The IDs of the users that can activate the trigger */
	id: string[];
	constructor(activated: boolean, prefix: boolean, config: { id: string[] | null; } | undefined) {
		super(activated, prefix);
		this.id = config!.id ?? [];
	}
};

class Trigger {
	/** The name of the trigger */
	name: string;
	/** Whether or not the trigger is disabled */
	globalDisable: boolean;
	/** The configuration for the trigger */
	triggerConfig: {
		message: TriggerMessage;
		channel: TriggerChannel;
		role: TriggerRole;
		user: TriggerUser;
	};
	/** The function that is called when the trigger is activated */
	async execute(client: Bot, message: djs.Message): Promise<void> { }
	constructor(name: string, message: TriggerMessage, channel: TriggerChannel, role: TriggerRole, user: TriggerUser) {
		this.name = name;
		this.globalDisable = false;
		this.triggerConfig = {
			message,
			channel,
			role,
			user,
		};
	}
	/** Set whether or not the trigger is disabled */
	setGlobalDisable = (newValue: Boolean) => Object.assign(this, { globalDisable: newValue });
	/** Set the function that is called when the trigger is activated */
	setExecute = (handler: ClientInteraction<djs.Message>) => Object.assign(this, { execute: handler });
	/** The class that represents the execution conditions dealing with messages for a trigger */
	static Message = TriggerMessage;
	/** The class that represents the execution conditions dealing with channels for a trigger */
	static Channel = TriggerChannel;
	/** The class that represents the execution conditions dealing with roles for a trigger */
	static Role = TriggerRole;
	/** The class that represents the execution conditions dealing with users for a trigger */
	static User = TriggerUser;
}

export default Trigger;
export { Trigger, TriggerMessage, TriggerChannel, TriggerRole, TriggerUser };
