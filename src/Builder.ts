import * as fs from "fs/promises";
import { execSync } from "child_process";
import * as file from "../Example/tsmodules.json";
import * as config from "../tsconfig.json";


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
async function compile(json_config: any) {
    const { executable, library } = json_config;

    // Generate tsconfig.json
    let tsConfig = { ...config, include: [executable['main-is'], ...library['exposed-modules'].map((module: any) => `${library['source-dirs']}/${module}.ts`)], exclude: ["node_modules"] };

    try {
        // Write tsconfig.json asynchronously
        // await fs.writeFile("tsconfig.json", JSON.stringify(tsConfig, null, 2));

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

compile(file)
// function that creates a project
function initialize_blank(path: string) {
    //Create readme file
    //Create default config file
}

function reinitialize(filename: string) {
    //Read the json file
    //Check if folders/files exist
    //Create missing files
}

// function to cleanup thank you
function cleanup() {
    // remove dist folder and useless stuff
}