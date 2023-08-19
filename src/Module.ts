// module class
class Module {
    private moduleName: string; //Rewrite after importer
    private exports: string[]; //Rewrite after importer
  
    constructor(moduleName: string, exports: string[]) {
        this.moduleName = moduleName;
        this.exports = exports;
    }
}


