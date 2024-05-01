/* eslint-disable @stylistic/max-len */
/**
 * @class
 * @classdesc
 */
class TriggerBase {
    /**
     * @type {boolean}
     * @description
     * Whether or not the trigger is activated
    */
    activated;
    /**
     * @type {boolean}
     * @description
     * Whether or not the trigger requires that the message be prefixed to be activated
    */
    prefix;

    /**
     * @param {boolean} activated
     * @param {string} prefix
     */
    constructor(activated, prefix) {
        this.activated = activated;
        this.prefix = prefix;
    }
}

/**
 * @class
 * @classdesc
 */
class BaseComponent {
    /**
     * @type {string}
     * @description
     * The Identifier and Name of the Component
    */
    name;
    /**
     * @type {SubContainer.ComponentInfo}
     * @description
     * The Description of the Component (What it Does, What It's Purpose Is, etc.)
    */
    info;
    /**
     * @type {djs.ButtonBuilder | djs.ContextMenuCommandBuilder | djs.SelectMenuBuilder | djs.ModalBuilder}
     * @description
     * The Type of Component that this is
    */
    data;
    /**
     * @type {(interaction: djs.BaseInteraction, client: Client) => void}
     * @description
     * The Function that is called when the Component is interacted with
    */
    execute;

    /**
     * @param {string} name
     * @param {ComponentInfo} info
     * @param {djs.ButtonBuilder | djs.ContextMenuCommandBuilder | djs.SelectMenuBuilder | djs.ModalBuilder} data
     */
    constructor(name, info, data) {
        this.name = name;
        this.info = info;
        this.data = data;
        this.execute = async (_interaction, _client) => { };
    }
    /**
     * @param {(interaction: djs.BaseInteraction, client: Client)} handler
     * @description
     * Sets the execute function for the component
     */
    setExecute = (handler) => Object.assign(this, { execute: handler });
}

/**
 * @class
 * @classdesc
 * SubContainer
 *
 * A collection of classes that are used to create and manage various components of a Discord bot
 */
