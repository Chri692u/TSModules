import * as P from 'parser-ts/lib/Parser'
import * as S from 'parser-ts/lib/string'
import { pipe } from 'fp-ts/function';
import { run } from "parser-ts/lib/code-frame";

// Parser for the 'module Main where {' part
const moduleParser = pipe(
    S.string('module Main where {'),
    P.map(() => ({}))
)

// Parser for the 'imports: ' part
const importsParser = pipe(
    S.string('imports: '),
    P.map(() => ({}))
)

// Parser for the 'exports: ' part
const exportsParser = pipe(
    S.string('exports: '),
    P.map(() => ({}))
)

// Parser for the '}' part
const endParser = pipe(
    S.string('}'),
    P.map(() => ({}))
)

// Parser for the function libraries
const functionLibraryParser = pipe(
    S.spaces,
    //@ts-ignore
    P.apSecond(S.identifier),
    //@ts-ignore
    P.sepBy(S.string(','))
)

// Parser for the main function
const mainFunctionParser = pipe(
    S.spaces,
    //@ts-ignore
    P.apSecond(S.identifier)
)

// Combine all the parsers
const fullParser = pipe(
    moduleParser,
    P.chain(() => importsParser),
    //@ts-ignore
    P.chain(() => functionLibraryParser),
    P.bindTo('imports'),
    P.chain(() => exportsParser),
    P.chain(() => mainFunctionParser),
    P.bindTo('exports'),
    P.chain(() => endParser)
)

// Test the parser


console.log(run(fullParser, "module Main where { imports: functionLibrary1, functionLibrary2 exports: main }"))
