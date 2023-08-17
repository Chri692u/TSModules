interface Config {
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
