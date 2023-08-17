// @ts-ignore
import { input, select } from '@inquirer/prompts';
import { initialize_blank, get_config} from '../Builder'
import { Config } from "../Config";

run()

async function run() {
    let map = new Map();
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
            let cfg = await run_init()
            map.set("test", cfg)
            console.log(map)
            
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
    initialize_blank(answer)
    let state = get_config(answer)
    return state
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

async function ask(){
  return
}