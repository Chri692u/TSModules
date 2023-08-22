import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
// import * as file from "../Example/tsmodules.json";



// Function to create a module class from a typescript file
function makeModule(path: string) {
    // Read the typescript file
    // Parse file to AST
    // Compile AST into functions
    // return module class
}

// support for npm-packages
function exposePackage(name: string, imports: string[]) {
    //if the package name is in the tsmodules config
    //create a module from the package with imports
    //if imports == null, then just the entire package
}


function imports(filePaths: string[]): void {
    const program: ts.Program = ts.createProgram(filePaths, {});
    const typeChecker: ts.TypeChecker = program.getTypeChecker();
    const sourceFiles = program.getSourceFiles();

    const functions: string[] = [];
    const includes: string[] = [];
    let mainFile: string = "";

    for (const sourceFile of sourceFiles) {
        if (!sourceFile.isDeclarationFile) {
            console.log('Visiting source file:', sourceFile.fileName);
            visitNode(sourceFile, functions, includes, mainFile, typeChecker, program);
        }
    }

    const classContent = functions.join('\n');
    const includesContent = includes.join('\n');

    const namespaceTemplate = `
      export namespace negermand {
        ${classContent}
      }
      ${includesContent}
      export const main_is = '${mainFile}';
    `;

    fs.writeFileSync("outputFileName.ts", namespaceTemplate);
}

function visitNode(
    node: ts.Node,
    functions: string[],
    includes: string[],
    mainFile: string,
    checker: ts.TypeChecker,
    program: ts.Program
): void {
    if (ts.isFunctionDeclaration(node) && !(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private)) {
        //@ts-ignore
        const symbol = checker.getSymbolAtLocation(node.name);
        if (symbol) {
            const functionName = symbol.name;
            const returnType = checker.getTypeAtLocation(node);
            //@ts-ignore
            functions.push(generateFunction(node.name.getText(), node.body, node.parameters, "any", program));
        }
    }

    if (ts.isImportDeclaration(node)) {
        const importPath = node.moduleSpecifier.getText().replace(/['"]/g, '');
        includes.push(`import '${importPath}';`);
    }

    if (ts.isSourceFile(node) && node.fileName.endsWith('main.ts')) {
        mainFile = node.fileName;
    }

    ts.forEachChild(node, childNode => {
        visitNode(childNode, functions, includes, mainFile, checker, program);
    });
}

function generateFunction(functionName: string, functionBody: ts.Block, parameters: ts.NodeArray<ts.ParameterDeclaration>, returnType: string, program: ts.Program): string {
    //@ts-ignore
    const formattedFunctionBody = ts.createPrinter().printNode(ts.EmitHint.Unspecified, functionBody, program.getSourceFile(''));
    const parameterList = [...parameters].map(parameter => parameter.getText()).join(', ');
    return `function ${functionName}(${parameterList}): ${returnType} ${formattedFunctionBody} `;
}



function getFiles(dir: string): string[] {
    const files: string[] = [];

    const readDirRecursively = (dirPath: string) => {
        const entries = fs.readdirSync(dirPath);

        for (const entry of entries) {
            const fullPath: string = path.join(dirPath, entry);
            const stat: fs.Stats = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                readDirRecursively(fullPath);
            } else if (stat.isFile() && fullPath.endsWith('.ts')) {
                files.push(fullPath);
            }
        }
    };

    readDirRecursively(dir);
    return files;
}
const files:string[] = getFiles("Example/src");
imports(files);