class SubContainer {
    /**
     * @class
     * @classdesc
     * Trigger Message
     *
     * A class that represents the message segment of the trigger data
     */
    static TriggerMessage = class extends TriggerBase {
        /**
         * @type {Array<string>}
         * @description
         * The prefixes that the message can start with
        */
        prefixes;
        /**
         * @type {Array<string>}
         * @description
         * The substrings that the message can contain
        */
        contains;
        /**
         * @type {Array<string>}
         * @description
         * The suffixes that the message can end with
        */
        suffixes;
        /**
         * @type {Array<RegExp>}
         * @description
         * The regular expressions that the message can match
        */
        regex;

        /**
         * @param {boolean} activated
         * @param {string} prefix
         * @param {{prefixs: Array<string>, contains: Array<string>, suffixes: Array<string>, regex: Array<RegExp>}} config
         */
        constructor(activated, prefix, config) {
            super(activated, prefix);
            this.prefixes = config?.prefixes ?? [];
            this.contains = config?.contains ?? [];
            this.suffixes = config?.suffixes ?? [];
            this.regex = config?.regex ?? [];
        }
    };
    /**
     * @class
     * @classdesc
     * Trigger Channel
     *
     * A class that represents the channel segment of the trigger data
    */
    static TriggerChannel = class extends TriggerBase {
        /**
         * @type {Array<string>}
         * @description
         * The IDs of the channels that the trigger can be activated in
        */
        id;
        /**
         * @type {Array<djs.ChannelType>}
         * @description
         * The types of channels that the trigger can be activated in
        */
        types;

        /**
         * @param {boolean} activated
         * @param {string} prefix
         * @param {{id: Array<number>?, types: Array<string>?}} config
         */
        constructor(activated, prefix, config) {
            super(activated, prefix);
            this.id = config?.id ?? [];
            this.types = config?.types ?? [];
        }
    };
    /**
     * @class
     * @classdesc
     * Trigger Role
     *
     * A class that represents the role segment of the trigger data
    */
    static TriggerRole = class extends TriggerBase {
        /**
         * @type {Array<string>}
         * @description
         * The IDs of the roles that can activate the trigger
        */
        id;

        /**
         * @param {boolean} activated
         * @param {string} prefix
         * @param {{id: Array<string>?}} config
         */
        constructor(activated, prefix, config) {
            super(activated, prefix);
            this.id = config.id ?? [];
        }
    };
    /**
     * @class
     * @classdesc
     * Trigger User
     *
     * A class that represents the user segment of the trigger data
    */
    static TriggerUser = class extends TriggerBase {
        /**
         * @type {Array<string>}
         * @description
         * The IDs of the users that can activate the trigger
        */
        id;

        /**
         * @param {boolean} activated
         * @param {string} prefix
         * @param {{id: Array<string>?}} config
         */
        constructor(activated, prefix, config) {
            super(activated, prefix);
            this.id = config?.id ?? [];
        }
    };
    /**
     * @class
     * @classdesc
     * Command Restrictions
     *
     * A class that represents the restrictions that can be placed on a command
    */
    static CommandRestrictions = class {
        /**
         * @type {djs.PermissionFlags}
         * @description
         * The permission that is required to execute the command
        */
        perm;
        /**
         * @type {Array<djs.ChannelType>}
         * @description
         * The types of channels the command can be executed in
        */
        channels;
        /**
         * @type {Array<string>}
         * @description
         * The IDs of the roles that can execute the command
        */
        roles;
        /**
         * @type {Array<string>}
         * @description
         * The IDs of the users that can execute the command
        */
        users;
        /**
         * @type {boolean}
         * @description
         * Whether or not the command can be executed in DMs
        */
        dms;

        /**
         * @param {{
            * perm?: bigint,
            * channels?: Array<number>,
            * roles?: Array<string>,
            * users?: Array<string>,
            * dms?: boolean
         * }} data
         */
        constructor(data) {
            this.perm = data?.perm || undefined;
            this.channels = data?.channels || [];
            this.roles = data?.roles || [];
            this.users = data?.users || [];
            this.dms = data?.dms || false;
        }
    };
    /**
     * @class
     * @classdesc
     * Command Info
     *
     * A class that represents the information about a command
    */
    static CommandInfo = class {
        /**
         * @type {string}
         * @description
         * The type of command
        */
        type;
        /**
         * @type {string}
         * @description
         * The description of the command
        */
        description;
        /**
         * @type {string}
         * @description
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
        usage;
        /**
         * @type {Array<string>}
         * @description
         * Examples of how to use the command
        */
        examples;
        /**
         * @type {boolean}
         * @description
         * Whether or not the command is disabled
        */
        disabled;

        /**
         * @param {{type: string, description: string, usage: string, examples: Array<string>, disabled: boolean}} data
         */
        constructor(data) {
            this.type = data.type;
            this.description = data.description;
            this.usage = data.usage;
            this.examples = data.examples;
            this.disabled = data.disabled;
        }
    };
    /**
     * @class
     * @classdesc
     * Button Component
     *
     * A class that represents a button component
    */
    static ButtonComponent = class extends BaseComponent {
        /**
         * @param {string} name
         * @param {SubContainer.ComponentInfo} info
         * @param {djs.ButtonBuilder} data
         */
        constructor(name, info, data) {
            super(name, info, data);
        }
        /**
         * @override
         * @param {(interaction: djs.ButtonInteraction, client: Client) => void} handler
         * @description
         * Sets the execute function for the component
         */
        setExecute = (handler) => Object.assign(this, { execute: handler });
    };
    /**
     * @class
     * @classdesc
     * Context Menu Component
     *
     * A class that represents a context menu component
    */
    static ContextMenuComponent = class extends BaseComponent {
        /**
         * @param {string} name
         * @param {SubContainer.ComponentInfo} info
         * @param {djs.ContextMenuCommandBuilder} data
         */
        constructor(name, info, data) {
            super(name, info, data);
        }
        /**
         * @override
         * @param {(interaction: djs.ContextMenuInteraction, client: Client) => void} handler
         * @description
         * Sets the execute function for the component
         */
        setExecute = (handler) => Object.assign(this, { execute: handler });
    };
    /**
     * @class
     * @classdesc
     * Modal Component
     *
     * A class that represents a modal component
    */
    static ModalComponent = class extends BaseComponent {
        /**
         * @param {string} name
         * @param {SubContainer.ComponentInfo} info
         * @param {djs.ModalBuilder} data
         */
        constructor(name, info, data) {
            super(name, info, data);
        }
        /**
         * @override
         * @param {(interaction: djs.ModalSubmitInteraction, client: Client) => void} handler
         * @description
         * Sets the execute function for the component
         */
        setExecute = (handler) => Object.assign(this, { execute: handler });
    };
    /**
     * @class
     * @classdesc
     * Select Menu Component
     *
     * A class that represents a select menu component
    */
    static SelectMenuComponent = class extends BaseComponent {
        /**
         * @param {string} name
         * @param {SubContainer.ComponentInfo} info
         * @param {djs.SelectMenuBuilder} data
         */
        constructor(name, info, data) {
            super(name, info, data);
        }
        /**
         * @override
         * @param {(interaction: djs.SelectMenuInteraction, client: Client) => void} handler
         * @description
         * Sets the execute function for the component
         */
        setExecute = (handler) => Object.assign(this, { execute: handler });
    };
    /**
     * @class
     * @classdesc
     * Component Info
     *
     * A class that represents the information about a component
    */
    static ComponentInfo = class {
        /**
         * @type {string}
         * @description
         * The Identifier and Name of the Component
         */
        name;
        /**
         * @type {string}
         * @description
         * The Description of the Component (What it Does, What It's Purpose Is, etc.)
         */
        description;
        /**
         * @type {string|number}
         * @description
         * The Type of Component that this is
         */
        type;

        /**
         * @param {string} name
         * @param {string} description
         * @param {string|number} type
         */
        constructor(name, description, type) {
            this.name = name;
            this.description = description;
            this.type = type;
        }
    };
}

