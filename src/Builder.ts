import * as fs from "fs";
import * as path from "path";


// function to run the binary file from compilation
function run_binary(executable_name:string) {
    // compile(project_name)
    // run the binary in dist-folder
}

// function to compile the main file
function compile(json_config:Object) {
    // make a temporary file
    // insert main + imported functions
    // compile with dist-folder target
    // write files
}

// function that creates a project
function initialize_blank() {
    // Default main executable
    const initial_exec:Executable = {
        name: "main",
        main_is: "main.ts",
        depends: [
            "base"
        ],
        source_dirs: "app",
        target_lang: "ES6"
    }

    // Default config
    const initial_cfg:Config = {
        version: "1.0",
        name: "",
        project_version: "0.0.1",
        author: "",
        maintainer: "",
        extra_files: [
            "README.md"
        ],
        libs: {
            source_dirs: "src",
            exposed_modules: ["notMain.ts"],
            depends: [
                "base"
            ]
        },
        exec: [initial_exec]
    }

    // Create json file
    const dirname = path.join(__dirname, "Example")
    fs.mkdirSync(dirname, { recursive: true })

    const json = JSON.stringify(initial_cfg, null, 4)
    const filePath = path.join(dirname, "tsmodules.json")
    fs.writeFileSync(filePath, json);

    // Create project files
    reinitialize()
}

function reinitialize() {
    const dirname = path.join(__dirname, "Example")
    const file_path = path.join(dirname, "tsmodules.json")
    const cfg_contents = fs.readFileSync(file_path, "utf-8")
    const config: Config = JSON.parse(cfg_contents)

    // Reinitialize libraries
    const library = config.libs
    const exposed_modules = library.exposed_modules
    const source_dirs = library.source_dirs
    const lib_dir = path.join(dirname, source_dirs)
    fs.mkdirSync(lib_dir, { recursive: true })

    exposed_modules.forEach((module_name) => {
        const module_path = path.join(lib_dir, module_name);

        if (!fs.existsSync(module_path)) {
            fs.writeFileSync(module_path, "// Your code here");
        }
    })

    // Reinitialize executables
    config.exec.forEach((executable) => {
        const source_dirs = executable.source_dirs;
        const exec_dir = path.join(dirname, source_dirs)
        const main_file_path = path.join(exec_dir, executable.main_is);

        fs.mkdirSync(exec_dir, { recursive: true })
        if (!fs.existsSync(main_file_path)) {
            fs.writeFileSync(main_file_path, "// Your main code here");
        }
    })
}

// function to cleanup thank you
function cleanup() {
    // remove dist folder and useless stuff
}