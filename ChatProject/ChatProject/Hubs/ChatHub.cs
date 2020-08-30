using System.Reflection.Metadata;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using ChatProject.Models;

namespace ChatProject.Hubs
{
    public class ChatHub: Hub
    {
        private string Group {
            get {
                return this.Context.GetHttpContext().Request.RouteValues["id"].ToString();
            }
        }
        private string UserName {
            get {
                return this.Context.GetHttpContext().Request.RouteValues["name"].ToString();
            }
        }

        public async Task AddingUserToGroup(){
            await Groups.AddToGroupAsync(Context.ConnectionId, Group);
        }

        public async Task SendToAll(string message)
        {
             await Clients.Group(Group).SendAsync("SendToAll", new ChatMessage(){Nick =  UserName, Text = message});
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.GroupExcept(Group, Context.ConnectionId).SendAsync("SendToAll", new ChatMessage(){Nick =  UserName, Text = "вошел в чат"});
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, Group);
            await Clients.Group(Group).SendAsync("SendToAll", new ChatMessage(){Nick =  UserName, Text = "покинул чат"});
            await base.OnDisconnectedAsync(exception);
        }
    }
}