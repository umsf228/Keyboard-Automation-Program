const chalk = require('chalk');
const ks = require('node-key-sender');
const {GlobalKeyboardListener} = require("node-global-key-listener")
const kr = new GlobalKeyboardListener()
const fs = require("fs");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
function loadConfig() {
    return JSON.parse(fs.readFileSync("./config.json", "utf-8"));
}

let working = true
let sequence = loadConfig();

kr.addListener(async function (e, down) {
    try {
        if (e.state == "DOWN" && e.name == "Q" && (down["LEFT CTRL"] || down["RIGHT CTRL"])) {
            working = !working
    
            if (working) {
                main();
                console.log(chalk.green('Working'))
            } else {
                console.log(chalk.red('Paused'))
            }
            return true;
        } else if (e.state == "DOWN" && e.name == "S" && (down["LEFT CTRL"] || down["RIGHT CTRL"])) {
            setTimeout(() => {
                sequence = loadConfig();
                console.log(chalk.blue('Config saved, current config:'))
                sequence.forEach(el => {
                    console.log(`${el.key} => ${el.delay}ms =>`)
                })
            }, 100)
        } else if (e.state == "DOWN" && e.name == "DELETE" && (down["LEFT CTRL"] || down["RIGHT CTRL"])) {
            console.log(chalk.green('Exit the program'))
            process.exit();
        }
    } catch (e) {
        console.error("PROBLEM IN KEYREADER ====================")
        console.error(e)
    }
});

async function main() {
    try {
        while (working) {
            for (const el of sequence) {
                if (!working) return
                await ks.sendKey(el.key)
                await delay(el.delay)
            }
        }
    } catch (e) {
        console.error("PROBLEM IN MAIN LOOP ====================")
        console.error(e)
    }
}
async function startMessage() {
    console.log(chalk.green('Program starts in 3s'))
    await delay(3000)
    console.log(chalk.green('Program started'))
}

startMessage()
main()