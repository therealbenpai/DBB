#! /usr/bin/env node
import('inquirer')
    .then(async (inq) => {
        const rs = (err, spinner, text, rv) => {
            spinner[err ? 'error' : 'success']({
                text: template(
                    err
                        ? `{red ${text[0]} failed}\n\nError: ${text[1]}`
                        : `{green ${text[0]} Successfully!}`
                )
            })
            return rv
        }
        const
            inquirer = inq,
            genQ = (type, name, message, extra = {}) => Object.assign({}, { type, name, message }, extra),
            { default: chalk, template } = require('chalk-template'),
            fs = require('fs-extra'),
            { exec } = require('child_process'),
            spinner = require('nanospinner');
        const { directory, clientID, token, prefix } = inquirer.prompt([
            genQ('input', 'directory', "What would you like to name your bot directory?"),
            genQ('input', 'clientID', "What is your bot's client ID?"),
            genQ('password', 'token', "What is your bot's token?", { mask: '*' }),
            genQ('input', 'prefix', "What would you like your bot's prefix to be?")
        ])
        const cDS = spinner.createSpinner(chalk`{yellow Creating bot directory...}`)
        fs
            .copy(`${__dirname}/base/`, `${process.cwd()}/${directory}/`)
            .then(
                (s) => rs(false, cDS, [`Created bot directory`], s),
                (f) => rs(true,  cDS, ['Directory Creation',  f], f)
            )
        const deps = spinner.createSpinner(chalk`{yellow Installing dependencies...}`)
        exec
            .__promisify__(`cd ${directory} && npm i`)
            .then((v, err) => rs(Boolean(err), deps, err ? ['Dependency Installation', err] : ['Dependencies Installed'], err || v))
        const env = spinner.createSpinner(chalk`{yellow Setting up .env...}`)
        fs
            .writeFile(
                `./${directory}/.env`,
                fs
                    .readFileSync(`./${directory}/.env`, 'utf8')
                    .replace(/(\$(TOKEN|CLIENT_ID|PREFIX))/gm, (f) => {
                        switch (f) {
                            case '$TOKEN': return token;
                            case '$CLIENT_ID': return clientID;
                            case '$PREFIX': return prefix;
                        }
                    }),
                { encoding: 'utf8' }
            )
            .then(
                (v) => rs(false, env, ['Environment Setup'], v),
                (f) => rs(true, env, ['Environment Setup', f], f)
            )
        console.log(chalk`{green Bot setup complete!}`)
    })