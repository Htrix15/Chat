import {ChatGroup} from './chat-group'
import { ChatMessage } from './chat-message';

export class DataShell {
    constructor(
        public datas: Array<ChatGroup|ChatMessage>,
        public data: ChatGroup|ChatMessage,
        public errors: Array<string>,
        public result: string
    ){}
}
