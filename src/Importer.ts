// Function to create a module class from a typescript file
function makeModule(path:string) {
    // Read the typescript file
    // Parse file to AST
    // Compile AST into functions
    // return module class
}

// support for npm-packages
function exposePackage(name:string, imports:string[]) {
    //if the package name is in the tsmodules config
        //create a module from the package with imports
        //if imports == null, then just the entire package
}