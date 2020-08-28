import {ChatGroup} from './chat-group'

export class DataShell {
    constructor(
        public datas: Array<ChatGroup|any>,
        public data: ChatGroup|any,
        public errors: Array<string>,
        public result: string
    ){}
}
