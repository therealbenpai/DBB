#! /usr/bin/env node
import i from 'inquirer';
import fs from 'fs-extra';
import { exec } from 'child_process';
import s from 'nanospinner';
import * as ts from 'chalk-template';
const t = ts.template;

const genQ = (ry, n, m, e = {}) => Object.assign({}, { type: ry, name: n, message: m }, e);
const rs = (e, s, tx, rv) => {
    s[e ? 'error' : 'success']({
        text: t(
            e
                ? `{red ${tx[0]} failed}\n\nError: ${tx[1]}`
                : `{green ${tx[0]} Successfully!}`
        )
    })
    return rv
}

const { d, cid, tk, p } = await i.prompt([
    genQ('input', 'd', "What would you like to name your bot d?"),
    genQ('input', 'cid', "What is your bot's client ID?"),
    genQ('password', 'tk', "What is your bot's token?", { mask: '*' }),
    genQ('input', 'p', "What would you like your bot's prefix to be?")
]);

//* Creating Bot Directory
const cDS = s.createSpinner(t(`{yellow Creating bot d...}`)).start();
await fs
    .copy(`${process.argv[1]}/base/`, `${process.cwd()}/${d}/`)
    .then(
        (s) => rs(false, cDS, [`Created bot d`], s),
        (f) => rs(true, cDS, ['Directory Creation', f], f)
    );

//* Dependency Installation
const deps = s.createSpinner(t(`{yellow Installing dependencies...}`)).start();
await new Promise((resolve, reject) => exec(`cd ${d} && npm install`, (err, stdout, stderr) => err ? reject(stderr) : resolve(stdout)))
    .then((v, err) => rs(Boolean(err), deps, err ? ['Dependency Installation', err] : ['Dependencies Installed'], err || v));

//* Environment Setup
const env = s.createSpinner(t(`{yellow Setting up .env...}`)).start();
await fs
    .writeFile(
        `./${d}/.env`,
        fs
            .readFileSync(`./${d}/.env`, 'utf8')
            .replace(/(\$(TOKEN|CLIENT_ID|PREFIX))/gm, (f) => {
                switch (f) {
                    case '$TOKEN': return tk;
                    case '$CLIENT_ID': return cid;
                    case '$PREFIX': return p;
                }
            }),
        { encoding: 'utf8' }
    )
    .then(
        (v) => rs(false, env, ['Environment Setup'], v),
        (f) => rs(true, env, ['Environment Setup', f], f)
    );

//* Finished
console.log(t(`{green Bot setup complete!}`))
