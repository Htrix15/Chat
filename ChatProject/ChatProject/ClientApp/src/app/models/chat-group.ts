export class ChatGroup {
    constructor(
        public Id: number,
        public Name: string,
        public Private: boolean,
        public Password: string,
        public UserCount: number,
        public DateCreated: Date,
        public DateLastMessage: Date
    ){}
}