/**
 * @class
 * @classdesc
 * Timer
 *
 * Time-related utility functions
 * @example
 * Timer.timestamp(new Date()) // 'Wednesday, September 15, 2021, 12:00:00 AM EDT'
 * Timer.elapsedTime(60) // '1 minute'
 * Timer.stringToMilliseconds('1d 2h 3m 4s') // 93784000
 * Timer.unixTime(new Date()) // 1631698800
 */
class Timer {
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
        },
    };
    /**
     * Intl. Date Time Formatted Timestamp
     *
     * Converts a Date-like value to a formatted timestamp using the `Intl.DateTimeFormat` API
     * @param {Date|number?} value The timestamp to convert
     * @returns {string} The time represented in a International Date Format using the `en-US` locale
     *
     * @example
     * Timer.timestamp(new Date()) // 'Wednesday, September 15, 2021, 12:00:00 AM EDT'
     * Timer.timestamp(1631698800000) // 'Wednesday, September 15, 2021, 12:00:00 AM EDT'
     */
    static timestamp = (value) => new Intl.DateTimeFormat(this.ts.locale, this.ts.options).format(value);
    /**
     * Elapsed Time
     *
     * Converts a timestamp to a human-readable elapsed time
     * @param {number} t The timestamp to convert
     * @returns {string} The time represented in a human-readable format
     *
     * @example
     * Timer.elapsedTime(60) // '1 minute'
     * Timer.elapsedTime(3600) // '1 hour'
     * Timer.elapsedTime(86400) // '1 day'
     * Timer.elapsedTime(542) // '9 minutes and 2 seconds'
     * Timer.elapsedTime(65478) // '18 hours, 11 minutes, and 18 seconds'
     */
    static elapsedTime = (t) => {
        if (isNaN(t)) {
            throw new TypeError('Timestamp must be a number');
        }
        t = Math.floor(t);
        return List.and(
            Object.entries({
                year: t / 31104e3,
                month: t / 2592e3 % 12,
                day: t / 864e2 % 30,
                hour: t / 36e2 % 24,
                minute: t / 6e1 % 60,
                second: t % 6e1,
            })
                .map(([key, value]) => [key, Math.floor(value)])
                .filter(([_, value]) => value > 0)
                .map(([key, value]) => `${value} ${Text.pluralize(value, key)}`)
                .join(', '),
        );
    };
    /**
     * String to Milliseconds
     *
     * Converts a string to milliseconds using the inversion of the {@link Timer.elapsedTime `elapsedTime`} function
     * @param {string} timeString The string to convert
     * @returns {number} The time represented in milliseconds
     */
    static stringToMilliseconds = (timeString) => typeof timeString !== 'string'
        ? TypeError('Time String must be a string')
        : timeString
            .split(' ')
            .map((value) => {
                switch (value.slice(-1)) {
                    case 'w': return value.slice(0, -1) * 6048e5;
                    case 'd': return value.slice(0, -1) * 864e5;
                    case 'h': return value.slice(0, -1) * 36e5;
                    case 'm': return value.slice(0, -1) * 6e4;
                    case 's': return value.slice(0, -1) * 1e3;
                }
            })
            .reduce((a, b) => a + b, 0);
    /**
     * String to Seconds
     *
     * Converts a string to seconds
     * @param {string} timeString The string to convert
     * @returns {number} The time represented in seconds
     * @see {@link Timer.stringToMilliseconds stringToMilliseconds} - **Base conversion function**
     */
    static stringToSeconds = (timeString) => this.stringToMilliseconds(timeString) / 1e3;
    /**
     * Gets the Unix Time
     *
     * Converts a Date object to Unix Time
     * @param {Date} date
     * @returns {number} The time represented in Unix Time
     */
    static unixTime = (date) => !(date instanceof Date) && typeof date !== 'number'
        ? TypeError('Date must be a Date object')
        : Math.round(date.getTime() / 1e3);
}

