import * as fs from "fs/promises";
import * as fss from "fs"
import * as path from "path"
import { execSync } from "child_process";
// import * as file from "../Example/tsmodules.json";
//import * as config from "../tsconfig.json";
import { Config, tsconfig } from "./Config";
import type { PathMap } from "./CLI/Interface";
import { Module } from "./Module"


import type { Executable, Library, TSconfig } from "./Config";


// function to run the binary file from compilation
function run(executable_name: string) {
    // compile(project_name)
    // run the binary in dist-folder
}


/*
 * Compiles the TypeScript files based on the provided JSON configuration.
 * @param json_config - The JSON configuration object.
 * @returns A promise that resolves when the compilation is completed successfully, or rejects with an error if any file operation fails or if the compilation itself fails.
 */
export async function compile(name: string): Promise<void> {


    const projects: string = path.join(__dirname, "CLI", 'project_list.json');
    console.log(__dirname)
    if (fss.existsSync(projects)) {
        const dirname: string = path.join(__dirname, name)
        const file_path: string = path.join(dirname, "tsmodules.json")

        const cfg_contents = fss.readFileSync(file_path, "utf-8")
        const config: Config = JSON.parse(cfg_contents)
        const { exec, libs }: { exec: Executable, libs: Library } = config;


        //TODO: her kan vi se alle projects
        const projectsContents: string = fss.readFileSync(projects, 'utf-8');
        const map: PathMap = JSON.parse(projectsContents);

        //! Read files in libs and compile parse them into modules (module.ts)
        // Parse all files (exec and libs - Our syntax extention)
        //? Use typescript compiler API to compile workspaces for each module
        //* Insert all imports acordenly

        // Generate tsconfig.json
        let tsConfig: TSconfig = { ...tsconfig, files: [`./app/${exec['main_is']}`, ...libs['exposed_modules'].map((module: any) => `./${libs['source_dirs']}/${module}`)] };

        console.log("hello")
        try {
            // Write tsconfig.json asynchronously
            await fs.writeFile(path.join(dirname, "tsconfig.json"), JSON.stringify(tsConfig, null, 2));

            // Compile the TypeScript files asynchronously
            await new Promise<void>((resolve, reject) => {
                try {

                    //TODO: fix 
                    //@ts-ignore
                    const promises: Promise<void>[] = Object.entries(map).map(([projectName, projectValue]) => compileModule(projectValue, projectName));

                    Promise.all(promises);

                    console.log("Compilation completed successfully.");
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        } catch (error) {
            console.error("File operation failed:", error);
        }
    }

}

function makeMain(name: string) {


    const projects: string = path.join(__dirname, 'project_list.json');

    if (fss.existsSync(projects)) {

        const projectsContents: string = fss.readFileSync(projects, 'utf-8');
        const map: PathMap = JSON.parse(projectsContents);
        const dírPath: string = map[name];
        const config: Config = JSON.parse(fss.readFileSync(dírPath, 'utf-8'))

        const exposed_modules: string[] = config.libs.exposed_modules
        /**
         * LAV MAIN TIL ARRAY
         * parseModule(fileName: string);
         * const paths: string[] = exposed_modules.map((exposed: string) => dírPath.replace("tsmodules.json", path.join(config.libs.source_dirs,config.exec.main_is)))
         * const modules: ModuleXD[] = paths.map(parseModule) // paths.map((file: string) => parseModule(file))
         */

        /**
         * makeLibrary
         * 
         */

    }


}


function makeLibrary(name: string) {

    const projects: string = path.join(__dirname, "CLI", 'project_list.json');

    if (fss.existsSync(projects)) {
        const projectsContents: string = fss.readFileSync(projects, 'utf-8');
        const map: PathMap = JSON.parse(projectsContents);
        const dírPath: string = map[name];
        const config: Config = JSON.parse(fss.readFileSync(dírPath, 'utf-8'))
        const exposed_modules: string[] = config.libs.exposed_modules



        /**
         * parseModule(fileName: string);
         * const libPaths: string[] = exposed_modules.map((exposed: string) => dírPath.replace("tsmodules.json", path.join(config.libs.source_dirs, exposed)))
         * const modules: ModuleXD[] = libPaths.map(parseModule) // libPaths.map((file: string) => parseModule(file))
         */


        const module: Module = new Module(name, ["negermand"], exposed_modules)

        /**
         *! makeWorkspaces:
         * 1. compile module to TS AST
         * 2. Solve dependencies
         * 3. Write files
         * 
         * 
         * makeWorkspaces(modules: ModuleXD[]): void maybe
         */
        console.log(module)

    }
}



makeLibrary("ole")

// //TODO: maybe union type
// function getProjects(): PathMap | boolean {
//     const projects: string = path.join(__dirname, "CLI", 'project_list.json');
//     if (fss.existsSync(projects)) {
//         const projectsContents: string = fss.readFileSync(projects, 'utf-8');
//         const map: PathMap = JSON.parse(projectsContents);
//         return map;
//     } else {
//         return false;
//     }


// }

// function config(name: string): Config {
//     const projects: PathMap | boolean = getProjects()
//     if (projects) {
//         try {

//         } catch (error) {

//         }
//         return JSON.parse(fss.readFileSync(projects[name], 'utf-8')) as Config
//     }

// }


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
export function initialize_blank(name: string, config: Config) {
    // Create json file
    const dirname: string = path.join(__dirname, name);
    fss.mkdirSync(dirname, { recursive: true });

    const json: string = JSON.stringify(config, null, 4);
    const file_path: string = path.join(dirname, 'tsmodules.json');
    fss.writeFileSync(file_path, json);

    // Create project files
    reinitialize(name);
    return file_path;
}


/**
 * This function reinitializes a project with a given name.
 * It reads the project's configuration file and reinitializes the project's libraries and executables based on the configuration.
 *
 * @param name - The name of the project to be reinitialized.
 */
export function reinitialize(name: string) {
    const dirname: string = path.join(__dirname, name)
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