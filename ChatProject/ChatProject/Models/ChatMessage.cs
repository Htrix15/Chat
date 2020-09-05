namespace ChatProject.Models
{
    public class ChatMessage
    {
        public string Nick {get; set;}
        public string Text {get; set;}

        public string Type {get; set;}

        public ChatMessage(string Nick, string Text, string Type = "all"){
            this.Nick = Nick;
            this.Text = Text;
            this.Type = Type;
        }
    }
}