/**
 * @class
 * @classdesc
 * List Formatter
 *
 * Formats a list of items into a human-readable format
 * @example
 * List.and(['apples', 'oranges', 'bananas']) // 'apples, oranges, and bananas'
 * List.or(['apples', 'oranges', 'bananas']) // 'apples, oranges, or bananas'
 */
class List {
    /**
     * And List
     *
     * Formats a list of items into a human-readable format using the `conjunction` style
     * @param {Array<string>} value The list of items to format
     * @returns {string} The formatted list
     */
    static and = (value) => new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(value);
    /**
     * Or List
     *
     * Formats a list of items into a human-readable format using the `disjunction` style
     * @param {Array<string>} value The list of items to format
     * @returns {string} The formatted list
     */
    static or = (value) => new Intl.ListFormat('en-US', { style: 'long', type: 'disjunction' }).format(value);
}

/**
 * @class
 * @classdesc
 * Text Utilities
 *
 * Text utility functions
 * @example
 * Text.yn(true) // 'Yes'
 * Text.tf(true) // 'True'
 * Text.onOff(true) // 'On'
 * Text.enabledDisabled(true) // 'Enabled'
 * Text.activeInactive(true) // 'Active'
 * Text.successFailure(true) // 'Success'
 * Text.passFail(true) // 'Pass'
 * Text.pluralize(1, 'apple') // 'apple'
 * Text.pluralize(2, 'apple') // 'apples'
 * Text.longText(', ', 'apple', 'orange', 'banana') // 'apple, orange, banana'
 */
class Text {
    /**
     * Quick Format
     *
     * Formats a value quickly
     * @param {boolean} value The boolean to convert
     * @param {string} yes The value to return if true
     * @param {string} no The value to return if false
     * @returns {string} The converted value
     */
    static quickProcess = (value, yes, no) => value ? yes : no;
    /**
     * Yes/No
     *
     * Converts a boolean to 'Yes' or 'No'
     * @param {boolean} value The boolean to convert
     * @returns {string} The converted value
    */
    static yn = (value) => this.quickProcess(value, 'Yes', 'No');
    /**
     * True/False
     *
     * Converts a boolean to 'True' or 'False'
     * @param {boolean} value The boolean to convert
     * @returns {string} The converted value
    */
    static tf = (value) => this.quickProcess(value, 'True', 'False');
    /**
     * On/Off
     *
     * Converts a boolean to 'On' or 'Off'
     * @param {boolean} value The boolean to convert
     * @returns {string} The converted value
    */
    static onOff = (value) => this.quickProcess(value, 'On', 'Off');
    /**
     * Enabled/Disabled
     *
     * Converts a boolean to 'Enabled' or 'Disabled'
     * @param {boolean} value The boolean to convert
     * @returns {string} The converted value
    */
    static enabledDisabled = (value) => this.quickProcess(value, 'Enabled', 'Disabled');
    /**
     * Active/Inactive
     *
     * Converts a boolean to 'Active' or 'Inactive'
     * @param {boolean} value The boolean to convert
     * @returns {string} The converted value
    */
    static activeInactive = (value) => this.quickProcess(value, 'Active', 'Inactive');
    /**
     * Success/Failure
     *
     * Converts a boolean to 'Success' or 'Failure'
     * @param {boolean} value The boolean to convert
     * @returns {string} The converted value
    */
    static successFailure = (value) => this.quickProcess(value, 'Success', 'Failure');
    /**
     * Pass/Fail
     *
     * Converts a boolean to 'Pass' or 'Fail'
     * @param {boolean} value The boolean to convert
     * @returns {string} The converted value
    */
    static passFail = (value) => this.quickProcess(value, 'Pass', 'Fail');
    /**
     * Pluralize
     *
     * Converts a value to a pluralized form
     * @param {number} value The value to convert
     * @param {string} text The value to pluralize
     * @returns {string} The pluralized value
    */
    static pluralize = (value, text) => `${text}${value > 0 ? 's' : ''}`;
    /**
     * Long Text
     *
     * Converts a list of values to a long text string
     * @param {string} joiner The string to join the values with
     * @param {Array<string>} value The values to join
     * @returns {string} The joined values
    */
    static longText = (joiner, ...value) => value.join(joiner);
}

