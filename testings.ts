function parseModule(moduleString: string) {
    const moduleObject: any = {};

    const nameMatch = moduleString.match(/module\s+(\w+)/);
    moduleObject.name = nameMatch ? nameMatch[1] : null;

    const importsMatch = moduleString.match(/imports:\s+([^}]+?)\s+exports:/);
    moduleObject.imports = importsMatch ? importsMatch[1].split(',').map(item => item.trim()) : [];

    const exportsMatch = moduleString.match(/exports:\s+(.+)/);
    moduleObject.exports = exportsMatch ? exportsMatch[1].split(',').map(item => item.replace("}", "").trim()) : [];

    return moduleObject;
}

const moduleString1 = `module Main where { imports: functionLibrary1, functionLibrary2, hello2 exports: main, hello1 }`;
const moduleString2 = `
  module Main where {
    imports: functionLibrary1, functionLibrary2, hello2
    exports: main, hello1
  }`;

const moduleObject1 = parseModule(moduleString1);
console.log(moduleObject1);

const moduleObject2 = parseModule(moduleString2);
console.log(moduleObject2);
