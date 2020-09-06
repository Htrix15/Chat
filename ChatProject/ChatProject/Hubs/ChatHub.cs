using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using ChatProject.Models;
using ChatProject.Services;
using ChatProject.Validators;
using ChatProject.Validators.Rules.StringTypeCheck;
using ChatProject.Validators.Rules;

namespace ChatProject.Hubs
{
    public class ChatHub: Hub
    {
        private readonly ValidateRequest _validateRequest;
        private readonly ChatOperations _chatOperations;
        private StringValidator validator;
        public ChatHub(ValidateRequest validateRequest, ChatOperations chatOperations){
            _validateRequest = validateRequest;
            _chatOperations = chatOperations;
            validator = new StringValidator(new StringLength(250));
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
            if(validator.Validate(message).CheckNotError()){
                await Clients.GroupExcept(Group, Context.ConnectionId).SendAsync("SendToAll", new ChatMessage(UserName, message));
                await Clients.Client(Context.ConnectionId).SendAsync("SendToAll", new ChatMessage(UserName, message, "your"));
                await _validateRequest.ValidateAsync(Group, new StringValidator(new StringIsInt()), _chatOperations.IncrementMessageCount);
            } else {
                await Clients.Client(Context.ConnectionId).SendAsync("SendToAll", new ChatMessage(UserName, "Неподходящий формат текста", "error"));
            }
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.GroupExcept(Group, Context.ConnectionId).SendAsync("SendToAll", new ChatMessage(UserName, "Вошел в чат", "service"));
            await base.OnConnectedAsync();
            await _validateRequest.ValidateAsync(Group, new StringValidator(new StringIsInt()), _chatOperations.IncrementUserCount);
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, Group);
            await Clients.Group(Group).SendAsync("SendToAll", new ChatMessage(UserName, "Покинул чат", "service"));
            await base.OnDisconnectedAsync(exception);
            await _validateRequest.ValidateAsync(Group, new StringValidator(new StringIsInt()), _chatOperations.DecrementUserCount);
        }
    }
}