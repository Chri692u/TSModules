import { pipe } from 'fp-ts/lib/function';
import * as P from 'parser-ts/lib/Parser';
import * as C from 'parser-ts/lib/char';
import * as S from 'parser-ts/lib/string';
import { run } from 'parser-ts/lib/code-frame'
import { Either, isLeft } from 'fp-ts/lib/Either';

//Forbedreinger version af module parseren
// 1. Skal kunne parse en optional semi-colon
// 2. exports og imports skal være optional
// 3. export skal kunne bruge en * for at eksportere alt
// 4. Skal kunne parse fil extensions
// 5. Der skal typer paa
// 6. Support for comments

const moduleString1 = `module Main where { imports: functionLibraryXD, functionLibrary, hello exports: main, helloXD }`;
const moduleString2 = `module Main where {
    imports: functionLibrary1, functionLibrary2, hello2
    exports: main, hello1
  }`;



// Lexer
const whitespace = P.surroundedBy(S.spaces)
const identifier = C.many1(C.alphanum)

// Keywords
const moduleKeyword = S.string("module")
const whereKeyword = S.string("where")
const importKeyword = S.string("imports:")
const exportKeyword = S.string("exports:")

// Symbols
const comma = C.char(',')
const openCurly = whitespace(C.char("{"))
const closeCurly = whitespace(C.char("}"))

// Parsers
const modDecl = pipe(
    moduleKeyword,
    P.chain(() => whitespace(identifier)),
    P.apFirst(whitespace(whereKeyword)),
)

const parseImports = pipe(
    importKeyword,
    P.chain(() => P.sepBy(comma, whitespace(identifier)))
)

const parseExports = pipe(
    exportKeyword,
    P.chain(() => P.sepBy(comma, whitespace(identifier)))
)


const modBody = pipe(
    whitespace(parseImports),
    P.chain(imports => pipe(
        whitespace(parseExports),
        P.map(exports => [imports, exports])
    ))
);

const parseModule = pipe(
    modDecl,
    P.apFirst(openCurly),
    P.chain(name => pipe(
        modBody,
        P.map(([imports, exports]) => ({ name, imports, exports }))
    )),

    P.apFirst(closeCurly)
)


export function runParser(input: string) {
    const result = run(parseModule, input)
    if (isLeft(result)) {
        console.log(result.left)
    }
    return result
}