/**
 * @class
 * @classdesc
*/
class Discord {
    /**
     * @class
     * @classdesc
    */
    static Utils = class {
        /**
         * @class
         * @classdesc
         * Discord Markdown
         *
         * Markdown utility functions for Discord
         * @example
         * DiscordMD.inlineCode('Hello, World!') // '`Hello, World!`'
         * DiscordMD.bold('Hello, World!') // '**Hello, World!**'
         * DiscordMD.italic('Hello, World!') // '*Hello, World!*'
         * DiscordMD.underline('Hello, World!') // '__Hello, World!__'
         * DiscordMD.strikethrough('Hello, World!') // '~~Hello, World!~~'
         * DiscordMD.spoiler('Hello, World!') // '||Hello, World!||'
         * DiscordMD.quote('Hello, World!') // '> Hello, World!'
         * DiscordMD.codeBlock('Hello, World!') // '```\nHello, World!\n```'
         * DiscordMD.blockQuote('Hello, World!') // '>>> Hello, World!'
         * DiscordMD.link('Google', 'https://google.com') // '[Google](https://google.com)'
         */
        static Markdown = class {
            /**
             * Quick Format
             *
             * Formats a string quickly
             * @param {string} around The markdown value to surround the string with
             * @param {string} value The string to format
             * @returns {string} The formatted string
            */
            static quickProcess = (around, value) => `${around}${value}${around}`;
            /**
             * Inline Code
             *
             * Formats a string as inline code
             * @param {string} value The string to format
             * @returns {string} The formatted string
             */
            static inlineCode = (value) => this.quickProcess('`', value);
            /**
             * Bold
             *
             * Formats a string as bold
             * @param {string} value The string to format
             * @returns {string} The formatted string
            */
            static bold = (value) => this.quickProcess('**', value);
            /**
             * Italic
             *
             * Formats a string as italic
             * @param {string} value The string to format
             * @returns {string} The formatted string
            */
            static italic = (value) => this.quickProcess('*', value);
            /**
             * Underline
             *
             * Formats a string as underline
             * @param {string} value The string to format
             * @returns {string} The formatted string
            */
            static underline = (value) => this.quickProcess('__', value);
            /**
             * Strikethrough
             *
             * Formats a string as strikethrough
             * @param {string} value The string to format
            */
            static strikethrough = (value) => this.quickProcess('~~', value);
            /**
             * Spoiler
             *
             * Formats a string as a spoiler
             * @param {string} value The string to format
             * @returns {string} The formatted string
            */
            static spoiler = (value) => this.quickProcess('||', value);
            /**
             * Quote
             *
             * Formats a string as a quote
             * @param {string} value The string to format
             * @returns {string} The formatted string
            */
            static quote = (value) => `> ${value}`;
            /**
             * Code Block with Language
             *
             * Formats a string as a code block with a specified language
             * @param {string} stringValue The string to format
             * @param {string} language The language to format the code block with
             * @returns {string} The formatted string
             * @see {@link https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md Supported Codeblock Languages}
            */
            static codeBlock = (stringValue, language) => `\`\`\`${language || ''}\n${stringValue}\n\`\`\``;
            /**
             * Block Quote
             *
             * Formats a string as a block quote
             * @param {string} value The string to format
             * @returns {string} The formatted string
            */
            static blockQuote = (value) => `>>> ${value}`;
            /**
             * Link
             *
             * Formats a string as a link
             * @param {string} text The text to display
             * @param {string} url The URL to link to
             * @returns {string} The formatted string
            */
            static link = (text, url) => `[${text}](${url})`;
        };
        /**
         * @class
         * @classdesc
         * Discord Mentions
         *
         * Mention utility functions for Discord
         * @example
         * DiscordMentions.role('1234567890') // '<@&1234567890>'
         * DiscordMentions.user('1234567890') // '<@1234567890>'
         * DiscordMentions.channel('1234567890') // '<#1234567890>'
         * DiscordMentions.emoji('emoji', '1234567890') // '<:emoji:1234567890>'
         * DiscordMentions.animatedEmoji('emoji', '1234567890') // '<a:emoji:1234567890>'
         * DiscordMentions.timestamp(1631698800) // '<t:1631698800:f>'
         * DiscordMentions.timestamp(1631698800, 'd') // '<t:1631698800:d>'
        */
        static Mentions = class {
            /**
             * Quick Format
             *
             * Formats a string quickly
             * @param {string} prefix The prefix to use
             * @param {string} value The value to format
             * @param {string} suffix The suffix to use
             * @returns {string} The formatted string
            */
            static quickProcess = (prefix, value, suffix = '') => `<${prefix}${value}${suffix}> `;
            /**
             * Role Mention
             *
             * Mentions a role
             * @param {string} id The ID of the role to mention
             * @returns {string} The formatted mention
            */
            static role = (id) => this.quickProcess('@&', id);
            /**
             * User Mention
             *
             * Mentions a user
             * @param {string} id The ID of the user to mention
             * @returns {string} The formatted mention
            */
            static user = (id) => this.quickProcess('@', id);
            /**
             * Channel Mention
             *
             * Mentions a channel
             * @param {string} id The ID of the channel to mention
             * @returns {string} The formatted mention
            */
            static channel = (id) => this.quickProcess('#', id);
            /**
             * Emoji Mention
             *
             * Mentions an emoji
             * @param {string} name The name of the emoji
             * @param {string} id The ID of the emoji to mention
             * @returns {string} The formatted mention
            */
            static emoji = (name, id) => this.quickProcess(':', name, `:${id} `);
            /**
             * Animated Emoji Mention
             *
             * Mentions an animated emoji
             * @param {string} name The name of the emoji
             * @param {string} id The ID of the emoji to mention
             * @returns {string} The formatted mention
            */
            static animatedEmoji = (name, id) => this.quickProcess('a:', name, `:${id} `);
            /**
             * Timestamp Mention
             *
             * Mentions a timestamp
             * @param {number} timestamp The timestamp to mention
             * @param {string} format The format of the timestamp
             * @returns {string} The formatted mention
             * @see {@link https://discord.com/developers/docs/reference#message-formatting Timestamp Format}
            */
            static timestamp = (timestamp, format = 'f') => this.quickProcess('t:', timestamp, `:${format} `);
        };
        /**
         * @class
         * @classdesc
         * Discord Embed Utilities
         *
         * Embed utility functions for Discord
         * @example
         * EmbedUtils.qField('Field Name', 'Field Value', true)
         *  { name: 'Field Name', value: 'Field Value', inline: true }
         * EmbedUtils.qAuthor('Author Name', 'https://example.com', 'https://example.com/icon.png')
         *  { name: 'Author Name', url: 'https://example.com', iconURL: 'https://example.com/icon.png' }
         * EmbedUtils.qFooter('Footer Text', 'https://example.com')
         *  { text: 'Footer Text', url: 'https://example.com' }
         * @see {@link https://discord.com/developers/docs/resources/channel#embed-object Embed Object}
        */
        static EmbedUtils = class {
            /**
             * Quick Field
             *
             * Creates a field quickly
             * @param {string} name The name of the field
             * @param {string} value The value of the field
             * @param {boolean?} inline Whether the field is inline
             * @returns {{name: string, value: string, inline: boolean?}} The field object
            */
            static qField = (name, value, inline = false) => ({ name, value, inline });
            /**
             * Quick Author
             *
             * Creates an author quickly
             * @param {string} name The name of the author
             * @param {string?} url The URL of the author
             * @param {string?} iconURL The icon URL of the author
             * @returns {{name: string, url: string?, iconURL: string?}} The author object
            */
            static qAuthor = (name, url = null, iconURL = null) => ({ name, url, iconURL });
            /**
             * Quick Footer
             *
             * Creates a footer quickly
             * @param {string} text The text of the footer
             * @param {string?} url The URL of the footer
             * @returns {{text: string, url: string?}} The footer object
            */
            static qFooter = (text, url = null) => ({ text, url });
        };
    };
    /**
     * @class
     * @classdesc
     * Initializer
     *
     * A Utility class that contains all the necessary information for different segments of the bot
    */
    static Initializers = class {
        /**
         * @class
         * @classdesc
         * Triggers
         *
         * The Triggers Object
        */
        static Trigger = class {
            /**
             * @type {string}
             * @description
             * The Name of the trigger
             */
            name;
            /**
             * @type {boolean}
             * @description
             * Whether or not to completely disable the entire trigger function
             */
            globalDisable;
            /**
             * @type {{
                * message: SubContainer.TriggerMessage,
                * channel: SubContainer.TriggerChannel,
                * role: SubContainer.TriggerRole,
                * user: SubContainer.TriggerUser
             * }}
             * @description
             * The Configuration information of the Trigger
             */
            triggerConfig;
            /**
             * @type {(client: Client, message:djs.Message) => any}
             * @description
             * The function to run when the trigger is activated
             */
            execute;

            /**
             * @param {string} name
             * @param {SubContainer.TriggerMessage} message
             * @param {SubContainer.TriggerChannel} channel
             * @param {SubContainer.TriggerRole} role
             * @param {SubContainer.TriggerUser} user
             */
            constructor(name, message, channel, role, user) {
                this.name = name;
                this.globalDisable = false;
                this.triggerConfig = {
                    message,
                    channel,
                    role,
                    user,
                };
                this.execute = (_client, _message) => { };
            }

            /**
             * @param {boolean} newValue
             * @description
             * Sets the global disable value
             */
            setGlobalDisable(newValue) {
                this.globalDisable = newValue;
                return this;
            }
            /**
             * @param {(client: Client, message: djs.Message) => any} handler
             * @description
             * Sets the execute function for the trigger
             */
            setExecute = (handler) => Object.assign(this, { execute: handler });
            /** @inheritdoc SubContainer.TriggerMessage */
            static Message = SubContainer.TriggerMessage;
            /** @inheritdoc SubContainer.TriggerChannel */
            static Channel = SubContainer.TriggerChannel;
            /** @inheritdoc SubContainer.TriggerRole */
            static Role = SubContainer.TriggerRole;
            /** @inheritdoc SubContainer.TriggerUser */
            static User = SubContainer.TriggerUser;
        };
        /**
         * @class
         * @classdesc
         * Commands
         *
         * The Commands Object
        */
        static Command = class {
            /**
             * @type {string}
             * @description
             * The Name of the command
             */
            name;
            /**
             * @type {Array<string>}
             * @description
             * The message terms that trigger the command
             */
            triggers;
            /**
             * @type {SubContainer.CommandInfo}
             * @description
             * The information used in the help command for the command
             */
            info;
            /**
             * @type {djs.PermissionFlagsBits?}
             * @description
             * The Permission (if any) required to run the command
             */
            requiredPerm;
            /**
             * @type {Array<djs.ChannelType>?}
             * @description
             * What channels the command is allowed to be ran in
             */
            channelLimits;
            /**
             * @type {Array<string>?}
             * @description
             * An array of role IDs that are allowed to run the command
             */
            allowedRoles;
            /**
             * @type {Array<string>?}
             * @description
             * An array of user IDs that are allowed to run the command
             */
            allowedUsers;
            /**
             * @type {boolean}
             * @description
             * Whether or not the command should be blocked in DMs
             */
            blockDM;
            /**
             * @type {boolean}
             * @description
             * Whether or not the command is completely disabled
             */
            disabled;
            /**
             * @type {{slash: boolean, text: boolean}}
             * @description
             * The types of methods that can trigger the command
             */
            type;
            /**
             * @type {djs.SlashCommandBuilder?}
             * @description
             * The Discord API information on the command (used to register the slash command)
             */
            data;
            /**
             * @type {(interaction: djs.ChatInputCommandInteraction, client: Client) => any}
             * @description
             * The function to be executed when the ***SLASH*** command is ran
             */
            commandExecute;
            /**
             * @type {(message: djs.Message, client: Client) => any}
             * @description
             * The function to be executed when the ***MESSAGE*** command is ran
             */
            messageExecute;
            /**
             * @type {(interaction: djs.AutocompleteInteraction, client: Client) => any}
             * @description
             * The function to be executed when ***AUTOCOMPLETE*** is used
             */
            autocomplete;

            /**
             * @param {string} name
             * @param {Array<string>} triggers
             * @param {SubContainer.CommandInfo} config
             * @param {SubContainer.CommandFilters} restrictions
             * @param {{slash: boolean, text: boolean}} types
             * @param {import('discord.js').SlashCommandBuilder}
             */
            constructor(name, triggers, config, restrictions, types, data) {
                this.name = name;
                this.triggers = triggers;
                this.info = {
                    type: config.type,
                    name,
                    description: config.description,
                    usage: config.usage,
                    examples: config.examples,
                    blockDM: !restrictions.dms,
                    aliases: triggers,
                };
                this.requiredPerm = restrictions.perm;
                this.channelLimits = restrictions.channels;
                this.allowedRoles = restrictions.roles;
                this.allowedUsers = restrictions.users;
                this.blockDM = !restrictions.dms;
                this.disabled = config.disabled;
                this.type = types;
                this.data = data;
                this.commandExecute = async (_interaction, _client) => { };
                this.messageExecute = async (_message, _client) => { };
                this.autocomplete = async (_interaction, _client) => { };
            }
            /**
             * @param {(interaction: djs.ChatInputCommandInteraction, client: Client) => any} handler
             * @description
             * Sets the execute function for ***SLASH*** commands
             */
            setCommand = (handler) => Object.assign(this, { commandExecute: handler });
            /**
             * @param {(message: djs.Message, client: Client) => any} handler
             * @description
             * Sets the execute function for ***MESSAGE*** commands
             */
            setMessage = (handler) => Object.assign(this, { messageExecute: handler });
            /**
             * @param {(interaction: djs.AutocompleteInteraction, client: Client) => any} handler
             * @description
             * Sets the execute function for ***AUTOCOMPLETE*** interactions
             */
            setAutocomplete = (handler) => Object.assign(this, { autocomplete: handler });
            /** @inheritdoc SubContainer.CommandFilters */
            static Restrictions = SubContainer.CommandRestrictions;
            /** @inheritdoc SubContainer.CommandInfo */
            static Info = SubContainer.CommandInfo;
        };
        /**
         * @class
         * @classdesc
         * Messages
         *
         * The Messages Object
        */
        static Message = class {
            /**
             * @type {string}
             * @description
             * The identifier of the message
             */
            name;
            /**
             * @type {string}
             * @description
             * The Human-Readable name for the message
             */
            displayName;
            /**
             * @type {(client: Client) => djs.Message}
             * @description
             * The function to get the message data
             */
            getValue;

            /**
             * @param {string} n
             * @param {string} dn
             */
            constructor(n, dn) {
                this.name = n;
                this.displayName = dn;
                this.getValue = async (_client) => { /* Do Stuff Here */ };
            }
            /**
             * @param {(client: Client) => djs.Message} handler
             * @description
             * Sets the function to get the message data
             */
            content = (handler) => {
                this.getValue = handler;
                return this;
            };
        };
        /**
         * @class
         * @classdesc
         * Components
         *
         * The Components Object
        */
        static Components = class {
            /** @inheritdoc SubContainer.ButtonComponent */
            static Button = SubContainer.ButtonComponent;
            /** @inheritdoc SubContainer.ContextMenuComponent */
            static ContextMenu = SubContainer.ContextMenuComponent;
            /** @inheritdoc SubContainer.ModalComponent */
            static Modal = SubContainer.ModalComponent;
            /** @inheritdoc SubContainer.SelectMenuComponent */
            static SelectMenu = SubContainer.SelectMenuComponent;
            /** @inheritdoc SubContainer.ComponentInfo */
            static Info = SubContainer.ComponentInfo;
        };
        /**
         * @class
         * @classdesc
         * Events
         *
         * The Events Object
        */
        static Event = class {
            /**
             * @type {djs.Event}
             * @description
             * The Event this file is associated with
             */
            event;
            /**
             * @type {(client: Client, ...args) => {}}
             * @description
             * The function to be executed
             */
            execute;

            /**
             * @param {string} event
             */
            constructor(event) {
                this.event = event;
                this.execute = async (_client, ..._args) => { };
            }
            /**
             * @param {(client: Client, ...args) => {}} handler
             * @description
             * Sets the execute function for the event
             */
            setExecute = (handler) => Object.assign(this, { execute: handler });
        };
    };
}

