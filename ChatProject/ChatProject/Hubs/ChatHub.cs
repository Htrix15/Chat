using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChatProject.Hubs
{
    public class ChatHub: Hub
    {
        private string Group {
            get {
                return this.Context.GetHttpContext().Request.RouteValues["id"].ToString();
            }
        }
        public async Task Entrance(string nick)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, this.Group);
            await Clients.Group(this.Group).SendAsync("SendToAll", $"{nick} подключился к {this.Group}");
        }
        public async Task SendToAll(string message)
        {
            await this.Clients.Group(this.Group).SendAsync("SendToAll", message + " " + this.Group);
        }
    }
}