"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initial_cfg = void 0;
// Default main executable
var initial_exec = {
    name: "main",
    main_is: "main.ts",
    depends: [
        "base"
    ],
    source_dirs: "app",
    target_lang: "ES6"
};
// Default config
exports.initial_cfg = {
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
};
