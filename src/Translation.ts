import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

export function build_recursively(){
    console.log("fak ur madda");
    
}

export function translate_module(mod){
    // TODO: Fix at vi ikke har filepaths
    // Måske brug temp files?
    const program: ts.Program = ts.createProgram(filepath, {});
    const typeChecker: ts.TypeChecker = program.getTypeChecker();

    const functions: string[] = [];
    const includes: string[] = [];
    let src: string = "";
    // TODO: Fix at vi ikke har filepaths
    if (!filepath.isDeclarationFile) {
        // TODO: Fix at vi ikke har filepaths
        visitNode(filepath, functions, includes, src, typeChecker, program);
    }

    const classContent = functions.join('\n');
    const includesContent = includes.join('\n');
    const code = create_code_string(classContent, includesContent, src)
    fs.writeFileSync("outputFileName.ts", code);

}

function create_code_string(class_str, includes_str, src){
    return `
    export namespace NAME {
      ${class_str}
    }
    ${includes_str}
    export const main_is = '${src}';
  `
}

// TODO: Fix at vi ikke har filepaths
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
