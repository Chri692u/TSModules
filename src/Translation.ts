//Genbrug meget fra importer og så slet importer


/*
function makeWorkspace(main, depends):
    -> workspacets navn er modulets navn
    -> imports = funktioner der skal compiles og i scope
        -> ud fra imports, find de filer og compile den
            -> det har nu et workspace vi kan bruge
    -> exports = functioner der skal compiles og laves til workspace
        -> vi finder de steder hvor der er bruges funktioner fra import
            -> omdøb navne: f.eks så bliver importedFunction til ModuleName.importedFunction
                -> compile workspace
    -> Skriv alle workspaces til en dist folder

    Note: Vi kan starte med at give den "main" modulet. Så kører vi bare makeWorkspace rekursivt ned gennems dens import moduler.
          Og skriver alt til samme dist folder
*/