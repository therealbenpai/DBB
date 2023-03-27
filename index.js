#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import { exec } from "child_process";
import fse from "fs-extra";

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


const { directory, clientID, token, prefix } = (await inquirer.prompt(questions))

console.log(chalk.green('Creating bot directory...'))

await fse.copy(`${process.cwd()}/base/`, `./${directory}/`)
console.log(chalk.green('Bot directory created!'))
await console.log(chalk.green('Installing dependencies...'))

await exec(`cd ${directory} && npm i`, async (err, ...args) => {
    if (err) throw err;
    console.log(chalk.green('Dependencies installed!'))
    await console.log(chalk.green('Setting up .env...'))

    await fs.writeFileSync(`./${directory}/.env`, fs.readFileSync(`./${directory}/.env`, 'utf8').replace('$TOKEN', token).replace('$CLIENT_ID', clientID).replace('$PREFIX', prefix), { encoding: 'utf8' })

    console.log(chalk.green('Bot setup complete!'))
})