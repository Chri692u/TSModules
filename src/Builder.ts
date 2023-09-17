import * as fs from "fs/promises";
import * as fss from "fs"
import * as path from "path"
import { execSync } from "child_process";
// import * as file from "../Example/tsmodules.json";
//import * as config from "../tsconfig.json";
import { Config, tsconfig } from "./Config";
import type { PathMap } from "./CLI/Interface";
import { Module } from "./Module"
import { runParser } from "./Parser";
import { build_recursively, translate_module} from "./Translation"


import type { Executable, Library, TSconfig } from "./Config";


// function to run the binary file from compilation
function run(executable_name: string) {
    // compile(project_name)
    // run the binary in dist-folder
}

export async function compile(name: string): Promise<void> {
    const projects: string = path.join(__dirname, "CLI", 'project_list.json');
    if (fss.existsSync(projects)) {
        //TODO: her kan vi se alle projects
        //Get the config file
        const projectsContents: string = fss.readFileSync(projects, 'utf-8');
        const map: PathMap = JSON.parse(projectsContents);
        const dirPath: string = map[name];
        const dirname: string = path.join(dirPath, name)
        const file_path: string = path.join(dirname, "tsmodules.json")
        const cfg_contents = fss.readFileSync(file_path, "utf-8")
        const config: Config = JSON.parse(cfg_contents)
        const { exec, libs }: { exec: Executable, libs: Library } = config;


        // Generate tsconfig.json
        let tsConfig: TSconfig = { ...tsconfig, files: [`./app/${exec['main_is']}`, ...libs['exposed_modules'].map((module: any) => `./${libs['source_dirs']}/${module}`)] };
        // Parse modules
        let libraries: Module[] | undefined = makeLibrary(name)
        let main_program = makeMain(name)
        translate_module(main_program)
        //Translate modules
        //let main_src, workspaces = build_recursively(main_program, libraries)

        //Write to dist dir
        // ...
    }
}

function makeMain(name: string) {
    const projects: string = path.join(__dirname, "CLI", 'project_list.json');

    if (fss.existsSync(projects)) {

        // Get the config file
        const projectsContents: string = fss.readFileSync(projects, 'utf-8');
        const map: PathMap = JSON.parse(projectsContents);
        const dirPath: string = map[name];
        const dirFolder: string = path.join(dirPath, name);
        const config: Config = JSON.parse(fss.readFileSync(path.join(dirFolder, "tsmodules.json"), 'utf-8'))

        // Get Main file
        const main_path_name = config.exec.main_is
        const app_folder = config.exec.source_dirs
        const main_path = path.join(dirPath, name, app_folder,main_path_name)
        // Parse and make module
        const content = fss.readFileSync(main_path, 'utf-8')
            const module = runParser(content)
            console.log(module._tag);          
            if (module._tag === "Left") {
                throw new Error(module.left)
            } else {
                return new Module(module.right.mod.name,
                                  module.right.mod.imports,
                                  module.right.mod.exports,
                                  module.right.code.join())
            }
    }
}

function makeLibrary(name: string) {
    const projects: string = path.join(__dirname, "CLI", 'project_list.json');

    if (fss.existsSync(projects)) {
        // Get the config file
        const projectsContents: string = fss.readFileSync(projects, 'utf-8');
        const map: PathMap = JSON.parse(projectsContents);
        const dirPath: string = map[name];
        const dirFolder: string = path.join(dirPath, name);
        const config: Config = JSON.parse(fss.readFileSync(path.join(dirFolder, "tsmodules.json"), 'utf-8'))

        //Get library paths
        const exposed_modules: string[] = config.libs.exposed_modules
        const libPaths: string[] = exposed_modules.map((exposed: string) => path.join(dirFolder, config.libs.source_dirs, exposed))

        //Get AST From ts files and parse them into modules
        const modules: Module[] = []
        libPaths.forEach((path: string) => {
            const content = fss.readFileSync(path, 'utf-8')
            const module = runParser(content)           
            if (module._tag === "Left") {
                throw new Error(module.left)
            } else {
                modules.push(new Module(module.right.mod.name,
                                        module.right.mod.imports,
                                        module.right.mod.exports,
                                        module.right.code.join()))
            }
        })

        return modules
    }
}

/**
 * This function compiles a TypeScript project located at a specific path.
 * It uses the `tsc` command to compile the project and logs a message to the console upon successful compilation.
 * If the compilation fails, it rejects the promise with the error.
 *
 * @param path - The path to the TypeScript project that needs to be compiled.
 * @param projectName - The name of the project. This is used in the console log message upon successful compilation.
 * @returns A Promise that resolves when the project is successfully compiled. If the compilation fails, the Promise is rejected with the error.
 * @throws Will throw an error if the compilation fails.
 */
function compileModule(path: string, projectName: string) {
    //Hvis vi gerne vil have at den returner noget så skal vi skifte resolve
    return new Promise<void>((resolve, reject) => {
        try {
            // Cursed but works temporary
            // Project list i CLI til at gå ind i path ordenligt
            execSync(`cd ${path} && tsc`);
            //Måske er jeg en dumbass her ved console.log() fordi den måske køre før den er successfull
            console.log(`${projectName} compiled`)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}


/**
 * This function initializes a new project with a given name and configuration.
 * It creates a new directory for the project, writes a configuration file, and initializes the project files.
 *
 * @param name - The name of the project to be created.
 * @param config - The configuration object for the project.
 * @returns The path to the configuration file of the newly created project.
 */
export function initialize_blank(name: string, config: Config, folder:string) {
    // Create json file
    const dirname: string = path.join(folder, name);
    fss.mkdirSync(dirname, { recursive: true });

    const json: string = JSON.stringify(config, null, 4);
    const file_path: string = path.join(dirname, 'tsmodules.json');
    fss.writeFileSync(file_path, json);

    // Create project files
    reinitialize(name, folder);
}


/**
 * This function reinitializes a project with a given name.
 * It reads the project's configuration file and reinitializes the project's libraries and executables based on the configuration.
 *
 * @param name - The name of the project to be reinitialized.
 */
export function reinitialize(name: string, folder:string) {
    const dirname: string = path.join(folder, name)
    const file_path = path.join(dirname, "tsmodules.json")
    const cfg_contents = fss.readFileSync(file_path, "utf-8")
    const config: Config = JSON.parse(cfg_contents)

    // Reinitialize libraries
    const library: Library = config.libs
    const exposed_modules: string[] = library.exposed_modules
    const source_dirs: string = library.source_dirs
    const lib_dir: string = path.join(dirname, source_dirs)

    //! a little thingers right here
    console.log(exposed_modules);

    fss.mkdirSync(lib_dir, { recursive: true })

    exposed_modules.forEach((module_name) => {
        const module_path: string = path.join(lib_dir, module_name);

        if (!fss.existsSync(module_path)) {
            fss.writeFileSync(module_path, "// Your code here");
        }
    })

    // Reinitialize executables
    const executable: Executable = config.exec
    const exec_dir: string = path.join(dirname, executable.source_dirs)
    const main_file_path: string = path.join(exec_dir, executable.main_is);

    fss.mkdirSync(exec_dir, { recursive: true })
    if (!fss.existsSync(main_file_path)) {
        fss.writeFileSync(main_file_path, "// Your main code here");
    }
}

// function to cleanup thank you
function cleanup() {
    // remove dist folder and useless stuff
}