/**
 * @class
 * @classdesc
 * Runtime Statistics
 *
 * A class that represents the runtime statistics of the bot
 */
class RuntimeStatistics {
    /**
     * @type {number}
     * @description
     * The number of `X` that have been registered
     */
    registered;
    /**
     * @type {number}
     * @description
     * The number of `X` that have been executed
     */
    executed;

    constructor() {
        this.registered = 0;
        this.executed = 0;
    }
    /**
     * @description
     * Increments the registered value
    */
    reg = () => ++this.registered;
    /**
     * @description
     * Increments the executed value
     */
    exec = () => ++this.executed;
}

const thisSetter = (t) => {
    throw new ReferenceError(`${t.name} is Read - Only`);
};

class Utils {
    static Time = Timer;
    static Discord = Discord;
    static Text = Text;
    static List = List;
    static RuntimeStatistics = RuntimeStatistics;

    get Time() {
        return Timer;
    }

    set Time(_) {
        thisSetter(Timer);
    }

    get Discord() {
        return Discord;
    }

    set Discord(_) {
        thisSetter(Discord);
    }

    get Text() {
        return Text;
    }

    set Text(_) {
        thisSetter(Text);
    }

    get List() {
        return List;
    }

    set List(_) {
        thisSetter(List);
    }

    get RuntimeStatistics() {
        return RuntimeStatistics;
    }

    set RuntimeStatistics(_) {
        thisSetter(RuntimeStatistics);
    }
}

module.exports = Utils;
