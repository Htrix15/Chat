export class ChatMessage {
    constructor(
        public nick: string,
        public text: string,
        public type?: string
    ){}
}
