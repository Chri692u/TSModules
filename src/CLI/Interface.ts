import { Config, initial_cfg } from './../Config';
import { input, select, confirm } from '@inquirer/prompts'
import { initialize_blank, reinitialize, compile } from '../Builder'
import * as fss from "fs"
import * as path from "path"

run()

//TODO: fix det med paths

//TODO: lav en folder til types/interfaces
export interface PathMap {
  [key: string]: string;
}

/**
 * Executes the TSModules CLI.
 * @returns A Promise that resolves once the execution is completed.
 */
async function run(): Promise<void> {
  let exit: boolean = true
  while (exit) {
    let map: PathMap = {}
    const projects: string = path.join(__dirname, "project_list.json")
    const choice: string = await select({
      message: 'TSModules CLI:',
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
          name: 'Print project list',
          value: 'print',
        },
        {
          name: 'Delete a project',
          value: 'delete',
        },
        {
          name: 'Run binary',
          value: 'run',
        },
        {
          name: 'Exit CLI',
          value: 'exit',
        }
      ],
    });

    switch (choice) {
      case "init":
        let { name, file_path }: { name: string, file_path: string } = await run_init()

        if (fss.existsSync(projects)) {
          const projectsContents: string = fss.readFileSync(projects, "utf-8")
          map = JSON.parse(projectsContents)
        }

        // Update the projects map with the new project
        map[name] = file_path
        fss.writeFileSync(projects, JSON.stringify(map, null, 2))
        break

      case "reinit":
        //TODO: maybe create update method so we dont say update in the reinitters it will return undefind if no projects exists
        let updated: string | void = await run_reinit()
        console.log(`Updated ${updated}`)
        break

      case "build":
        await run_build()
        break

      case "print":
        printProjectList()
        break

      case "delete":
        await deleteProject()
        break

      case "run":
        run_bin()
        break

      case "exit":
        exit = false
        break

      default:
        throw new Error("REACHED DEFAULT OH NO DISASTER WORLD IS ENDING WHAT CAN WE DO QUICK CALL THE PIZZA MAN WE GOTTA GET A KEBAB PIZZA WITH THE DRESSING OR ELSE THE WORLD MIGHT BE ENDING ALL TOGETHER REMEMBER TO GET SOME FRIES AND SOME DIP WITH THOSE FRIES OR ELSE THE WORLD IS GOING TO TRIPLE END");

    }
  }
}


/**
 * Prompts the user to initialize a new project and returns the project name and file path.
 * @returns {Promise<{ name: string; file_path: string; }>} A Promise that resolves with an object containing the name and file path of the new project.
 */
export async function run_init(): Promise<{ name: string; file_path: string; }> {
  const answer: string = await input({ message: 'Name of new project:' });
  const projects: string = path.join(__dirname, 'project_list.json');

  if (fss.existsSync(projects)) {
    const projectsContents: string = fss.readFileSync(projects, 'utf-8');
    let map: PathMap = JSON.parse(projectsContents);

    // Check if the project name already exists in the map
    if (map.hasOwnProperty(answer)) {
      throw new Error(`A project with the name "${answer}" already exists.`);
    }
  }

  // Prompt the user for project details
  const versionAnswer: string = await input({
    message: 'Enter the project version:',
    default: initial_cfg.project_version,
  });
  const authorAnswer: string = await input({
    message: 'Enter the author name:',
    default: initial_cfg.author,
  });

  const sourceDirsAnswer: string = await input({
    message: 'Enter the source directories:',
    default: initial_cfg.libs.source_dirs,
  });
  const mainIsAnswer: string = await input({
    message: 'Enter the main file:',
    default: initial_cfg.exec.main_is,
  });
  const sourceDirsExecAnswer: string = await input({
    message: 'Enter the source directories for the executable:',
    default: initial_cfg.exec.source_dirs,
  });
  const targetLangAnswer: string = await input({
    message: 'Enter the target language:',
    default: initial_cfg.exec.target_lang,
  });

  const updatedConfig: Config = {
    ...initial_cfg,
    name: answer,
    project_version: versionAnswer,
    author: authorAnswer,
    libs: {
      ...initial_cfg.libs,
      source_dirs: sourceDirsAnswer,
    },
    exec: {
      ...initial_cfg.exec,
      main_is: mainIsAnswer,
      source_dirs: sourceDirsExecAnswer,
      target_lang: targetLangAnswer,
    },
  };

  let fp: string = initialize_blank(answer, updatedConfig);
  return { name: answer, file_path: fp };
}

