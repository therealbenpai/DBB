#! /usr/bin/env node
const inquirer = import('inquirer').then((inquirer) => inquirer.default).then((inquirer) => {
    const chalk = require('chalk');
    const fs = require('fs');
    const { exec } = require('child_process');
    const fse = require('fs-extra');
    const { cwd } = require('process');

    /*
    Questions for the bot builder:
        1) Directory Name
        2) Bot Client ID
        3) Bot Token
        4) Bot Prefix
    
    from there, clone the ./base directory and rename it to the directory name
    then, replace the token ("$TOKEN"), client id ("$CLIENT_ID"), and prefix ("$PREFIX") in the .env with the user's input
    after that, run npm i to install the dependencies
    make sure to let the user know what step the script is on
    */

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

        await fse.copy(`${__dirname}/base/`, `${cwd()}/${directory}/`)
        console.log(chalk.green`Bot directory created!`)
        console.log(chalk.green`Installing dependencies...`)
        exec(`cd ${directory} && npm i`, (err, ...args) => {
            if (err) throw err;
            console.log(chalk.green`Dependencies installed!`)
            console.log(chalk.green`Setting up .env...`)

            fs.writeFileSync(`./${directory}/.env`, fs.readFileSync(`./${directory}/.env`, 'utf8').replace('$TOKEN', token).replace('$CLIENT_ID', clientID).replace('$PREFIX', prefix), { encoding: 'utf8' })

            console.log(chalk.green`Bot setup complete!`)
        })
    })
})