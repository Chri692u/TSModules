// @ts-ignore
import { select } from '@inquirer/prompts';

run()

async function run() {
    const choice = await select({
        message: 'Select a package manager',
        choices: [
          {
            name: 'Initialize new project',
            value: 'init',
          },
          {
            name: 'Reinitialize a project',
            value: 'reinit',
          },
          {
            name: 'Build project',
            value: 'build',
          },
          {
            name: 'Run binary',
            value: 'run',
          }
        ],
      });

    switch (choice) {
        case "init":
            run_init()
            break
        case "reinit":
            run_reinit()
            break;
        case "build":
            run_build()
            break;
        case "run":
            run_bin()
            break;
        default:
            throw new Error("REACHED DEFAULT OH NO DISASTER");
            
    }
}

async function run_init(){
    console.log("init");
}

async function run_reinit(){
    console.log("reinit");
}

async function run_build(){
    console.log("build");
}

async function run_bin(){
    console.log("bin");
}
