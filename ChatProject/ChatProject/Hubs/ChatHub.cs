using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChatProject.Hubs
{
    public class ChatHub: Hub
    {
        public async Task Entrance(string nick)
        {
            string group = this.Context.GetHttpContext().Request.RouteValues["id"].ToString();
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
            await Clients.Group(group).SendAsync("SendToAll", $"{nick} подключился к {group}");
        }
        public async Task SendToAll(string message)
        {
            string group = this.Context.GetHttpContext().Request.RouteValues["id"].ToString();
            await this.Clients.Group(group).SendAsync("SendToAll", message + " " + group);
        }
    }
}