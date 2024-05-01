# Discord.JS Bot Builder

This is a simple bot builder for Discord.JS. It is designed to be easy to use and easy to understand. It uses the package [inquirer](https://www.npmjs.com/package/inquirer) to ask questions and [chalk](https://www.npmjs.com/package/chalk) to color the output. It also uses [fs-extra](https://www.npmjs.com/package/fs-extra) to copy the files from the template folder to the new bot folder.

> [!IMPORTANT]
> This package is still in development, and is not yet ready for production use. Use at your own risk.
> This package also lacks error handling in some areas, and may not work as expected in all cases.
> Future versions may include more features, and simplify the process of setting up the system.

## Running

To run the bot builder tool, execute the following command:

```bash
npx @therealbenpai/dbb
```

## File Structure

```plain
/base
⊢ /commands
    ∟ example.js
    ⊢ help.js
⊢ /components
    ⊢ /buttons
        ∟ example.js
    ⊢ /selectMenus
        ∟ example.js
    ⊢ /modals
        ∟ example.js
    ∟ /contextMenus
        ∟ example.js
⊢ /events
    ∟ example.js
    ⊢ interactionCreate.js
    ⊢ messageCreate.js
    ⊢ messageUpdate.js
    ⊢ ready.js
⊢ /messages
    ∟ example.js
⊢ /modules
    ∟ util.js
⊢ /triggers
    ∟ example.js
⊢ /node_modules
⊢ index.js
⊢ .env
∟ package.json
```

## Directories that are important

### /commands

This folder will hold all of your slash commands for your bot

### /events

This folder will hold all of your event listeners for your bot

### /functions

This folder will hold all of your custom miscellaneous functions for your bot

### /triggers

This folder will hold all of your message triggers for your bot. These will function like chat commands.

### /components

This folder will hold all of your components for your bot. These will be buttons, select menus, modals, and context menus.

## Files that are important

### index.js

This is the main file for your bot. It will be the entry point for your bot.

### .env

This is the file that will hold all of your environment variables. It will be used to store your bot token and other important information.

> [!TIP]
> You can edit this file at any time to add more environment variables.
> As well as that, you can change your bot token at any time by changing the `TOKEN` variable in this file.

Be careful with this file, as it contains sensitive information. You should never share this file with anyone.

> [!IMPORTANT]
> You should never share your bot token with anyone. It is the key to your bot, and should be kept secret at all times.
> If you accidentally share your bot token, you should regenerate it immediately.

### package.json

This is the file that will hold all of your bot's dependencies. It will be used to install all of the dependencies for your bot.

## License

This project used a AGPL (Affero General Public License) version 3.0 license. This means that you can use this project for free, but you must make any changes to the project open source. You can read more about the license [here](https://www.gnu.org/licenses/agpl-3.0.en.html).

## Contributing

Please refer to the [contributing guidelines](CONTRIBUTING.md) for more information.

## Code of Conduct

Please refer to the [code of conduct](CODE_OF_CONDUCT.md) for more information.

## Credits

- Lead Developer and Owner: [Benpai](https://sparty18.com)
- Partial Original Code Holder: [FemDevs](https://github.com/femdevs)
