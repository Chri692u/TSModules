// module class
export class Module {
    public moduleName: string
    public exports: string[]
    public imports: string[]
    public code: string

    constructor(moduleName: string, imports: string[], exports: string[], code:string) {
        this.moduleName = moduleName;
        this.imports = imports
        this.exports = exports
        this.code = code
    }
}