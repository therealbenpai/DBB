#! /usr/bin/env node
import('inquirer')
    .then((inquirer) => inquirer.default)
    .then((inquirer) => {
        const chalk = require('chalk');
        const fs = {
            ...require('fs'),
            ...require('fs-extra')
        }
        const { exec } = require('child_process');
        const { cwd } = require('process');

        const questions = [
            {
                type: 'input',
                name: 'directory',
                message: 'What would you like to name your bot directory?'
            },
            {
                type: 'input',
                name: 'clientID',
                message: 'What is your bot\'s client ID?'
            },
            {
                type: 'password',
                mask: '*',
                name: 'token',
                message: 'What is your bot\'s token?'
            },
            {
                type: 'input',
                name: 'prefix',
                message: 'What would you like your bot\'s prefix to be?'
            }
        ];

        inquirer.prompt(questions).then(async ({ directory, clientID, token, prefix }) => {
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