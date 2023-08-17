import * as fs from "fs/promises";
import * as fss from "fs"
import * as path from "path"
import { execSync } from "child_process";
// import * as file from "../Example/tsmodules.json";
//import * as config from "../tsconfig.json";
import { Config, initial_cfg } from "./Config";


// function to run the binary file from compilation
function run(executable_name: string) {
    // compile(project_name)
    // run the binary in dist-folder
}


/**
 * Compiles the TypeScript files based on the provided JSON configuration.
 * @param json_config - The JSON configuration object.
 * @returns A promise that resolves when the compilation is completed successfully, or rejects with an error if any file operation fails or if the compilation itself fails.
 */
/*
async function compile(json_config: any) {
    const { executable, library } = json_config;

    // Generate tsconfig.json
    let tsConfig = { ...config, include: [executable['main-is'], ...library['exposed-modules'].map((module: any) => `${library['source-dirs']}/${module}.ts`)], exclude: ["node_modules"] };

    try {
        // Write tsconfig.json asynchronously
        await fs.writeFile("tsconfig.json", JSON.stringify(tsConfig, null, 2));

        // Compile the TypeScript files asynchronously
        await new Promise<void>((resolve, reject) => {
            try {
                execSync("tsc");
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
*/

// function that creates a project
export function initialize_blank(name:any) {
    // Create json file
    const dirname = path.join(__dirname, name)
    fss.mkdirSync(dirname, { recursive: true })

    const json = JSON.stringify(initial_cfg, null, 4)
    const file_path = path.join(dirname, "tsmodules.json")
    fss.writeFileSync(file_path, json);

    // Create project files
    reinitialize(name)
    return file_path
}

export function reinitialize(name:string) {
    const dirname = path.join(__dirname, name)
    const file_path = path.join(dirname, "tsmodules.json")
    const cfg_contents = fss.readFileSync(file_path, "utf-8")
    const config: Config = JSON.parse(cfg_contents)

    // Reinitialize libraries
    const library = config.libs
    const exposed_modules = library.exposed_modules
    const source_dirs = library.source_dirs
    const lib_dir = path.join(dirname, source_dirs)
    console.log(exposed_modules);
    
    fss.mkdirSync(lib_dir, { recursive: true })

    exposed_modules.forEach((module_name) => {
        const module_path = path.join(lib_dir, module_name);

        if (!fss.existsSync(module_path)) {
            fss.writeFileSync(module_path, "// Your code here");
        }
    })

    // Reinitialize executables
    config.exec.forEach((executable) => {
        const source_dirs = executable.source_dirs;
        const exec_dir = path.join(dirname, source_dirs)
        const main_file_path = path.join(exec_dir, executable.main_is);

        fss.mkdirSync(exec_dir, { recursive: true })
        if (!fss.existsSync(main_file_path)) {
            fss.writeFileSync(main_file_path, "// Your main code here");
        }
    })
}

// function to cleanup thank you
function cleanup() {
    // remove dist folder and useless stuff
}