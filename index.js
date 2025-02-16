const chalk = require('chalk');
const {GlobalKeyboardListener} = require("node-global-key-listener")
const { exec } = require("child_process");
const kr = new GlobalKeyboardListener()
const path = require("path");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const ahkPath = `"C:\\Program Files\\AutoHotkey\\AutoHotkey.exe"`;
let working = true

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
        } else if (e.state == "DOWN" && e.name == "DELETE" && (down["LEFT CTRL"] || down["RIGHT CTRL"])) {
            console.log(chalk.green('Exit the program'))
            process.exit();
        }
    } catch (e) {
        console.error("PROBLEM IN KEYREADER ====================")
        console.error(e)
    }
})

async function executeAHKScript(scriptPath) {
    return new Promise((resolve, reject) => {
        exec(`${ahkPath} "${scriptPath}"`, (err, stdout, stderr) => {
            if (err) {
                reject("Error executing AHK script: " + err);
                return;
            }
            if (stderr) {
                reject("AHK Script Error: " + stderr);
                return;
            }
            resolve(stdout); // Возвращаем stdout, если все прошло успешно
        });
    });
}

async function main() {
    try {
        const scriptPath = path.join(__dirname, 'config.ahk');
        console.log(chalk.green('Executing AHK script...'));

        while (working) {
            await executeAHKScript(scriptPath);
        }

    } catch (e) {
        console.error("PROBLEM IN MAIN LOOP ====================");
        console.error(e);
    }
}

async function startMessage() {
    console.log(chalk.green('Program starts in 3s'))
    await delay(3000)
    console.log(chalk.green('Program started'))
    main()
}

startMessage()