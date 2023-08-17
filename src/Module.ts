// module class
class Module {
    private moduleName: string;
    private exports: string[];
  
    constructor(moduleName: string, exports: string[]) {
      this.moduleName = moduleName;
      this.exports = exports;
    }
  
    public fromFile(): string {
        return "XD"
    }
}