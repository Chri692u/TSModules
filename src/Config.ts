export interface Config {
    version: string
    name: string
    project_version: string
    author: string
    maintainer: string
    extra_files: string[]
    libs: Library
    exec: Executable[]
}

interface Library {
    source_dirs: string
    exposed_modules: string[]
    depends: string[]
}

interface Executable {
    name: string
    main_is: string
    depends: string[]
    source_dirs: string
    target_lang: string
}

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
export const initial_cfg:Config = {
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