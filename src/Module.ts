// module class
export class Module {
    private moduleName: string; //Rewrite after importer
    private exports: string[]; //Rewrite after importer
    private imports: string[];  //Rewrite after importer

    constructor(moduleName: string, imports: string[], exports: string[]) {
        this.moduleName = moduleName;
        this.imports = imports
        this.exports = exports;
    }
}


