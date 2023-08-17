// @ts-ignore
import { input, select } from '@inquirer/prompts'
import { initialize_blank, reinitialize } from '../Builder'
import * as fss from "fs"
import * as path from "path"
import { log } from 'console'

run()

interface PathMap {
  [key: string]: string;
}

async function run() {
    let map: PathMap = {}
    const projects = path.join(__dirname, "project_list.json")
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
            let { name, file_path } = await run_init()
    
            if (fss.existsSync(projects)) {
                const projectsContents = fss.readFileSync(projects, "utf-8")
                map = JSON.parse(projectsContents)
            }
            
            // Update the projects map with the new project
            map[name] = file_path
            fss.writeFileSync(projects, JSON.stringify(map, null, 2))
            
            break;

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
    const answer = await input({ message: 'Name of new project:' })
    let fp = initialize_blank(answer)
    return { name: answer, file_path: fp }
}

async function run_reinit(){
    const answer = await input({ message: 'What project?' })
    //TODO selectings
    let fp = reinitialize(answer)
    return { name: answer, file_path: fp }
}

async function run_build(){
    console.log("build");
    //ask
    //compile
}

async function run_bin(){
    //ask
    console.log("bin");
}

//TODO: function to print project list