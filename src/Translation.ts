import * as fss from 'fs';
import * as fs from "fs/promises";
import * as path from 'path';
import * as ts from 'typescript';
import type { Module } from "./Module"

export function build_recursively(){
    console.log("fak ur madda");
    
}

export async function translate_module(mod: Module, temp_path:any, dist: string){
    const functions: string[] = [];
    const includes: string[] = [];
    let src: string = "";
    let module_dist = path.join(dist, mod.moduleName + ".ts")

    await fs.writeFile(temp_path, mod.code);
    
    // DØR HER?
    // Måske har det noget at gøre med temp_path
    // I do not know
    const program: ts.Program = ts.createProgram(temp_path, {});
    const typeChecker: ts.TypeChecker = program.getTypeChecker();
    
    if (!temp_path.isDeclarationFile) {
        visitNode(temp_path, functions, includes, src, typeChecker, program);
    }

    const classContent = functions.join('\n');
    const includesContent = includes.join('\n');
    const code = create_code_string(classContent, includesContent, src)
    
    await fs.writeFile(module_dist, code);
}

function create_code_string(class_str:string, includes_str:string, src:string){
    return `
    export namespace NAME {
      ${class_str}
    }
    ${includes_str}
    export const main_is = '${src}';
  `
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
        const entries = fss.readdirSync(dirPath);

        for (const entry of entries) {
            const fullPath: string = path.join(dirPath, entry);
            const stat: fss.Stats = fss.statSync(fullPath);

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
