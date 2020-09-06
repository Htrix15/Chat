export class TypeChecker{
    public static checkType<T>(data:any, field:string): data is T{
        return (<T>data)[field] !== void 0;
    }
}