/**
 * Prompts the user to select a project to reinitialize.
 * @returns A Promise that resolves with the name of the selected project.
 */
async function run_reinit(): Promise<string | void> {
  const projects: string = path.join(__dirname, 'project_list.json');
  let answer: string
  if (fss.existsSync(projects)) {
    const projectsContents: string = fss.readFileSync(projects, 'utf-8');
    const map: PathMap = JSON.parse(projectsContents);

    const projectNames: string[] = Object.keys(map); // Generate a list of project names

    if (projectNames.length === 0) {
      console.log('No projects found.');
      return;
    }
    const answer: string = await select({ // Use the select prompt
      message: 'Which project do you want to reinitialize?',
      choices: projectNames.map((name) => ({ value: name, name: name })),
    });
    reinitialize(answer)
    return answer
  }
  //@ts-expect-error
  return answer

}

/**
 * Prompts the user to select a project and builds the selected project.
 * @returns A Promise that resolves once the project is built.
 */
async function run_build(): Promise<void> {
  const answer: string = await input({ message: 'What project?' })
  await compile(answer)
}

/**
 * Runs the binary for the selected project.
 * @returns A Promise that resolves once the binary is executed.
 */
async function run_bin(): Promise<void> {
  //ask
  console.log("bin");
}

/**
 * Prints the list of projects.
 * @returns void
 */
function printProjectList(): void {
  const projects: string = path.join(__dirname, "project_list.json");
  if (fss.existsSync(projects)) {
    const projectsContents: string = fss.readFileSync(projects, "utf-8");
    const map: PathMap = JSON.parse(projectsContents);
    console.log("Project List:");
    for (const projectName in map) {
      console.log(`${projectName}: ${map[projectName]}`);
    }
  } else {
    console.log("No projects found.");
  }
}


/**
 * Deletes a project from the project list.
 * @returns A Promise that resolves once the project is deleted.
 */

async function deleteProject(): Promise<void> {
  const projects: string = path.join(__dirname, 'project_list.json');
  if (fss.existsSync(projects)) {
    const projectsContents: string = fss.readFileSync(projects, 'utf-8');
    let map: PathMap = JSON.parse(projectsContents);

    const projectNames: string[] = Object.keys(map); // Generate a list of project names

    if (projectNames.length === 0) {
      console.log('No projects found.');
      return;
    }

    const answer: string = await select({ // Use the select prompt
      message: 'Which project do you want to delete?',
      choices: projectNames.map((name) => ({ value: name, name: name })),
    });

    const projectName: string = answer

    if (map[projectName]) {
      const projectPath: string = map[projectName].replace('tsmodules.json', '');
      if (fss.existsSync(projectPath)) {
        const shouldDeleteFolder: boolean = await confirm({ message: 'Do you want to delete the project folder?' });
        if (shouldDeleteFolder) {
          fss.rmSync(projectPath, { recursive: true });
          console.log(`Project folder '${projectPath}' deleted.`);
        }
      }
      delete map[projectName];
      if (Object.keys(map).length === 0) {
        fss.rmSync(projects);
        console.log('Project list deleted. There are no projects remaining.');
      } else {
        fss.writeFileSync(projects, JSON.stringify(map, null, 2));
        console.log(`Project '${projectName}' removed from the project list.`);
      }
    } else {
      console.log(`Project '${projectName}' not found.`);
    }
  } else {
    console.log('No projects found.');
  }
}