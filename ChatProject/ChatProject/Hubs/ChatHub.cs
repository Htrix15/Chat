using System.Reflection.Metadata;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using ChatProject.Models;
using ChatProject.Interfaces;
using ChatProject.ServicesClasses;
using ChatProject.Services;
using ChatProject.RequestValidators;
using ChatProject.RequestValidators.Rules;
using System.Linq;

namespace ChatProject.Hubs
{
    public class ChatHub: Hub
    {
        private readonly ValidateRequest _validateRequest;
        private readonly ChatOperations _chatOperations;
        public ChatHub(ValidateRequest validateRequest, ChatOperations chatOperations){
            _validateRequest = validateRequest;
            _chatOperations = chatOperations;
        } 
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
            await _validateRequest.ValidateAsync(Group, new MyValidator(new StringIsInt()), _chatOperations.IncrementMessageCount);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.GroupExcept(Group, Context.ConnectionId).SendAsync("SendToAll", new ChatMessage(){Nick =  UserName, Text = "вошел в чат"});
            await base.OnConnectedAsync();
            await _validateRequest.ValidateAsync(Group, new MyValidator(new StringIsInt()), _chatOperations.IncrementUserCount);
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, Group);
            await Clients.Group(Group).SendAsync("SendToAll", new ChatMessage(){Nick =  UserName, Text = "покинул чат"});
            await base.OnDisconnectedAsync(exception);
            await _validateRequest.ValidateAsync(Group, new MyValidator(new StringIsInt()), _chatOperations.DecrementUserCount);
        }
    }
}