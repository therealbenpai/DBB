#! /usr/bin/env node
import('inquirer')
    .then((inquirer) => inquirer.default)
    .then((inquirer) => {
        const genQ = (type, name, message, extra = {}) => Object.assign({}, { type, name, message }, extra)
        const
            chalk = require('chalk'),
            fs = require('fs-extra'),
            { exec } = require('child_process'),
            { cwd } = require('process');
        inquirer.prompt([
            genQ('input', 'directory', 'What would you like to name your bot directory?'),
            genQ('input', 'clientID', 'What is your bot\'s client ID?'),
            genQ('password', 'token', 'What is your bot\'s token?', { mask: '*' }),
            genQ('input', 'prefix', 'What would you like your bot\'s prefix to be?')
        ]).then(async ({ directory, clientID, token, prefix }) => {
            console.log(chalk.green`Creating bot directory...`)
            await fs.copy(`${__dirname}/base/`, `${cwd()}/${directory}/`)
            console.log(chalk.green`Bot directory created!\nInstalling dependencies...`)
            exec(`cd ${directory} && npm i`, (err, ...args) => {
                if (err) throw err;
                console.log(chalk.green`Dependencies installed!\nSetting up .env...`)
                const alteredEnv = fs
                    .readFileSync(`./${directory}/.env`, 'utf8')
                    .replace('$TOKEN', token)
                    .replace('$CLIENT_ID', clientID)
                    .replace('$PREFIX', prefix)
                fs.writeFileSync(`./${directory}/.env`, alteredEnv, { encoding: 'utf8' })
                console.log(chalk.green`Bot setup complete!`)
            })
        })
    })