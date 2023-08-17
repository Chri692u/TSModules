"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
// import * as file from "../Example/tsmodules.json";
// Function to create a module class from a typescript file
function makeModule(path) {
    // Read the typescript file
    // Parse file to AST
    // Compile AST into functions
    // return module class
}
// support for npm-packages
function exposePackage(name, imports) {
    //if the package name is in the tsmodules config
    //create a module from the package with imports
    //if imports == null, then just the entire package
}
function imports(filePaths) {
    var program = ts.createProgram(filePaths, {});
    var typeChecker = program.getTypeChecker();
    var sourceFiles = program.getSourceFiles();
    var functions = [];
    var includes = [];
    var mainFile = "";
    for (var _i = 0, sourceFiles_1 = sourceFiles; _i < sourceFiles_1.length; _i++) {
        var sourceFile = sourceFiles_1[_i];
        if (!sourceFile.isDeclarationFile) {
            console.log('Visiting source file:', sourceFile.fileName);
            visitNode(sourceFile, functions, includes, mainFile, typeChecker, program);
        }
    }
    var classContent = functions.join('\n');
    var includesContent = includes.join('\n');
    var namespaceTemplate = "\n      export namespace negermand {\n        ".concat(classContent, "\n      }\n  \n      ").concat(includesContent, "\n  \n      export const main_is = '").concat(mainFile, "';\n    ");
    fs.writeFileSync("outputFileName.ts", namespaceTemplate);
}
function visitNode(node, functions, includes, mainFile, checker, program) {
    if (ts.isFunctionDeclaration(node) && !(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private)) {
        //@ts-ignore
        var symbol = checker.getSymbolAtLocation(node.name);
        if (symbol) {
            var functionName = symbol.name;
            var returnType = checker.getTypeAtLocation(node);
            //@ts-ignore
            functions.push(generateFunction(node.name.getText(), node.body, node.parameters, "any", program));
        }
    }
    if (ts.isImportDeclaration(node)) {
        var importPath = node.moduleSpecifier.getText().replace(/['"]/g, '');
        includes.push("import '".concat(importPath, "';"));
    }
    if (ts.isSourceFile(node) && node.fileName.endsWith('main.ts')) {
        mainFile = node.fileName;
    }
    ts.forEachChild(node, function (childNode) {
        visitNode(childNode, functions, includes, mainFile, checker, program);
    });
}
function generateFunction(functionName, functionBody, parameters, returnType, program) {
    //@ts-ignore
    var formattedFunctionBody = ts.createPrinter().printNode(ts.EmitHint.Unspecified, functionBody, program.getSourceFile(''));
    var parameterList = __spreadArray([], parameters, true).map(function (parameter) { return parameter.getText(); }).join(', ');
    return "function ".concat(functionName, "(").concat(parameterList, "): ").concat(returnType, " ").concat(formattedFunctionBody, " ");
}
function getFiles(dir) {
    var files = [];
    var readDirRecursively = function (dirPath) {
        var entries = fs.readdirSync(dirPath);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            var fullPath = path.join(dirPath, entry);
            var stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                readDirRecursively(fullPath);
            }
            else if (stat.isFile() && fullPath.endsWith('.ts')) {
                files.push(fullPath);
            }
        }
    };
    readDirRecursively(dir);
    return files;
}
var files = getFiles("Example/src");
imports(files);
