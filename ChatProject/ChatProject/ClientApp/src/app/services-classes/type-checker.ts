import {ChatGroup} from '../models/chat-group'
import {DataShell} from '../models//data-shell'

export class TypeChecker{
    public static checkType<T>(data:any, field:string): data is T{
        return (<T>data)[field] !== void 0;
    }
}