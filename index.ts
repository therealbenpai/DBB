import { $ } from 'bun';

import process from 'node:process';

import inquirer from 'inquirer';
import fs from 'fs-extra';
import spinner from 'nanospinner';
import * as chalkTemplate from 'chalk-template';
import yargs, { type CommandModule } from 'yargs';
import { hideBin } from 'yargs/helpers';

import { version } from './package.json';

yargs(hideBin(process.argv))
    .version(version)
    .help()
    .command({
        builder: (yargs) => {
            
        }
    } as CommandModule)
    .parse()

const makeQuestion = (type: string, name: string, message: string, extra = {}) => Object.assign({}, { type, name, message }, extra);
const response = <K>(err: boolean, spinnerIn: spinner.Spinner, [msg, misc]: string[], returnValue: K) => {
    spinnerIn[err ? 'error' : 'success']({
        text: chalkTemplate.template(
            err
                ? `{red ${msg} failed}\n\nError: ${console.error(misc)}`
                : `{green ${msg} Successfully!}`
        )
    })
    return returnValue
}

const { directory, clientId, token, prefix } = await inquirer.prompt([
    makeQuestion('input', 'directory', "What would you like to name your bot directory?"),
    makeQuestion('input', 'clientId', "What is your bot's client ID?"),
    makeQuestion('password', 'token', "What is your bot's token?", { mask: '*' }),
    makeQuestion('input', 'prefix', "What would you like your bot's prefix to be?")
]) as Record<string, string>;

if (!directory || !clientId || !token || !prefix) {
    console.error(chalkTemplate.template(`{red All fields are required!}`));
    process.exit(1);
}

//* Creating Bot Directory
const createDirectorySpinner = spinner.createSpinner(chalkTemplate.template(`{yellow Creating Bot Directory...}`)).start();
await fs
    .copy(`${import.meta.dir}/base/`, `${process.cwd()}/${directory}/`)
    .then(
        (s) => response(false, createDirectorySpinner, [`Created Bot Directory`], s),
        (f) => response(true, createDirectorySpinner, ['Directory Creation', f], f)
    );

//* Dependency Installation
const deps = spinner.createSpinner(chalkTemplate.template(`{yellow Installing Dependencies...}`)).start();
await new Promise((ok, err) => $`cd ${directory} && npm install`.then(ok).catch(err))
    .then((v) => response(false, deps, ['Dependencies Installed'], v))
    .catch((f) => response(true, deps, ['Dependency Installation', f], f));

//* Environment Setup
const env = spinner.createSpinner(chalkTemplate.template(`{yellow Setting up .env...}`)).start();
await fs
    .writeFile(
        `./${directory}/.env`,
        fs
            .readFileSync(`./${directory}/.env`, 'utf8')
            .replace(/(\$(TOKEN|CLIENT_ID|PREFIX))/gm, (f) => {
                switch (f) {
                    case '$TOKEN': return token;
                    case '$CLIENT_ID': return clientId;
                    case '$PREFIX': return prefix;
                }
                return f;
            }),
        { encoding: 'utf8' }
    )
    .then((v) => response(false, env, ['Environment Setup'], v))
    .catch((f) => response(true, env, ['Environment Setup', f], f));

//* Finished
console.log(chalkTemplate.template(`{green Bot Setup Complete!}`))
