import { pipe } from 'fp-ts/lib/function';
import * as P from 'parser-ts/lib/Parser';
import * as C from 'parser-ts/lib/char';
import * as S from 'parser-ts/lib/string';
import { run } from 'parser-ts/lib/code-frame'
import { Either, isLeft } from 'fp-ts/lib/Either';

const moduleString1 = `module Main where { imports: functionLibraryXD, functionLibrary, hello exports: main, helloXD }`;
const moduleString2 = `module Main where {
    imports: functionLibrary1, functionLibrary2, hello2
    exports: main, hello1
  }`;


interface ModName {
  readonly _tag: 'Name'
  readonly value: string
}

interface ModImport {
  readonly _tag: 'Imports'
  readonly value: string
}

interface ModExport {
  readonly _tag: 'Exports'
  readonly value: string
}

const ModName = (value: string): ModName => ({ _tag: 'Name', value })
const ModImps = (value: string): ModImport => ({ _tag: 'Imports', value })
const ModExs = (value: string): ModExport => ({ _tag: 'Exports', value })

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
  P.map(ModName)
)

const parseImports = pipe(
  importKeyword,
  P.apSecond(whitespace(identifier)),
  P.map(ModImps)
)

const modBody = pipe(
  whitespace(parseImports),
  //P.apFirst(whitespace(parseExports))
)

const parseModule = pipe(
  modDecl,
  P.apFirst(openCurly),
  P.apFirst(modBody),
  P.apFirst(closeCurly)
)

let test = run(parseModule, "module Main where { imports: lmaotest }")
console.log(test);
