"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var P = require("parser-ts/lib/Parser");
var S = require("parser-ts/lib/string");
var function_1 = require("fp-ts/function");
var code_frame_1 = require("parser-ts/lib/code-frame");
// Parser for the 'module Main where {' part
var moduleParser = (0, function_1.pipe)(S.string('module Main where {'), P.map(function () { return ({}); }));
// Parser for the 'imports: ' part
var importsParser = (0, function_1.pipe)(S.string('imports: '), P.map(function () { return ({}); }));
// Parser for the 'exports: ' part
var exportsParser = (0, function_1.pipe)(S.string('exports: '), P.map(function () { return ({}); }));
// Parser for the '}' part
var endParser = (0, function_1.pipe)(S.string('}'), P.map(function () { return ({}); }));
// Parser for the function libraries
var functionLibraryParser = (0, function_1.pipe)(S.spaces, 
//@ts-ignore
P.apSecond(S.identifier), 
//@ts-ignore
P.sepBy(S.string(',')));
// Parser for the main function
var mainFunctionParser = (0, function_1.pipe)(S.spaces, 
//@ts-ignore
P.apSecond(S.identifier));
// Combine all the parsers
var fullParser = (0, function_1.pipe)(moduleParser, P.chain(function () { return importsParser; }), 
//@ts-ignore
P.chain(function () { return functionLibraryParser; }), P.bindTo('imports'), P.chain(function () { return exportsParser; }), P.chain(function () { return mainFunctionParser; }), P.bindTo('exports'), P.chain(function () { return endParser; }));
// Test the parser
console.log((0, code_frame_1.run)(fullParser, "module Main where { imports: functionLibrary1, functionLibrary2 exports: main }"));
