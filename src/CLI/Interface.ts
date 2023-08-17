// @ts-ignore
import { input, select } from '@inquirer/prompts';

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
    const answer = await input({ message: 'Name of new project:' });
    //initialize blank
    //update CLI state
}

async function run_reinit(){
    console.log("reinit");
    //askProject
    //reinitialize(state)
}

async function run_build(){
    console.log("build");
    //askProject
    //compile
}

async function run_bin(){
    //askProject
    console.log("bin");
}

async function askProject(){
    console.log("what projects do you want to run?");
}