export class MyMessage {
    constructor(
      public messageText: string | Array<string>,
      public error: boolean = true
    ) { }
  }
  